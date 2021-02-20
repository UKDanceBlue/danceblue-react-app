import React from 'react'
import { Text, View, ScrollView, StyleSheet } from 'react-native'
import SponsorCard from './SponsorCard'

// Import all of the sponsor pictures here
import hyundai from './assets/hyundai.png'
import aramark from './assets/aramark.jpg'
import coke from './assets/coke.png'
import enterprise from './assets/enterprise.jpg'
import hub from './assets/hub.png'
import jerseymikes from './assets/jersey-mikes.jpg'
import keeneland from './assets/keeneland.png'
import piefive from './assets/pie-five.jpg'
import ukfcu from './assets/uk-credit-union.png'
import ukhousing from './assets/uk-housing.jpg'
import ukifc from './assets/uk-ifc.png'
{ /* Carousel implementation for Sponsor showcase */ }

const Sponsors = props => {
  const sponsors = [
    {
      id: 1,
      imageLink: hyundai,
      sponsorLink: 'https://www.hyundaiusa.com/'
    },
    {
      id: 2,
      imageLink: aramark,
      sponsorLink: 'https://www.aramark.com/'
    },
    {
      id: 3,
      imageLink: coke,
      sponsorLink: 'https://us.coca-cola.com/'
    },
    {
      id: 4,
      imageLink: enterprise,
      sponsorLink: 'https://www.enterprisecarsales.com/'
    },
    {
      id: 5,
      imageLink: hub,
      sponsorLink: 'https://huboncampus.com/lexington/'
    },
    {
      id: 6,
      imageLink: jerseymikes,
      sponsorLink: 'https://www.jerseymikes.com/'
    },
    {
      id: 7,
      imageLink: keeneland,
      sponsorLink: 'https://keeneland.com/'
    },
    {
      id: 8,
      imageLink: piefive,
      sponsorLink: 'https://www.piefivepizza.com/'
    },
    {
      id: 9,
      imageLink: ukfcu,
      sponsorLink: 'https://www.ukfcu.org/'
    },
    {
      id: 10,
      imageLink: ukhousing,
      sponsorLink: 'https://www.uky.edu/housing/'
    },
    {
      id: 11,
      imageLink: ukifc,
      sponsorLink: 'http://www.kentuckyifc.com/'
    }
  ]

  return (
    <View style={styles.shadowsStyling}>
      <ScrollView ScrollEventThrottle={16}>
        <View style={styles.sponsorView}>
          <View style={styles.sponsorTitleView}>
            <Text style={styles.sponsorTitle}>SPONSORS</Text>
          </View>
          <View style={styles.cardScrollView}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ padding: 10 }}
            >
              {
                            sponsors.map((sponsor) => (
                              <SponsorCard
                                key={sponsor.id}
                                id={sponsor.id}
                                imageLink={sponsor.imageLink}
                                sponsorLink={sponsor.sponsorLink}
                              />
                            ))
                        }
            </ScrollView>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  sponsorView: {
    paddingLeft: 5,
    paddingTop: 5,
    paddingBottom: 5,
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: 'white',
    borderRadius: 15,
    overflow: 'hidden',
    flex: 1
  },
  sponsorTitle: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold'
  },
  sponsorTitleView: {
    borderBottomColor: '#0033A0',
    borderBottomWidth: 2
  },
  cardScrollView: {
    height: 170,
    marginTop: 5,
    padding: 5
  },
  shadowsStyling: {
    width: '95%',
    marginBottom: 10,
    shadowColor: 'gray',
    shadowOpacity: 0.5,
    shadowRadius: 6,
    shadowOffset: {
      height: 0,
      width: 0
    }
  }
})

export default Sponsors
