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
          isLoading: true
      }
  }

  componentDidMount() {
      const events = []
      this.props.firebase.getEvents().then(snapshot => {
          snapshot.forEach(doc =>
              events.push({ id: doc.id, ...doc.data() })
          )
          this.setState({ events: events, isLoading: false })
      })
  }

  render () {
    const { navigate } = this.props.navigation

    return (
      <ScrollView>
        <SafeAreaView>
          {
              this.state.events.map((row) => (
                <TouchableOpacity style={styles.button} onPress={() => navigate('Event')} key={row.id}>
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
