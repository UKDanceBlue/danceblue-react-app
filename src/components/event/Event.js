import React, { Component } from 'react'
import {
  Text,
  ActivityIndicator,
  StyleSheet
} from 'react-native'

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
    return <>
    {this.state.isLoading && (
      <ActivityIndicator style={styles.image} size='large' color='blue' />
    )}
    {!this.state.isLoading && (
      <Text>{this.state.title}</Text>
    )}</>
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
