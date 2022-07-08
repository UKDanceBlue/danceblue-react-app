import { useNetInfo } from "@react-native-community/netinfo";
import { nativeApplicationVersion } from "expo-application";
import * as Linking from "expo-linking";
import { Button, Image, Text, View, useColorMode } from "native-base";
import { useState } from "react";
import { ActivityIndicator, TextInput } from "react-native";

import avatar from "../../../../assets/avatar.png";
import { useAppSelector, useColorModeValue } from "../../../common/CustomHooks";
import { useFirebase } from "../../../common/FirebaseApp";
import { useLinkBlueLogin } from "../../../common/auth";

/**
 * Component for "Profile" screen in main navigation
 */
const ProfileScreen = () => {
  const authData = useAppSelector((state) => state.auth);
  const userData = useAppSelector((state) => state.userData);
  const demoModeKey = useAppSelector((state) => state.appConfig.demoModeKey);
  const { isConnected } = useNetInfo();
  const [ reportLongPressed, setReportLongPressed ] = useState(false);
  const [ suggestLongPressed, setSuggestLongPressed ] = useState(false);
  const {
    fbAuth, fbFunctions
  } = useFirebase();


  const { toggleColorMode } = useColorMode();
  const modeToChangeTo = useColorModeValue("Dark", "Light");

  const [ loading, trigger ] = useLinkBlueLogin(fbAuth, fbFunctions);

  return (
    <View style={{ alignItems: "center" }}>
      <>
        {
          /* Start of still loading view */ !authData.isAuthLoaded || loading && (
            <ActivityIndicator size="large" />
          ) /* End of still loading view */
        }
        {
          /* Start of loaded view */ authData.isAuthLoaded && (
            <>
              <Image
                source={avatar}
                height={64}
                width={64}
                alt="DanceBlue Logo"
              />
              {
                /* Start of logged in view */ authData.isLoggedIn &&
                  !authData.isAnonymous && (
                  <>
                    <Text>
                        You are logged in as {userData.firstName} {userData.lastName}
                    </Text>
                    <Text></Text>
                    <Button
                      style={{ margin: 10, alignSelf: "center" }}
                      onPress={() => void fbAuth.signOut()}
                    >
                      Log out
                    </Button>
                  </>
                ) /* End of logged in view */
              }
              {
                /* Start of logged in anonymously view */ authData.isLoggedIn &&
                authData.isAnonymous && (
                  <>
                    <Text>You are logged in {isConnected ? "anonymously" : "offline"}</Text>
                    <Button
                      style={{ margin: 10, alignSelf: "center" }}
                      onPress={() => trigger()}
                    >Log in</Button>

                  </>
                ) /* End of logged in anonymously view */
              }
              {
                /* Start of logged out view */ !authData.isLoggedIn && (
                  <>
                    <Text>You are logged out, to log in:</Text>
                    <Button
                      style={{ margin: 10, alignSelf: "center" }}
                      onPress={() => trigger()}
                    >
                        Log in
                    </Button>
                  </>
                ) /* End of logged in view */
              }
              {reportLongPressed && suggestLongPressed && (
                <TextInput
                  style={{ borderWidth: 2, minWidth: "30%" }}
                  returnKeyType="go"
                  secureTextEntry
                  onSubmitEditing={(event) => {
                    if (event.nativeEvent.text === demoModeKey) {
                      // store.dispatch(authSlice.actions.enterDemoMode());
                      setReportLongPressed(false);
                      setSuggestLongPressed(false);
                    }
                  }}
                />
              )}
              <View style={{ position: "absolute", bottom: 0 }}>
                <Button
                  style={{
                    margin: 10,
                    marginBottom: 20,
                    alignSelf: "center",
                  }}
                  onPress={toggleColorMode}
                >
                  {`Set color mode to ${modeToChangeTo}`}
                </Button>

                <Button
                  style={{
                    margin: 10,
                    alignSelf: "center",
                  }}
                  onPress={() => {
                    void Linking.openURL(
                      "mailto:app@danceblue.org?subject=DanceBlue%20App%20Issue%20Report&body=What%20happened%3A%0A%3Ctype%20here%3E%0A%0AWhat%20I%20was%20doing%3A%0A%3Ctype%20here%3E%0A%0AOther%20information%3A%0A%3Ctype%20here%3E"
                    );
                  }}
                  onLongPress={() => {
                    setReportLongPressed(true);
                  }}
                >Report an issue
                </Button>

                <Button
                  style={{ margin: 10, alignSelf: "center" }}
                  onPress={() => {
                    void Linking.openURL(
                      "mailto:app@danceblue.org?subject=DanceBlue%20App%20Suggestion&body=%3Ctype%20here%3E"
                    );
                  }}
                  onLongPress={() => {
                    setSuggestLongPressed(!!reportLongPressed);
                  }}
                >Suggest a change
                </Button>
                <Text
                  style={{ textAlign: "center" }}
                >{`Version: ${nativeApplicationVersion ?? ""}`}</Text>
              </View>
            </>
          ) /* End of loaded view */
        }
      </>
    </View>
  );
};

export default ProfileScreen;
