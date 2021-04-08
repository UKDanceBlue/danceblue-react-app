import React from 'react'
import { Text, View, StyleSheet } from 'react-native'

import { withFirebaseHOC } from '../../../config/Firebase'

class ScavengerHunt extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
    }
  }

  componentDidMount () {

  }

  render () {
    return (
      <Text>Test</Text>
    )
  }
}

const styles = StyleSheet.create({

})

export default withFirebaseHOC(ScavengerHunt)
