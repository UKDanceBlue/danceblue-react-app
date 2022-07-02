import firebaseFirestore from "@react-native-firebase/firestore";
import { Text } from "native-base";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import SponsorCard from "../../common/components/ImageCard";
import { FirestoreSponsor } from "../../types/FirebaseTypes";

interface SponsorType extends FirestoreSponsor {
  id: string;
}

/**
 * A horizontally scrolling carousel of SponsorCards
 */
const SponsorCarousel = () => {
  const [ sponsors, setSponsors ] = useState<SponsorType[]>([]);

  useEffect(() => {
    let shouldUpdateState = true;
    async function getSnapshot() {
      const dbSponsors: SponsorType[] = [];
      const snapshot = await firebaseFirestore().collection("sponsors").get();
      snapshot.forEach((document) => {
        dbSponsors.push({ ...document.data(), id: document.id });
      });
      if (shouldUpdateState) {
        setSponsors(dbSponsors);
      }
    }
    void getSnapshot();
    return () => {
      shouldUpdateState = false;
    };
  }, []);

  const cards = sponsors.map((sponsor) => (
    <SponsorCard
      name={sponsor.name ?? ""}
      imagePath={sponsor.logo ?? ""}
      sponsorLink={sponsor.link}
      key={sponsor.id}
    />
  ));

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.sponsorTitle}> SPONSORS </Text>
      </View>
      <ScrollView scrollEventThrottle={16} horizontal>
        <View style={styles.cardScrollView}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {cards}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  cardScrollView: {
    height: 170,
    marginTop: 5,
  },
  container: { overflow: "hidden" },
  sponsorTitle: {
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default SponsorCarousel;
