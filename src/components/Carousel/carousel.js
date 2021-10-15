import React from 'react'
import { Text, View, ScrollView, StyleSheet } from 'react-native'
import Card from './card'

import { withFirebaseHOC } from '../../../config/Firebase'

/**
 * TODO
 * @param {Object} props Properties of the component: (TODO)
 * @returns A React Native component
 * @author Kenton Carrier
 * @since 1.0.1
 * @class
 */
class Carousel extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      sponsors: []
    }
  }

  /**
   * Called immediately after a component is mounted. Setting state here will trigger re-rendering.
   */
  componentDidMount () {
    const dbSponsors = []
    this.props.firebase.getSponsors().then(snapshot => {
      snapshot.forEach(doc => {
        dbSponsors.push({ ...doc.data(), id: doc.id })
      })
      this.setState({ sponsors: dbSponsors })
    })
  }

  /**
   * Called to generate a React Native component
   * @returns A JSX formatted component
   */
  render () {
    const cards = this.state.sponsors.map((sponsor, index) => (
      <Card
        imageLink={sponsor.logo}
        sponsorLink={sponsor.link}
        key={sponsor.id}
      />
    ))

    return (
      <View style={styles.container}>
        <ScrollView ScrollEventThrottle={16}>
          <View style={styles.sponsorView}>
            <View style={styles.sponsorTitleView}>
              <Text style={styles.sponsorTitle}> SPONSORS </Text>
            </View>
            <View style={styles.cardScrollView}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ padding: 10 }}
              >
                {cards}
              </ScrollView>
            </View>
          </View>
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden'
  },
  sponsorView: {
    padding: 5,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: 'white',
    flex: 1
  },
  sponsorTitle: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold'
  },
  sponsorTitleView: {
  },
  cardScrollView: {
    height: 170,
    marginTop: 5
  }
})

export default withFirebaseHOC(Carousel)
