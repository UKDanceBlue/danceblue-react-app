// Import third-party dependencies
import { addEventListener as addNetInfoEventListener } from "@react-native-community/netinfo";
import { LinkingOptions, NavigationContainer } from "@react-navigation/native";
import { addEventListener as addLinkingEventListener, createURL, getInitialURL, removeEventListener } from "expo-linking";
import { addNotificationResponseReceivedListener, getLastNotificationResponseAsync } from "expo-notifications";
import { hideAsync } from "expo-splash-screen";
import { ICustomTheme, NativeBaseProvider } from "native-base";
import { useEffect, useRef } from "react";
import { StatusBar } from "react-native";
import { Provider } from "react-redux";

// https://github.com/firebase/firebase-js-sdk/issues/97#issuecomment-427512040
import "./src/common/util/AndroidTimerFix";
import { FirebaseProvider } from "./src/common/FirebaseApp";
import { showMessage } from "./src/common/util/AlertUtils";
import RootScreen from "./src/navigation/root/RootScreen";
import { logout } from "./src/redux/authSlice";
import store from "./src/redux/store";
import { customTheme } from "./src/theme";

const navLinking: LinkingOptions<ReactNavigation.RootParamList> = {
  prefixes: [ createURL("/"), "https://www.danceblue.org/redirect/" ],
  config: {
    initialRouteName: "Tab",
    screens: {
      Tab: {
        initialRouteName: "Home",
        screens: {
          Home: { path: "" },
          Scoreboard: "team-rankings",
          Team: "my-team",
          Marathon: "marathon",
        },
      },
      Profile: { path: "app-profile" },
      Notifications: { path: "app-notifications" },
      Event: { path: "event/:id" },
    },
  },
  async getInitialURL(): Promise<string> {
    // First, you may want to do the default deep link handling
    // Check if app was opened from a deep link
    let url = await getInitialURL();

    if (url != null) {
      return url;
    }

    // Handle URL from expo push notifications
    const response = await getLastNotificationResponseAsync();
    url = response?.notification.request.content.data.url as string;

    return url;
  },
  subscribe(listener) {
    const onReceiveURL = ({ url }: { url: string }) => listener(url);

    // Listen to incoming links from deep linking
    addLinkingEventListener("url", onReceiveURL);

    // Listen to expo push notifications
    const expoSubscription = addNotificationResponseReceivedListener((response) => {
      const url = response.notification.request.content.data.url as string;

      // Let React Navigation handle the URL

      listener(url);
    });

    return () => {
      // Clean up the event listeners
      removeEventListener("url", onReceiveURL);

      expoSubscription.remove();
    };
  },
};
/**
 * Main app container
 */
const App = () => {
  const isOfflineInternal = useRef(false);

  useEffect(
    () => addNetInfoEventListener((state) => {
      if (!state.isConnected && !isOfflineInternal.current) {
        isOfflineInternal.current = true;
        showMessage(
          "You seem to be offline, some functionality may be unavailable or out of date"
        );
        // Store.dispatch(appConfigSlice.actions.goOffline()); TODO Reimplement
        store.dispatch(logout());
      } else if (isOfflineInternal.current) {
        // Store.dispatch(appConfigSlice.actions.goOnline());
        // If (firebaseAuth.currentUser) {
        //   Store.dispatch(syncAuthStateWithUser(firebaseAuth.currentUser));
        // }
        isOfflineInternal.current = false;
      }
    }),
    []
  );

  void hideAsync();

  return (
    <Provider store={store}>
      <NativeBaseProvider config={{ strictMode: __DEV__ ? "error" : "off" }} theme={customTheme as ICustomTheme}>
        <FirebaseProvider>
          <StatusBar backgroundColor="white" barStyle="dark-content" />
          <NavigationContainer linking={navLinking}>
            <RootScreen />
          </NavigationContainer>
        </FirebaseProvider>
      </NativeBaseProvider>
    </Provider>
  );
};

export default App;
