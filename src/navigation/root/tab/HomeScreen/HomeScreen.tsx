import { Box, Button, VStack, useTheme } from "native-base";
import { Linking } from "react-native";

import { useColorModeValue } from "../../../../common/CustomHooks";
import PodcastPlayer from "../../../../common/components/PodcastPlayer";


import HeaderImage from "./HeaderImage";
import SponsorCarousel from "./SponsorCarousel";

/**
 * Component for home screen in main navigation
 */
const HomeScreen = () => {
  const { colors } = useTheme();
  const bgColor = useColorModeValue(colors.white, colors.gray[600]);

  return (
    <VStack flexDirection="column" bgColor={bgColor}>
      <Box height="35%" tintColor={bgColor}>
        <HeaderImage />
      </Box>
      <Box height="7.5%">
        <Button
          borderRadius={0}
          margin={0}
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
      <Box height="15%">
        <PodcastPlayer />
      </Box>
      <Box height="40%">
        <SponsorCarousel />
      </Box>
    </VStack>
  );
};

HomeScreen.navigationOptions = { title: "Home" };

export default HomeScreen;
