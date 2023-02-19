import { Container, Flex, Text, View } from "native-base";
import { useWindowDimensions } from "react-native";

import DanceBlueRibbon from "../../../../../../../assets/svgs/DBRibbon";
import { useThemeColors } from "../../../../../../common/customHooks";

import FirstPlaceMedal from "./1stPlace";
import SecondPlaceMedal from "./2ndPlace";
import ThirdPlaceMedal from "./3rdPlace";

function getAward(rank: number, size: number, colors: string[]) {
  switch (rank) {
  case 1:
    return (
      <FirstPlaceMedal width={size} height={size} color={colors[0]}/>
    );
  case 2:
    return (
      <SecondPlaceMedal width={size} height={size} color={colors[1]}/>
    );
  case 3:
    return (
      <ThirdPlaceMedal width={size} height={size} color={colors[2]}/>
    );
  default: return <Text color="primary.600" fontSize="3xl" bold>{rank}</Text>;
  }
}

const ScoreboardItem = ({
  rank, name, points
}: { rank: number; name: string; points: number }) => {
  const { width: screenWidth } = useWindowDimensions();
  const colors = useThemeColors();

  return (
    <View
      marginLeft={3}
      marginRight={3}
      height={50}
      style={{ borderBottomWidth: 1, borderBottomColor: "primary.600" }}>
      <Flex direction="row" alignItems="center" flex={1}>
        <Container
          justifyContent="center"
          alignItems="center"
          flex={1}
          ml="2"
          mr="4">
          {getAward(rank, screenWidth * 0.1, [
            colors.secondary[400], colors.primary[400], colors.tertiary[400]
          ])}
        </Container>
        <Container
          justifyContent="flex-start"
          flex={8}>
          <Flex direction="row">
            <Container justifyContent="center" alignItems="flex-start" flex={0}>
              <DanceBlueRibbon width={screenWidth*0.1} height={screenWidth*0.1}/>
            </Container>
            <Container
              justifyContent="flex-start"
              marginLeft={1}
              alignItems="stretch">
              <Text color="primary.600" fontSize="lg" bold>{name}</Text>
            </Container>
          </Flex>
        </Container>
        <Container
          justifyContent="flex-end"
          flex={2}>
          <Text color="primary.600" fontSize="lg" fontFamily="mono">{points} points</Text>
        </Container>
      </Flex>
    </View>
  );
};
export default ScoreboardItem;
