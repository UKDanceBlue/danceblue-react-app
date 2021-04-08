import React from 'react'
import { Text, View, StyleSheet, ActivityIndicator } from 'react-native'
import { FlatGrid } from 'react-native-super-grid'

import Badge from './badge.js'

import { withFirebaseHOC } from '../../../config/Firebase'

class Badges extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      userID: props.userID,
      badges: [],
      isLoading: true
    }
  }

  componentDidMount () {
    let badges = []
    this.props.firebase.getUserBadges(this.state.userID).then(snapshot => {
      snapshot.forEach(doc => {
        badges.push(doc.data())
      })
      this.setState({badges: badges, isLoading: false})
    })
  }

  render () {
    return (
      <>
        {this.state.isLoading && (
          <ActivityIndicator style={styles.image} size='large' color='blue' />
        )}
        {!this.state.isLoading && (
          <>
            {this.state.badges.length === 0 ? (
              <Text>You currently have no badges. Check back later to see if you've earned any!</Text>
            ) : (
              <FlatGrid
                itemDimension={130}
                data={this.state.badges}
                spacing={10}
                renderItem={({ item }) => (
                  <Badge
                    name={item.name}
                    imageURL={item.image}
                    time={item.timeEarned}
                  />
                )}
              />
            )}
          </>
        )}
      </>
    )
  }
}

const styles = StyleSheet.create({

})

export default withFirebaseHOC(Badges)
