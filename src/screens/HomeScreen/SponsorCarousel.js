import React from 'react'
import { Text, View, ScrollView, StyleSheet } from 'react-native'
import SponsorCard from '../../common/components/ImageCard'

import { withFirebaseHOC } from '../../../config/Firebase'

/**
 * A horizontally scrolling carousel of SponsorCards
 * @param {Object} props Properties of the component: firebase
 * @author Kenton Carrier
 * @since 1.0.1
 * @class
 */
class SponsorCarousel extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      sponsors: []
    }
  }

  /**
   * Called immediately after a component is mounted. Setting state here will trigger re-rendering.
   * @author Kenton Carrier
   * @since 1.0.1
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
   * @author Kenton Carrier
   * @since 1.0.1
   */
  render () {
    const cards = this.state.sponsors.map((sponsor, index) => (
      <SponsorCard
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

export default withFirebaseHOC(SponsorCarousel)