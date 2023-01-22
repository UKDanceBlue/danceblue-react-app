import { Container, Flex, Image, Text, View, useTheme } from "native-base";
import { Icon } from "react-native-elements";
import { fonts } from "react-native-elements/dist/config";

import { useThemeColors, useThemeFonts } from "../../customHooks";

const TeamInformation = ({
  name, captains, members
}: { name:string; captains:string[]; members:string[] }) => {
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

  const captainString = captains.join(", ");
  const memberString = members.join(", ");

  return (
    <View marginLeft={30} marginRight={30}>
      <Flex
        direction="row"
        alignItems="stretch"
        justifyContent="center"
        flex={1}>
        <Container flex={0.1} justifyContent="center" alignItems="stretch">
          <Icon
            name="awareness-ribbon"
            type="entypo"
            color={secondary[400]}
            backgroundColor="white"
            borderRadius={50}
            size={35}/>
        </Container>
        <Container flex={0.6} alignItems="center">
          <Text
            color={primary[600]}
            fontFamily={"bodoni-flf-bold"}
            fontSize={themes.fontSizes["4xl"]}>Team Info</Text>
        </Container>
      </Flex>
      <Flex direction="row" flex={1}>
        <Container flex={3} alignItems="stretch" justifyContent="center">
          <Image
            src="https://i.gyazo.com/38368bc61fb37e1fe7e738938382ea83.png"
            alt="Sign Guy"
            height="150"
            resizeMode="contain"/>
        </Container>
        <Container flex={8.5} alignItems="stretch" justifyContent="center">
          <Flex direction="row">
            <Text color={primary[600]}>
              <Text font={body} fontSize={themes.fontSizes.lg} bold>Name: </Text>
              <Text fontFamily={mono} fontSize={themes.fontSizes.lg}>{name}</Text>
            </Text>
          </Flex>
          <Flex direction="row">
            <Text color={primary[600]}>
              <Text font={body} fontSize={themes.fontSizes.lg} bold>Captain(s): </Text>
              <Text fontFamily={mono} fontSize={themes.fontSizes.lg}>{captainString}</Text>
            </Text>
          </Flex>
          <Flex direction="row">
            <Text color={primary[600]}>
              <Text font={body} fontSize={themes.fontSizes.lg} bold>Members: </Text>
              <Text fontFamily={mono} fontSize={themes.fontSizes.lg}>{memberString}</Text>
            </Text>
          </Flex>
        </Container>
      </Flex>
    </View>
  );
};

export default TeamInformation;
