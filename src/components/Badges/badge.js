import React from 'react'
import { Text, View, Image, StyleSheet, ActivityIndicator } from 'react-native'

import { withFirebaseHOC } from '../../../config/Firebase'

class Badge extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isLoading: true
    }
  }

  componentDidMount() {
    this.props.firebase.getDocumentURL(this.props.imageURL).then(url => {
      this.setState({ imageRef: url, isLoading: false })
    }).catch(error => console.log(error.message))
  }

  render () {
    console.log(this.state.imageRef)
    return (
      <View style={styles.container}>
        {this.state.isLoading && (
          <ActivityIndicator style={styles.image} size='large' color='blue' />
        )}
        {!this.state.isLoading && (
          <>
            <Image style={styles.icon} source={{ uri: this.state.imageRef }} />
            <Text>{this.props.name}</Text>
          </>
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'

  },
  icon: {
    width: 50,
    height: 50
  }
})

export default withFirebaseHOC(Badge)
