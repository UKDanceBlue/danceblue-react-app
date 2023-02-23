import { Text } from "native-base";
import { Linking, useWindowDimensions } from "react-native";

import { universalCatch } from "../../../common/logging";

export function DBHeaderText() {
  const { width } = useWindowDimensions();

  return (<Text
    onPress={async () => {
      if (
        await Linking.canOpenURL(
          "https://www.danceblue.org/"
        ).catch(universalCatch)
      ) {
        Linking.openURL(
          "https://www.danceblue.org/"
        ).catch(universalCatch);
      }
    }}
    marginLeft={ Math.round(width * 0.025)}
    fontSize="3xl"
    color="primary.600"
    fontFamily="bodoni-flf-bold"
    bold>DanceBlue</Text>);
}