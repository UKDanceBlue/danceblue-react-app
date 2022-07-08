import firebaseFirestore from "@react-native-firebase/firestore";
import { Box, Heading, ScrollView, View } from "native-base";
import { useEffect, useState } from "react";

import SponsorCard from "../../../../common/components/ImageCard";
import { FirestoreSponsor } from "../../../../types/FirebaseTypes";

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
    <View height="100%" flex={1} alignContent="flex-end">
      <View>
        <Heading> SPONSORS </Heading>
      </View>
      <Box flexDirection="row" flex={1} alignItems="center">
        <ScrollView scrollEventThrottle={16} horizontal flex={1} height="4/5" p="2">
          {cards}
        </ScrollView>
      </Box>
    </View>
  );
};

export default SponsorCarousel;
