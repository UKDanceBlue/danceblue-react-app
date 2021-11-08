// Import third-party dependencies
import React from 'react'
import { StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Text } from 'react-native'

// Import first-party dependencies
import { withFirebaseHOC } from "../../firebase/FirebaseContext"
import EventRow from './EventRow'
import EventView from './EventView'

/**
 * Component for "Events" screen in main navigation
 * @param {Object} props Properties of the component: navigation, firebase
 * @author Kenton Carrier
 * @since 1.0.1
 * @class
 */
class EventScreen extends React.Component {
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

  /**
   * Called immediately after a component is mounted. Setting state here will trigger re-rendering.
   * @author Kenton Carrier
   * @since 1.0.1
   */
  componentDidMount () {
    const events = []
    this.props.firebase.getUpcomingEvents().then(snapshot => {
      snapshot.forEach(doc =>
        events.push({ id: doc.id, ...doc.data() })
      )
      this.setState({ events: events, isLoading: false }, () => this.splitEventArray())
    })
  }

  /**
   * Splits *this.state.events* into *this.state.today* and *this.state.upcoming* based on the events' start day
   * @author Kenton Carrier
   * @since 1.0.1
   */
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

  /**
   * Called by React Native when rendering the screen
   * @returns A JSX formatted Component
   * @author Kenton Carrier
   * @since 1.0.1
   */
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

EventScreen.navigationOptions = {
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

export default withFirebaseHOC(EventScreen)
