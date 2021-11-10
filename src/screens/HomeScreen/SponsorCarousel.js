import React, { useEffect, useState } from 'react';
import { Text, View, ScrollView, StyleSheet } from 'react-native';
import SponsorCard from '../../common/components/ImageCard';

import { withFirebaseHOC } from '../../firebase/FirebaseContext';

/**
 * A horizontally scrolling carousel of SponsorCards
 */
const SponsorCarousel = ({ firestore }) => {
  const [sponsors, setSponsors] = useState([]);

  useEffect(() => {
    const dbSponsors = [];
    firestore.getSponsors().then((snapshot) => {
      snapshot.forEach((doc) => {
        dbSponsors.push({ ...doc.data(), id: doc.id });
      });
      setSponsors(dbSponsors);
    });
  }, [firestore]);

  const cards = sponsors.map((sponsor) => (
    <SponsorCard imageLink={sponsor.logo} sponsorLink={sponsor.link} key={sponsor.id} />
  ));

  return (
    <View style={styles.container}>
      <ScrollView ScrollEventThrottle={16}>
        <View style={styles.sponsorView}>
          <View style={styles.sponsorTitleView}>
            <Text style={styles.sponsorTitle}> SPONSORS </Text>
          </View>
          <View style={styles.cardScrollView}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ padding: 10 }}>
              {cards}
            </ScrollView>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  sponsorView: {
    padding: 5,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: 'white',
    flex: 1,
  },
  sponsorTitle: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
  },
  sponsorTitleView: {},
  cardScrollView: {
    height: 170,
    marginTop: 5,
  },
});

export default withFirebaseHOC(SponsorCarousel);
