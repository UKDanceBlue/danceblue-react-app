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

class Event extends Component {
  constructor (props) {
    super(props)

    this.state = {
      isLoading: true,
      id: props.route.params.id
    }

    this.checkCalendarPermissions = this.checkCalendarPermissions.bind(this)
    this.getPrimaryCalendar = this.getPrimaryCalendar.bind(this)
  }

  componentDidMount () {
    this.props.firebase.getEvent(this.state.id).then(doc => {
      this.setState({ isLoading: false, ...doc.data() });
    }).then(this.checkCalendarPermissions)
  }

  async checkCalendarPermissions () {
    let { status } = await Calendar.requestCalendarPermissionsAsync()
    if (status === 'granted') {
      this.getPrimaryCalendar()
    }
  }

  async getPrimaryCalendar () {
    if (Platform.OS === 'ios') {
      Calendar.getDefaultCalendarAsync().then(calendar => {
        this.setState({ calendarID: calendar.id})
      })
    } else {
      Calendar.getCalendarsAsync().then(calendars => {
        calendars.forEach(calendar => {
          console.log(calendar.isPrimary)
          if (calendar.isPrimary) {
            this.setState({ calendarID: calendar.id })
          }
        })
      })
    }
  }

  render () {
    let eventConfig = {
      title: `DanceBlue: ${this.state.title}`,
      startDate: (this.state.startTime ? this.state.startTime.toDate().toUTCString() : null)
    }
    console.log(this.state.calendarID)
    return (
      <>
        {this.state.isLoading && (
          <ActivityIndicator style={styles.image} size='large' color='blue' />
        )}
        {!this.state.isLoading && (<>
          <Button color={'#bdc3c7'} onPress={() => openMap({ query: this.state.address })} title='Get Directions' />
          <Button color={'#bdc3c7'} onPress={() => console.log(this.state.calendarID)} title='Add to Calendar' /></>
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
