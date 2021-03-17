import React, { Component } from 'react'
import {
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableHighlight,
  View,
  Image
} from 'react-native'
import openMap from 'react-native-open-maps'
import * as Calendar from 'expo-calendar'
import moment from 'moment'

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
    const startDate = (this.state.startTime ? moment(this.state.startTime.toDate()) : moment())
    const endDate = (this.state.endTime ? moment(this.state.endTime.toDate()) : moment())
    let whenString = ''
    if (startDate.isSame(endDate, 'day')) {
      whenString = `${startDate.format('M/D/YYYY h:mm a')} - ${endDate.format('h:mm a')}`
    } else {
      whenString = `${startDate.format('M/D/YYYY h:mm a')} - ${endDate.format('M/D/YYYY h:mm a')}`
    }
    return (
      <>
        {this.state.isLoading && (
          <ActivityIndicator style={styles.image} size='large' color='blue' />
        )}
        {!this.state.isLoading && (
          <View style={{ flex: 1, justifyContent: 'flex-start' }}>
            <Image source={{ uri: this.state.imageRef }} style={styles.image} />
            <View style={styles.body}>
              {this.state.description && (
                <Text style={styles.text}>
                  {this.state.description}
                </Text>
              )}
              {this.state.address && (
                <>
                  <Text style={styles.boldText}>Where?</Text>
                  <Text style={styles.text}>{this.state.address}</Text>
                </>
              )}
              {this.state.startTime && (
                <>
                  <Text style={styles.boldText}>When?</Text>
                  <Text style={styles.text}>{whenString}</Text>
                </>
              )}
              <View style={styles.buttonContainer}>
                {this.state.address && (
                  <TouchableHighlight
                    onPress={() => openMap({ query: this.state.address })}
                    style={styles.button}
                  >
                    <Text style={styles.buttonText}>Get Directions</Text>
                  </TouchableHighlight>
                )}
                {this.state.startTime && (
                  <TouchableHighlight
                    style={styles.button}
                    onPress={() => this.addToCalendar()}
                  >
                    <Text style={styles.buttonText}>Add to Calendar</Text>
                  </TouchableHighlight>
                )}
              </View>
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
    alignItems: 'center'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 10
  },
  buttonText: {
    color: 'white'
  },
  text: {
    fontSize: 17
  },
  boldText: {
    fontWeight: 'bold',
    fontSize: 17
  },
  body: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 15
  }
})

export default withFirebaseHOC(Event)
