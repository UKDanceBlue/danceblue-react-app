// Import third-party dependencies
import React from 'react'
import { StyleSheet, ScrollView, SafeAreaView, View, TouchableOpacity, Text } from 'react-native'
import EventRow from '../../components/event/EventRow'
import { withFirebaseHOC } from '../../../config/Firebase'
// import Events from '../../components/event/Events'

// Component for events screen in main navigation
class EventsScreen extends React.Component {
  constructor(props) {
      super(props)

      this.state = {
          events: [],
          today: [],
          upcoming: [],
          isLoading: true
      }

      this.splitEventArray = this.splitEventArray.bind(this)
  }

  componentDidMount() {
      let events = []
      this.props.firebase.getUpcomingEvents().then(snapshot => {
          snapshot.forEach(doc =>
              events.push({ id: doc.id, ...doc.data() })
          )
          this.setState({ events: events, isLoading: false }, () => this.splitEventArray())
      })
  }

  splitEventArray () {
    let today = []
    let upcoming = []
    let now = new Date()
    this.state.events.forEach(event => {
      let startTime = event.startTime.toDate()
      if (startTime <= now) today.push(event)
      else upcoming.push(event)
    })
    this.setState({ today: today, upcoming: upcoming})
  }

  render () {
    const { navigate } = this.props.navigation
    return (
      <ScrollView>
        <SafeAreaView>
          <Text>Today's Events</Text>
          {
            this.state.today.map((row) => (
              <TouchableOpacity style={styles.button} onPress={() => navigate('Event', {id: row.id, name: row.title})} key={row.id}>
                <EventRow styles={styles} key={row.id} id={row.id} title={row.title} startDate={row.start_date} endDate={row.end_date} text={row.text} showIfToday={true} imageLink={row.image}/>
              </TouchableOpacity>
            ))
          }
        <Text>Upcoming Events</Text>
          {
            this.state.upcoming.map((row) => (
              <TouchableOpacity style={styles.button} onPress={() => navigate('Event', {id: row.id, name: row.title})} key={row.id}>
                <EventRow styles={styles} key={row.id} id={row.id} title={row.title} startDate={row.start_date} endDate={row.end_date} text={row.text} showIfToday={true} imageLink={row.image}/>
              </TouchableOpacity>
            ))
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
    button: {
      alignItems: 'center',
      margin: 10,
      height: 50,
      borderRadius: 10,
      flex: 1,
      backgroundColor: '#AAA'
    }
})

export default withFirebaseHOC(EventsScreen)
