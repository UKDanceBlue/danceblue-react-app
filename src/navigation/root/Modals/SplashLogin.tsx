import { Button, Center, Image, Text, View, useTheme } from "native-base";
import { useEffect } from "react";
import { ActivityIndicator, Dimensions, ImageBackground, ImageSourcePropType } from "react-native";

import { useLinkBlueLogin } from "../../../common/auth";
import { useThemeColors, useThemeFonts } from "../../../common/customHooks";
import { universalCatch } from "../../../common/logging";
import { showMessage } from "../../../common/util/alertUtils";
import { useAppConfig, useFirebase } from "../../../context";

const SplashLoginScreen = () => {
  const { allowedLoginTypes } = useAppConfig();

  const {
    fbAuth, fbFunctions
  } = useFirebase();

  const [
    loading,
    trigger,
    ,
    error
  ] = useLinkBlueLogin(fbAuth, fbFunctions);

  useEffect(() => {
    if (error) {
      showMessage(error.message, "Error logging in");
    }
  }, [error]);
  const themes = useTheme();
  const {
    primary, // Standard is 600, light background is 100
    secondary, // Standard is 400
    tertiary, // Standard is 500
  } = useThemeColors();
  const {
    headingBold, heading, body, mono
  } = useThemeFonts();
  const backgrounds = [
    "https://i.gyazo.com/a10f94465cc0c8e9bbccad668d745c71.jpg", // 5k- ashley and johnny
    "https://i.gyazo.com/6b2b6db82fc32044f0df5ad41fc73783.jpg", // 5k- finishline 2
    "https://i.gyazo.com/f5136edb021cfd1a650bfa6889325748.jpg", // 5k- kid
    "https://i.gyazo.com/fdad3cfe016996c6d4e2de6f031280e2.jpg", // 2012-random
    "https://i.gyazo.com/3500b51a400707b8be5d5cb08551c449.jpg", // blue countdown
    "https://i.gyazo.com/e8087d7145b39217d7ef59a5badb10d0.jpg", // DanceBlue U- 3
    "https://i.gyazo.com/435116572188aef61a0c16a8644094c8.jpg", // DanceBlue U- 7
    "https://i.gyazo.com/2692d28c7cd6ea48d4b586f60af23dc0.jpg", // DanceBlue U- 8
    "https://i.gyazo.com/f51f9626e024224fd44b665ea415b00b.jpg", // DanceBlue U- 13
    "https://i.gyazo.com/b44ef207f65554efffe3d5abb117e1db.jpg", // DanceBlue U- 16
    "https://i.gyazo.com/7003056309b2cb92a59943ce1626e45e.jpg", // DanceBlue U- 17
    "https://i.gyazo.com/cf557f012e1547b79a97b10ffe44d83d.jpg", // dancing
  ];
  const number = Math.floor(Math.random() * backgrounds.length) - 1;

  return (
    <View flex={1}>
      <ImageBackground
        source={{ uri: backgrounds[number] }}
        style={{
          width: Dimensions.get("window").width,
          height: Dimensions.get("window").height - 400,
          position: "absolute",
          overflow: "hidden"
        }}
        resizeMode="cover"/>
      <Image
        alt="Welcome Overlay"
        source={{ uri: "https://i.gyazo.com/19118b5b2adea276086da35d41c74bb0.png" }}
        height={Dimensions.get("window").height}
        resizeMode="cover"
        zIndex={0}/>
      <View
        justifyContent="center"
        height={Dimensions.get("window").height / 2}
        top={Dimensions.get("window").height / 2}
        zIndex={100}
        position="absolute"
        width={Dimensions.get("window").width}
        marginTop={15}>
        { allowedLoginTypes.includes("ms-oath-linkblue") && (
          <View>
            <Button
              onPress={() => trigger()}
              width={Dimensions.get("window").width - 50}
              backgroundColor={secondary[400]}
              _pressed={{ backgroundColor: primary[600] }}
              alignSelf="center"
              margin={5}
            >
              <Text
                color={primary[600]}
                textAlign="center"
                fontFamily={body}
                fontSize={themes.fontSizes.xl}>Login with Linkblue</Text>
            </Button>
          </View>
        )}

        { allowedLoginTypes.includes("anonymous") && (
          <View>
            <Button
              onPress={() => fbAuth.signInAnonymously().catch(universalCatch)}
              width={Dimensions.get("window").width - 50}
              backgroundColor={primary[600]}
              _pressed={{ backgroundColor: secondary[400] }}
              alignSelf="center"
              margin={5}
            >
              <Text
                color="#ffffff"
                textAlign="center"
                fontFamily={body}
                fontSize={themes.fontSizes.xl}>Continue as Guest</Text>
            </Button>
          </View>
        )}
      </View>
      { loading && (
        <Center position="absolute" width="full" height="full">
          <ActivityIndicator size="large" />
        </Center>
      )}
    </View>
  );
};

export default SplashLoginScreen;
