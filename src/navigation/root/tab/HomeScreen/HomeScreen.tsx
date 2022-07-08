import { Box, Button, VStack, useTheme } from "native-base";
import { Linking } from "react-native";

import { useColorModeValue } from "../../../../common/CustomHooks";

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
      <Box height="40%" tintColor={bgColor}>
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
};

HomeScreen.navigationOptions = { title: "Home" };

export default HomeScreen;
