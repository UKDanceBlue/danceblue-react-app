import { Box, Button, VStack } from "native-base";
import { Linking } from "react-native";

import HeaderImage from "./HeaderImage";
import SponsorCarousel from "./SponsorCarousel";

/**
 * Component for home screen in main navigation
 */
const HomeScreen = () => (
  <VStack flexDirection="column">
    <Box height="40%">
      <HeaderImage />
    </Box>
    <Box height="15%">
      <Button
        m={ 5 }
        onPress={() => {
          void (async () => {
            if (
              await Linking.canOpenURL(
                "https://danceblue.networkforgood.com/causes/4789-danceblue-golden-matrix-fund-dance-teams?utm_source=website&utm_medium=unit_website"
              )
            ) {
              void Linking.openURL(
                "https://danceblue.networkforgood.com/causes/4789-danceblue-golden-matrix-fund-dance-teams?utm_source=website&utm_medium=unit_website"
              );
            }
          })();
        }}
      >
      Donate!
      </Button>
    </Box>
    <Box height="45%">
      <SponsorCarousel />
    </Box>
  </VStack>
);

HomeScreen.navigationOptions = { title: "Home" };

export default HomeScreen;
