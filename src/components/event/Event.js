import React, { Component } from 'react'
import {
  Text,
  ActivityIndicator,
  StyleSheet,
  Button
} from 'react-native'
import openMap from 'react-native-open-maps'

import { withFirebaseHOC } from '../../../config/Firebase'

class Event extends Component {
  constructor (props) {
    super(props)

    this.state = {
      isLoading: true,
      id: props.route.params.id
    }
  }

  componentDidMount () {
    this.props.firebase.getEvent(this.state.id).then(doc => {
      this.setState({ isLoading: false, ...doc.data() });
    })
  }

  render () {
    return (
      <>
        {this.state.isLoading && (
          <ActivityIndicator style={styles.image} size='large' color='blue' />
        )}
        {!this.state.isLoading && (
          <Button color={'#bdc3c7'} onPress={() => openMap({ query: this.state.address })} title='Get Directions' />
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
