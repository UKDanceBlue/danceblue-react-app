import { Button, Text, View } from "native-base";
import { useEffect } from "react";
import { ActivityIndicator, Dimensions, ImageBackground } from "react-native";

import splashBackground from "../../../../assets/splash2.png";
import { useAppSelector } from "../../../common/CustomHooks";
import { useFirebase } from "../../../common/FirebaseApp";
import { useLinkBlueLogin } from "../../../common/auth";
import { showMessage } from "../../../common/util/AlertUtils";

const SplashLoginScreen = () => {
  const allowedLoginTypes = useAppSelector((state) => state.appConfig.allowedLoginTypes);
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
  return (
    <View>
      <ImageBackground source={splashBackground} style={localStyles.image}>
        <View display="flex" flex={1} justifyContent="space-between">
          <View
            flexShrink={2}
            mt={"1/6"}
            mb="3/5"
            w="4/5"
            alignSelf="center"
            borderRadius={10}
            p={5}
            backgroundColor="#aaaaaa33">
            <Text
              fontSize={20}
              color="light.100"
              textAlign="center">
            Welcome to UK DanceBlue!
            </Text>
            <Text color="light.100" textAlign="center">
            The UK DanceBlue app has many features that are only available with a user account.
            </Text>
            <Text color="light.100" textAlign="center">
            With an account you get access to profile badges, team info, and other features coming
            soon!
            </Text>
          </View>
          <View flex={1} justifyContent="flex-end">
            { allowedLoginTypes.includes("ms-oath-linkblue") && (
              <View flex={1}>
                <Text
                  color="light.200"
                  textAlign="center">
            UK Student or Staff? Sign in with your LinkBlue account
                </Text>
                <Button
                  onPress={() => trigger()}
                  variant="ghost"
                  backgroundColor="#bbbbff22"
                  _pressed={{ backgroundColor: "#bbbbff55" }}
                  width="2/3"
                  alignSelf="center"
                >
                  <Text color="light.200" textAlign="center">SSO Login!</Text>
                </Button>
              </View>
            )}

            { allowedLoginTypes.includes("anonymous") && (
              <View flex={1}>
                <Text color="light.200" textAlign="center">
            Want to look around first? You can always sign in later on the profile page
                </Text>
                <Button
                  onPress={() => void fbAuth.signInAnonymously()}
                  variant="ghost"
                  backgroundColor="#ffffff22"
                  _pressed={{ backgroundColor: "#ffffff55" }}
                  width="2/3"
                  alignSelf="center"
                >
                  <Text color="light.200" textAlign="center">Continue as a Guest</Text>
                </Button>
              </View>
            )}
          </View>
        </View>
      </ImageBackground>
      { loading && (
        <ActivityIndicator style={{ position: "absolute", top: "50%" }} />
      )}
    </View>
  );
};

const localStyles = {
  image: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  }
};

export default SplashLoginScreen;
