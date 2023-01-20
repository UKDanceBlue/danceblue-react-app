import { Container, Flex, Text, View, useTheme } from "native-base";
import { Icon } from "react-native-elements";

import { useThemeColors, useThemeFonts } from "../../customHooks";

const ScoreboardItem = ({
  rank, name, points, icon, type
}: { rank:number; name:string; points:number; icon:string; type:string }) => {
  const themes = useTheme();
  const {
    primary, secondary, tertiary, success, warning, error, danger
  } = useThemeColors();
  const {
    heading, body, mono
  } = useThemeFonts();

  function awards() {
    switch (rank) {
    case 1:
      return (
        <Icon
          name="trophy"
          type="font-awesome"
          color={secondary[400]}
          borderRadius={50}
          style={{ paddingBottom: 10, paddingTop: 10 }}
          size={30}/>
      );
    case 2:
      return (
        <Icon
          name="trophy"
          type="font-awesome"
          color={primary[400]}
          borderRadius={50}
          style={{ paddingBottom: 10, paddingTop: 10 }}
          size={30}/>
      );
    case 3:
      return (
        <Icon
          name="trophy"
          type="font-awesome"
          color={tertiary[400]}
          borderRadius={50}
          style={{ paddingBottom: 10, paddingTop: 10 }}
          size={30}/>
      );
    default: return <Text color={primary[600]} fontSize={themes.fontSizes["3xl"]} bold>{rank}</Text>;
    }
  }

  return (
    <View
      marginLeft={3}
      marginRight={3}
      height={50}
      style={{ borderBottomWidth: 1, borderBottomColor: primary[600] }}>
      <Flex direction="row" alignItems="center" flex={1}>
        <Container justifyContent="center" alignItems="center" flex={0.15}>
          {awards()}
        </Container>
        <Container justifyContent="flex-start" flex={1} marginLeft={2}>
          <Flex direction="row">
            <Container justifyContent="center" alignItems="flex-start" flex={0}>
              <Icon
                name={icon}
                type={type}
                color={secondary[400]}
                backgroundColor="white"
                borderRadius={50}
                size={20}/>
            </Container>
            <Container
              justifyContent="flex-start"
              width={1000}
              marginLeft={1}
              alignItems="stretch">
              <Text color={primary[600]} fontSize={themes.fontSizes.lg} bold>{name}</Text>
            </Container>
          </Flex>
        </Container>
        <Container justifyContent="flex-end" width={100} flex={0.3}>
          <Text color={primary[600]} fontSize={themes.fontSizes.lg} fontFamily={mono}>{points} points</Text>
        </Container>
      </Flex>
    </View>
  );
};
export default ScoreboardItem;
