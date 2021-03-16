import React, { Component } from 'react'
import {
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableHighlight,
  Platform,
  View,
  Image
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
      this.setState({ isLoading: false, ...doc.data() })
      this.props.firebase.getDocumentURL(doc.data().image).then(url => {
        this.setState({ imageRef: url })
      }).catch(error => console.log(error.message))
    }).then(this.checkCalendarPermissions)
  }

  checkCalendarPermissions () {
    return Calendar.requestCalendarPermissionsAsync()
  }

  checkDBCalendar () {
    let foundCalendar = false
    const promises = []
    return Calendar.getCalendarsAsync().then(calendars => {
      calendars.forEach(calendar => {
        if (calendar.name === 'dancebluemobile') {
          this.setState({ calendarID: calendar.id })
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
    const eventConfig = {
      title: `DanceBlue: ${this.state.title}`,
      startDate: (this.state.startTime ? this.state.startTime.toDate().toUTCString() : null)
    }
    return (
      <>
        {this.state.isLoading && (
          <ActivityIndicator style={styles.image} size='large' color='blue' />
        )}
        {!this.state.isLoading && (
          <View style={{ flex: 1, justifyContent: 'flex-start' }}>
            <Image source={{ uri: this.state.imageRef }} style={styles.image} />
            <View style={styles.buttonContainer}>
              <TouchableHighlight
                onPress={() => openMap({ query: this.state.address })}
                style={styles.button}
              >
                <Text style={styles.buttonText}>Get Directions</Text>
              </TouchableHighlight>
              <TouchableHighlight
                  style={styles.button}
                  onPress={() => this.addToCalendar()}
              >
                <Text style={styles.buttonText}>Add to Calendar</Text>
              </TouchableHighlight>
            </View>
          </View>
        )}
      </>
    )
  }
}

const styles = StyleSheet.create({
  image: {
    height: 250,
    width: '100%'
  },
  button: {
    backgroundColor: '#0033A0E0',
    borderRadius: 5,
    padding: 10,
    width: '45%',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flex: 1
  },
  buttonText: {
    color: 'white'
  }
})

export default withFirebaseHOC(Event)
