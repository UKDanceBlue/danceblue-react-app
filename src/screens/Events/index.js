// Import third-party dependencies
import React from 'react'
import { StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Text } from 'react-native'
import EventRow from '../../components/event/EventRow'
import { withFirebaseHOC } from '../../../config/Firebase'

// Component for events screen in main navigation
class EventsScreen extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      events: [],
      today: [],
      upcoming: [],
      isLoading: true
    }

    this.splitEventArray = this.splitEventArray.bind(this)
  }

  componentDidMount () {
    const events = []
    this.props.firebase.getUpcomingEvents().then(snapshot => {
      snapshot.forEach(doc =>
        events.push({ id: doc.id, ...doc.data() })
      )
      this.setState({ events: events, isLoading: false }, () => this.splitEventArray())
    })
  }

  splitEventArray () {
    const today = []
    const upcoming = []
    const now = new Date()
    this.state.events.forEach(event => {
      const startTime = event.startTime.toDate()
      if (startTime <= now) today.push(event)
      else upcoming.push(event)
    })
    this.setState({ today: today, upcoming: upcoming })
  }

  render () {
    const { navigate } = this.props.navigation
    return (
      <ScrollView style={styles.body}>
        <SafeAreaView>
          <Text style={styles.heading}>Today's Events</Text>
          {
            this.state.today.map((row) => (
              <TouchableOpacity style={styles.eventRow} onPress={() => navigate('Event', { id: row.id, name: row.title })} key={row.id}>
                <EventRow styles={styles} key={row.id} id={row.id} title={row.title} startDate={row.startTime.toDate()} endDate={row.endTime.toDate()} text={row.text} showIfToday imageLink={row.image} />
              </TouchableOpacity>
            ))
          }
          <Text style={styles.heading}>Upcoming Events</Text>
          {/* jscpd:ignore-start */
            this.state.upcoming.map((row) => (
              <TouchableOpacity style={styles.eventRow} onPress={() => navigate('Event', { id: row.id, name: row.title })} key={row.id}>
                <EventRow styles={styles} key={row.id} id={row.id} title={row.title} startDate={row.startTime.toDate()} endDate={row.endTime.toDate()} text={row.text} showIfToday imageLink={row.image} />
              </TouchableOpacity>
            ))
          /* jscpd:ignore-end */
          }
        </SafeAreaView>
      </ScrollView>
    )
  }
}

EventsScreen.navigationOptions = {
  title: 'Events'
}

const styles = StyleSheet.create({
  eventRow: {
    marginTop: 5,
    marginBottom: 5
  },
  body: {
    padding: 10,
    backgroundColor: 'white',
    flex: 1
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold'
  }
})

export default withFirebaseHOC(EventsScreen)
