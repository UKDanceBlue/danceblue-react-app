import firebaseFirestore from "@react-native-firebase/firestore";
import { Box, Heading, ScrollView, View } from "native-base";
import { useEffect, useState } from "react";

import SponsorCard from "../../../../common/components/ImageCard";
import { universalCatch } from "../../../../common/logging";
import { LegacyFirestoreSponsor } from "../../../../types/sponsors";

/**
 * A horizontally scrolling carousel of SponsorCards
 */
const SponsorCarousel = () => {
  const [ sponsors, setSponsors ] = useState<LegacyFirestoreSponsor[]>([]);

  useEffect(() => {
    let shouldUpdateState = true;
    async function getSnapshot() {
      const dbSponsors: LegacyFirestoreSponsor[] = [];
      const snapshot = await firebaseFirestore().collection("sponsors").get();
      snapshot.forEach((document) => {
        dbSponsors.push(document.data());
      });
      if (shouldUpdateState) {
        setSponsors(dbSponsors);
      }
    }
    getSnapshot().catch(universalCatch);
    return () => {
      shouldUpdateState = false;
    };
  }, []);

  const cards = sponsors.map((sponsor, i) => (
    <SponsorCard
      name={sponsor.name ?? ""}
      imagePath={sponsor.logo ?? ""}
      sponsorLink={sponsor.link}
      key={i}
    />
  ));

  return (
    <View height="100%" flex={1} alignContent="flex-end">
      <View>
        <Heading> SPONSORS </Heading>
      </View>
      <Box flexDirection="row" flex={1} alignItems="center">
        <ScrollView
          scrollEventThrottle={16}
          horizontal
          flex={1}
          height="4/5"
          p="2">
          {cards}
        </ScrollView>
      </Box>
    </View>
  );
};

export default SponsorCarousel;
