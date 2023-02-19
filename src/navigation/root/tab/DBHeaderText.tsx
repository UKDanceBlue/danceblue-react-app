import { Text } from "native-base";
import { useWindowDimensions } from "react-native";

export function DBHeaderText() {
  const { width } = useWindowDimensions();

  return (<Text
    marginLeft={ Math.round(width * 0.025)}
    fontSize="3xl"
    color="primary.600"
    fontFamily="bodoni-flf-bold"
    bold>DanceBlue</Text>);
}
