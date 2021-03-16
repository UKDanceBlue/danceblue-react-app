import React, { Component } from 'react'
import {
  Text,
  ActivityIndicator,
  StyleSheet,
  Button, Platform
} from 'react-native'
import openMap from 'react-native-open-maps'
import * as Calendar from 'expo-calendar'

import { withFirebaseHOC } from '../../../config/Firebase'

const danceBlueCalendarConfig = {
  title: 'DanceBlue',
  color: 'blue',
  enitityType: Calendar.EntityTypes.EVENT,
  source: {
    isLocalAccount: true,
    name: 'DanceBlue Mobile'
  },
  name: 'dancebluemobile',
  ownerAccount: 'DanceBlue Mobile',
  accessLevel: Calendar.CalendarAccessLevel.OWNER
}

class Event extends Component {
  constructor (props) {
    super(props)

    this.state = {
      isLoading: true,
      id: props.route.params.id
    }

    this.checkCalendarPermissions = this.checkCalendarPermissions.bind(this)
    this.checkDBCalendar = this.checkDBCalendar.bind(this)
    this.addToCalendar = this.addToCalendar.bind(this)
  }

  componentDidMount () {
    this.props.firebase.getEvent(this.state.id).then(doc => {
      this.setState({ isLoading: false, ...doc.data() });
    }).then(this.checkCalendarPermissions)
  }

  checkCalendarPermissions () {
    return Calendar.requestCalendarPermissionsAsync()
  }

  checkDBCalendar () {
    let foundCalendar = false
    let promises = []
    return Calendar.getCalendarsAsync().then(calendars => {
      calendars.forEach(calendar => {
        if (calendar.name === 'dancebluemobile') {
          this.setState({ calendarID: calendar.id})
          foundCalendar = true
        }
      })
    }).then(() => {
      if (!foundCalendar) {
        Calendar.createCalendarAsync(danceBlueCalendarConfig).then(id => this.setState({ calendarID: id }))
      }
    })
  }

  addToCalendar () {
    this.checkCalendarPermissions().then(this.checkDBCalendar).then(() => {
      return Calendar.createEventAsync(this.state.calendarID, {
        title: this.state.title,
        startDate: this.state.startTime.toDate(),
        endDate: this.state.endTime.toDate(),
        location: this.state.address
      })
    })
  }

  render () {
    let eventConfig = {
      title: `DanceBlue: ${this.state.title}`,
      startDate: (this.state.startTime ? this.state.startTime.toDate().toUTCString() : null)
    }
    return (
      <>
        {this.state.isLoading && (
          <ActivityIndicator style={styles.image} size='large' color='blue' />
        )}
        {!this.state.isLoading && (<>
          <Button color={'#bdc3c7'} onPress={() => openMap({ query: this.state.address })} title='Get Directions' />
          <Button color={'#bdc3c7'} onPress={() => this.addToCalendar()} title='Add to Calendar' /></>
        )}
      </>)
  }
}

const styles = StyleSheet.create({
  image: {
    flex: 1,
    width: 200,
    resizeMode: 'contain'
  }
})

export default withFirebaseHOC(Event)
