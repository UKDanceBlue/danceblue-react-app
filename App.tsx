// Import third-party dependencies
import NetInfo from "@react-native-community/netinfo";
import { LinkingOptions, NavigationContainer } from "@react-navigation/native";
import * as Linking from "expo-linking";
import * as Notifications from "expo-notifications";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useRef } from "react";
import { StatusBar } from "react-native";
import { ThemeProvider } from "react-native-elements";
import { Provider } from "react-redux";

// https://github.com/firebase/firebase-js-sdk/issues/97#issuecomment-427512040
import "./src/common/util/AndroidTimerFix";
import { FirebaseProvider } from "./src/common/FirebaseApp";
import { showMessage } from "./src/common/util/AlertUtils";
import RootScreen from "./src/navigation/RootScreen";
import { logout } from "./src/redux/authSlice";
import { registerPushNotifications } from "./src/redux/notificationSlice";
import store from "./src/redux/store";
import { rnElementsTheme } from "./src/theme";

// All assets that should be preloaded:

// Configure the notifications handler
Notifications.setNotificationHandler({
  // eslint-disable-next-line @typescript-eslint/require-await
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

// Don't hide the splash screen until it is dismissed automatically
void SplashScreen.preventAutoHideAsync();

let hasPushRegistrationObserverFired = false;
const pushRegistrationObserver = store.subscribe(() => {
  // This will run on every redux state update until a uuid is set when it will try to register for push notifications
  if (!hasPushRegistrationObserverFired && store.getState().notification.uuid) {
    void Notifications.scheduleNotificationAsync({
      content: {
        title: "DanceBlue",
        body: "You have a new message!",
        data: { url: "exp://192.168.1.101:19000/--/" },
      },
      trigger: { seconds: 1 },
    });
    hasPushRegistrationObserverFired = true;
    void store.dispatch(registerPushNotifications());
    pushRegistrationObserver();
  }
});

const navLinking: LinkingOptions<ReactNavigation.RootParamList> = {
  prefixes: [ Linking.createURL("/"), "https://www.danceblue.org/redirect/" ],
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
    let url = await Linking.getInitialURL();

    if (url != null) {
      return url;
    }

    // Handle URL from expo push notifications
    const response = await Notifications.getLastNotificationResponseAsync();
    url = response?.notification.request.content.data.url as string;

    return url;
  },
  subscribe(listener) {
    const onReceiveURL = ({ url }: { url: string }) => listener(url);

    // Listen to incoming links from deep linking
    Linking.addEventListener("url", onReceiveURL);

    // Listen to expo push notifications
    const expoSubscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const url = response.notification.request.content.data.url as string;

      // Let React Navigation handle the URL

      listener(url);
    });

    return () => {
      // Clean up the event listeners
      Linking.removeEventListener("url", onReceiveURL);

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
    () => NetInfo.addEventListener((state) => {
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

  void SplashScreen.hideAsync();

  return (
    <Provider store={store}>
      <ThemeProvider theme={rnElementsTheme}>
        <FirebaseProvider>
          <StatusBar backgroundColor="white" barStyle="dark-content" />
          <NavigationContainer linking={navLinking}>
            <RootScreen />
          </NavigationContainer>
        </FirebaseProvider>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
