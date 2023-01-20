import { Text, View, useTheme } from "native-base";
import { Icon } from "react-native-elements";

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
    heading, body, mono
  } = useThemeFonts();

  return (
    <View margin={3} backgroundColor={primary[100]} padding={4}>
      <Icon
        name="users"
        type="font-awesome"
        color={secondary[100]}
        size={36}/>
      <Text
        textAlign="center"
        fontSize="2xl"
        color={primary[600]}
        fontFamily="bodoni-flf-bold">{team}</Text>
      <Text
        textAlign="center"
        fontSize="lg"
        color={primary[600]}
        bold>Team Spirit Point Ranking: 1st Place</Text>
      <Text
        textAlign="center"
        fontSize="md"
        color={primary[600]}
        font={mono}>Click here to go to your Team Dashboard!</Text>
    </View>
  );
};

export default JumbotronTeam;
