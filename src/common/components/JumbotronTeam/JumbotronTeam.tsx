import { FontAwesome5 } from "@expo/vector-icons";
import { Icon, Text, View, useTheme } from "native-base";

import { useThemeColors, useThemeFonts } from "../../customHooks";

const JumbotronTeam = ({ team }: { team:string }) => {
  const themes = useTheme();
  const {
    primary, // Standard is 600, light background is 100
    secondary, // Standard is 400
    tertiary, // Standard is 500
    success, warning, error, danger, blue
  } = useThemeColors();
  const {
    headingBold, heading, body, mono
  } = useThemeFonts();

  return (
    <View
      margin={3}
      backgroundColor={primary[100]}
      padding={4}
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
