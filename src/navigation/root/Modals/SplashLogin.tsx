import { Button, Center, Image, Text, View, useTheme } from "native-base";
import { useEffect } from "react";
import { ActivityIndicator, Dimensions, ImageBackground } from "react-native";

import splashBackground from "../../../../assets/screens/login-modal/halloween1.jpg";
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

  return (
    <View flex={1}>
      <ImageBackground
        source={splashBackground}
        style={{
          width: Dimensions.get("window").width,
          height: Dimensions.get("window").height - 300,
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
