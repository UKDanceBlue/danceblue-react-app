import { createStackNavigator } from "@react-navigation/stack";
import { useEffect } from "react";
import { ActivityIndicator } from "react-native";

import { useAppSelector } from "../common/CustomHooks";
import GenericWebviewScreen from "../screens/GenericWebviewScreen";
import SplashLogin from "../screens/Modals/SplashLogin";
import { globalColors } from "../theme";
import { RootStackParamList } from "../types/NavigationTypes";

import MainStackRoot from "./MainStackRoot";

const RootStack = createStackNavigator<RootStackParamList>();

const RootScreen = () => {
  const isAuthLoaded = useAppSelector((state) => state.auth.isAuthLoaded);
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
  const userAttributes = useAppSelector((state) => state.auth.attributes);
  const userTeamId = useAppSelector((state) => state.auth.teamId);
  const userId = useAppSelector((state) => state.auth.uid);
  const uuid = useAppSelector((state) => state.notification.uuid);


  useEffect(() => {
    (async () => {
      if (isAuthLoaded && uuid) {
        // Update the audience data in this device's firebase document
        const audiences = ["all"];
        if (
          typeof userAttributes === "object" &&
          !Array.isArray(userAttributes) &&
          userAttributes !== null &&
          Object.keys(userAttributes).length > 0
        ) {
          // Grab the user's attributes
          const attributeNames = Object.keys(userAttributes);
          const audiencePromises = [];

          // Add any attributes with isAudience to the audiences array
          for (let i = 0; i < attributeNames.length; i++) {
            // AudiencePromises.push(
            // GetDoc(doc(firebaseFirestore, "valid-attributes", attributeNames[i])) TODO switch to remote config
            // );
          }
          // Await Promise.all(audiencePromises).then((audienceDocs) => {
          //   For (let i = 0; i < audienceDocs.length; i++) {
          //     Const attributeData = audienceDocs[i].data();
          //     Const attributeName = audienceDocs[i].ref.id;
          //     Const userAttributeValue = userAttributes[attributeName];
          //     If (attributeName === "team" || attributeData[userAttributeValue].isAudience) {
          //       Audiences.push(userAttributeValue);
          //     }
          //   }
          // });
        }

        // If the user is on a team, add the team ID as an audience
        if (userTeamId) {
          audiences.push(userTeamId);
        }

        // Await setDoc(
        //   Doc(firebaseFirestore, "devices", uuid),
        //   {
        //     LatestUserId: userId || null,
        //     Audiences,
        //     LastConnected: Timestamp.now(),
        //   },
        //   { mergeFields: ["latestUserId", "audiences", "lastConnected"] }
        // ); TODO reimplement
      }
    })();
  }, [
    userAttributes, isAuthLoaded, userTeamId, userId, uuid
  ]);

  return (
    <>
      {isAuthLoaded && (
        <ActivityIndicator
          size="large"
          color={globalColors.lightBlue}
          style={{
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
        />
      )}
      {!isAuthLoaded && (
        <RootStack.Navigator>
          {isLoggedIn && (
            <RootStack.Screen
              name="Main"
              component={MainStackRoot}
              options={{ headerShown: false }}
            />
          )}
          {!isLoggedIn && (
            <RootStack.Screen
              name="SplashLogin"
              component={SplashLogin}
              options={{ headerShown: false, presentation: "modal", gestureEnabled: false }}
            />
          )}
          <RootStack.Screen
            name="DefaultRoute"
            component={GenericWebviewScreen}
            options={{ headerBackTitle: "Back", headerTitle: "DanceBlue" }}
          />
        </RootStack.Navigator>
      )}
    </>
  );
};

export default RootScreen;
