import * as WebBrowser from "expo-web-browser";
import { Image } from "native-base";
import { PixelRatio, TouchableHighlight } from "react-native";

import { useFirebaseStorageUrl } from "../CustomHooks";

/**
 * A card showing a Sponsor's logo that link's to their website
 */
const SponsorCard = ({
  imagePath,
  sponsorLink,
  name,
}: {
  imagePath: string;
  sponsorLink?: string;
  name: string;
}) => {
  const [url] = useFirebaseStorageUrl(`gs://react-danceblue.appspot.com${imagePath}`);

  return (
    <TouchableHighlight
      onPress={sponsorLink ? () => WebBrowser.openBrowserAsync(sponsorLink) : undefined}
      underlayColor="#dddddd"
    >
      <Image
        source={{ uri: url ?? undefined, width: PixelRatio.getPixelSizeForLayoutSize(75), height: PixelRatio.getPixelSizeForLayoutSize(50) }}
        alt={name}
        style={{
          flex: 1,
          resizeMode: "contain",
          backgroundColor: "white",
          marginHorizontal: 5,
          borderRadius: 6,
        }}
      />
    </TouchableHighlight>
  );
};

export default SponsorCard;
