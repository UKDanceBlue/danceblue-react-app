import { Box, Button, Text, VStack, useTheme } from "native-base";
import { Linking, StatusBar } from "react-native";

import PodcastPlayer from "../../../../common/components/PodcastPlayer";
import SponsorsBlock from "../../../../common/components/SponsorsBlock";
import { useColorModeValue } from "../../../../common/customHooks";
import { universalCatch } from "../../../../common/logging";

import HeaderImage from "./HeaderImage";
import SponsorCarousel from "./SponsorCarousel";

/**
 * Component for home screen in main navigation
 */
const HomeScreen = () => {
  const { colors } = useTheme();
  const bgColor = useColorModeValue(colors.white, colors.gray[600]);

  return (
    <>
      <StatusBar hidden = { false } />
      <VStack flexDirection="column" bgColor={bgColor}>
        <Box height="35%" tintColor={bgColor}>
          <HeaderImage />
        </Box>
        <Box height="10%">
          <Button
            borderRadius={0}
            margin={0}
            backgroundColor={colors.blue[700]}
            _pressed={{ opacity: 0.5 }}
            onPress={async () => {
              if (
                await Linking.canOpenURL(
                  "https://danceblue.networkforgood.com/"
                ).catch(universalCatch)
              ) {
                Linking.openURL(
                  "https://danceblue.networkforgood.com/"
                ).catch(universalCatch);
              }
            }}
          >
            <Text
              bold
              fontSize={30}
              color="light.100"
              shadow="1">Donate Now!</Text>
          </Button>
        </Box>
        <Box height="15%">
          <PodcastPlayer />
        </Box>
        <Box height="40%">
          <SponsorCarousel />
        </Box>
      </VStack>
    </>
  );
};

HomeScreen.navigationOptions = { title: "Home" };

export default HomeScreen;
