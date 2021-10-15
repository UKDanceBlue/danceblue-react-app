import React from 'react'
import { Text, View, StyleSheet, ActivityIndicator } from 'react-native'
import { FlatGrid } from 'react-native-super-grid'

import Badge from './badge.js'

import { withFirebaseHOC } from '../../../config/Firebase'

/**
 * A row of a user's {@link Badge}s loaded from Firebase
 * @param {Object} props Properties of the component: (imageURL, name)
 * @returns A React Native component
 * @author Kenton Carrier
 * @since 1.0.1
 * @class
 */
class Badges extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      userID: props.userID,
      badges: [],
      isLoading: true
    }
  }

  /**
   * Called immediately after a component is mounted. Setting state here will trigger re-rendering.
   */
  componentDidMount () {
    let badges = []
    this.props.firebase.getUserBadges(this.state.userID).then(snapshot => {
      snapshot.forEach(doc => {
        badges.push(doc.data())
      })
      this.setState({badges: badges, isLoading: false})
    })
  }

  /**
   * Called to generate a React Native component
   * @returns A JSX formatted component
   */
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
