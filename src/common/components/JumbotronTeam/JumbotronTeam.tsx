import { FontAwesome5 } from "@expo/vector-icons";
import { Text, View } from "native-base";

import { useThemeColors, useThemeFonts } from "../../customHooks";

/** @deprecated TODO - Merge with Jumbotron */
const JumbotronTeam = ({ team }: { team:string }) => {
  const {
    primary,
    secondary,
  } = useThemeColors();
  const {
    headingBold, mono
  } = useThemeFonts();

  return (
    <View
      margin={3}
      backgroundColor={primary[100]}
      padding={4}
      borderRadius={5}
      alignItems="center"
      display="flex"
      justifyContent="space-evenly">
      <FontAwesome5 name="users" size={40} color={secondary[100]}/>
      <Text
        textAlign="center"
        fontSize="2xl"
        color={primary[600]}
        fontFamily={headingBold}>{team}</Text>
      <Text
        textAlign="center"
        fontSize="lg"
        color={primary[600]}
        bold>Team Spirit Point Ranking: 1st Place</Text>
      <Text
        textAlign="center"
        fontSize="md"
        color={primary[600]}
        fontFamily={mono}>Click here to go to your Team Dashboard!</Text>
    </View>
  );
};

export default JumbotronTeam;
