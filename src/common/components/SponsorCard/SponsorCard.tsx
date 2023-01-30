import * as WebBrowser from "expo-web-browser";
import { Box, Image, Text, View, useTheme } from "native-base";
import { Dimensions, PixelRatio, StyleSheet, TouchableHighlight } from "react-native";


import { useFirebaseStorageUrl, useThemeColors, useThemeFonts } from "../../customHooks";

const SponsorCard = ({
  imagePath,
  sponsorLink,
  name,
  descrption,
}: {
  imagePath: string;
  sponsorLink?: string;
  name: string;
  descrption: string;
}) => {
  const themes = useTheme();
  const {
    primary, // Standard is 600, light background is 100
    secondary, // Standard is 400
    tertiary, // Standard is 500
    success, warning, error, danger, blue
  } = useThemeColors();
  const {
    heading, mono
  } = useThemeFonts();
  const [url] = useFirebaseStorageUrl(`gs://react-danceblue.appspot.com${imagePath}`);

  return (
    <TouchableHighlight
      onPress={sponsorLink ? () => WebBrowser.openBrowserAsync(sponsorLink) : undefined}
      underlayColor="transparent"
    >
      <View backgroundColor={primary[100]} style={styles.item}>
        <Image
          borderRadius={"8"}
          source={{ uri: url ?? undefined, width: PixelRatio.getPixelSizeForLayoutSize(75), height: PixelRatio.getPixelSizeForLayoutSize(50) }}
          alt={name}
          resizeMode="contain"
        />
        <Text
          fontFamily={mono}
          fontSize={themes.fontSizes.md}
          color={primary[600]}
          textAlign="center"
          style={styles.text}>Click to learn more</Text>
      </View>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  item: {
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
    alignSelf: "stretch",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    margin: 10,
    elevation: 3,
  },
  img: { borderRadius: 8 },
  text: {
    marginVertical: 8,
    alignSelf: "center",
  },
});

export default SponsorCard;
