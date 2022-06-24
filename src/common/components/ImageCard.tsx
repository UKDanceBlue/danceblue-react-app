import { MaterialIcons } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import { ActivityIndicator, Image, StyleSheet, TouchableHighlight, View } from "react-native";


import { useCachedFiles } from "../CacheUtils";

/**
 * A card showing a Sponsor's logo that link's to their website
 */
const SponsorCard = ({
  imageLink,
  sponsorLink,
  name,
}: {
  imageLink: string | undefined;
  sponsorLink: string | undefined;
  name: string | undefined;
}) => {
  const [ imageContent, imageRefError ] = useCachedFiles([
    {
      assetId: `${name}-logo`,
      freshnessTime: 172800,
      base64: true,
      googleUri: imageLink,
    },
  ]);

  return (
    <TouchableHighlight
      onPress={sponsorLink ? () => WebBrowser.openBrowserAsync(sponsorLink) : undefined}
      underlayColor="#dddddd"
    >
      <View style={styles.border}>
        {!imageContent && !imageRefError && (
          <ActivityIndicator style={styles.image} size="large" color="blue" />
        )}
        {imageRefError && (
          <MaterialIcons name="image-not-supported" size={styles.image.width} color="black" />
        )}
        {imageContent && (
          <Image
            source={{ uri: `data:image;base64,${imageContent}`, width: styles.image.width }}
            style={styles.image}
          />
        )}
      </View>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  border: {
    flex: 2,
    padding: 0,
  },
  image: {
    flex: 1,
    resizeMode: "contain",
    width: 200,
  },
});

export default SponsorCard;
