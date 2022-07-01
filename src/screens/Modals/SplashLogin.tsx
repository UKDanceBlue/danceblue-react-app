import { Text } from "native-base";
import { useEffect } from "react";
import { ActivityIndicator, Dimensions, ImageBackground, TouchableOpacity, View } from "react-native";

import splashBackground from "../../../assets/home/Dancing-min.jpg";
import { useAppSelector } from "../../common/CustomHooks";
import { useFirebase } from "../../common/FirebaseApp";
import { useLinkBlueLogin } from "../../common/auth";
import { showMessage } from "../../common/util/AlertUtils";
import { globalStyles, globalTextStyles } from "../../theme";

/**
 * A simplified sign in page shown when the user first opens the app
 * @class
 */
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
    <View style={globalStyles.genericCenteredView}>
      <ImageBackground source={splashBackground} style={localStyles.image}>
        <View style={globalStyles.genericView}>
          <View style={globalStyles.genericHeaderContainer}>
            <Text h="2" style={{ textAlign: "center" }}>
            Welcome to UK DanceBlue!
            </Text>
            <Text style={globalTextStyles.headerText}>
            The UK DanceBlue app has many features that are only available with a user account.
            </Text>
            <Text />
            <Text style={globalTextStyles.headerText}>
            With an account you get access to profile badges, team info, and other features coming
            soon!
            </Text>
          </View>
          { allowedLoginTypes.includes("ms-oath-linkblue") && (
            <View style={globalStyles.genericHeaderContainer}>
              <Text h="3" style={globalStyles.genericText}>
            Sign in with your UK LinkBlue account
              </Text>
              <TouchableOpacity
                onPress={() => trigger()}
                style={globalStyles.genericButton}
              >
                <Text style={globalStyles.genericText}>SSO Login!</Text>
              </TouchableOpacity>
            </View>
          )}

          { allowedLoginTypes.includes("anonymous") && (
            <View style={globalStyles.genericCenteredView}>
              <Text style={globalStyles.genericText}>
            Want to look around first? You can always sign in later on the profile page
              </Text>
              <TouchableOpacity
                onPress={() => void fbAuth.signInAnonymously()}
                style={globalStyles.genericButton}
              >
                <Text style={globalStyles.genericText}>Continue as a Guest</Text>
              </TouchableOpacity>
            </View>
          )}
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
