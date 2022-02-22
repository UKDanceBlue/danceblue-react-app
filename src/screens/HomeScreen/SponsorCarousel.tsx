/// <reference types="react" />
import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text } from 'react-native-elements';
import { collection, getDocs } from 'firebase/firestore';
import SponsorCard from '../../common/components/ImageCard';
import { firebaseFirestore } from '../../common/FirebaseApp';
import { FirestoreSponsor } from '../../types/FirebaseTypes';

interface SponsorType extends FirestoreSponsor {
  id: string;
}

/**
 * A horizontally scrolling carousel of SponsorCards
 */
const SponsorCarousel = () => {
  const [sponsors, setSponsors] = useState<SponsorType[]>([]);

  useEffect(() => {
    let shouldUpdateState = true;
    async function getSnapshot() {
      const dbSponsors: SponsorType[] = [];
      const snapshot = await getDocs(collection(firebaseFirestore, 'sponsors'));
      snapshot.forEach((document) => {
        dbSponsors.push({ ...document.data(), id: document.id });
      });
      if (shouldUpdateState) {
        setSponsors(dbSponsors);
      }
    }
    getSnapshot();
    return () => {
      shouldUpdateState = false;
    };
  }, []);

  const cards = sponsors.map((sponsor) => (
    <SponsorCard
      name={sponsor.name}
      imageLink={sponsor.logo}
      sponsorLink={sponsor.link}
      key={sponsor.id}
    />
  ));

  return (
    <View style={styles.container}>
      <ScrollView scrollEventThrottle={16}>
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

export default SponsorCarousel;
