// Import third-party dependencies
import { useEffect, useRef } from "react";
import { StatusBar } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import * as Linking from "expo-linking";
import * as Notifications from "expo-notifications";
import * as Application from "expo-application";
import { useAssets } from "expo-asset";
import * as SplashScreen from "expo-splash-screen";
import { LinkingOptions, NavigationContainer } from "@react-navigation/native";
import { Provider } from "react-redux";
// https://github.com/firebase/firebase-js-sdk/issues/97#issuecomment-427512040
import "./src/common/AndroidTimerFix";
import { ThemeProvider } from "react-native-elements";
import RootScreen from "./src/navigation/RootScreen";
import { showMessage } from "./src/common/AlertUtils";

import store from "./src/redux/store";
import { authSlice, updateUserData } from "./src/redux/authSlice";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { obtainUuid, registerPushNotifications } from "./src/redux/notificationSlice";
import { appConfigSlice, updateConfig } from "./src/redux/appConfigSlice";
import { rnElementsTheme } from "./src/theme";

// All assets that should be preloaded:
const homeBackgroundImg = require("./assets/home/db20_ribbon.jpg");
const dbLogo = require("./assets/home/DB_Primary_Logo-01.png");
const splashLoginBackground = require("./assets/home/Dancing-min.jpg");

// Promise.allSettled polyfill
Promise.allSettled =
  Promise.allSettled ||
  ((promises: any[]) =>
    Promise.all(
      promises.map((p) =>
        p
          .then((value: any) => ({
            status: "fulfilled",
            value,
          }))
          .catch((reason: any) => ({
            status: "rejected",
            reason,
          }))
      )
    ));

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

SplashScreen.preventAutoHideAsync();

const firstTimeSync = auth().onAuthStateChanged((user) => {
  if (user) {
    // This will run after auth is initialized and never again
    // TODO
  } else {
    // TODO
  }

  store.dispatch(obtainUuid());
  store.dispatch(updateConfig());

  firestore().doc("__VERSION/required").get().then((majorVerSnap) => {
      // Parse app version
      const versionTokens = Application.nativeApplicationVersion?.split(".", 2);
      let appMajor = Number.parseInt(versionTokens?.[0] || "0", 10);
      if (Number.isNaN(appMajor)) {
        appMajor = 0;
      }
      let appMinor = Number.parseInt(versionTokens?.[1] || "0", 10);
      if (Number.isNaN(appMinor)) {
        appMinor = 0;
      }

      // Parse required version
      const reqMajor = majorVerSnap.get("major");
      const reqMinor = majorVerSnap.get("minor");
      if (typeof reqMajor !== "number" || typeof reqMinor !== "number") {
        return;
      }
      if (!((appMajor === reqMajor && appMinor >= reqMinor) || appMajor > reqMajor)) {
        // App needs an update
        const showUpdateMessage = () => {
          showMessage(
            "Your version of the DanceBlue mobile app is out of date and must be updated before you can use it.",
            "Old version",
            showUpdateMessage
          );
        };
        showUpdateMessage();
      } else {
        firestore().doc("__VERSION/current").get().then((latestVerSnap) => {
            // Parse latest version
            const currMajor = latestVerSnap.get("major");
            const currMinor = latestVerSnap.get("minor");
            if (typeof currMajor !== "number" || typeof currMinor !== "number") {
              return;
            }
            if (!((appMajor === currMajor && appMinor >= currMinor) || appMajor > currMajor)) {
              showMessage("A new version of the DanceBlue app is available.", "Update available");
            }
          })
          .catch();
      }
    })
    .catch();

  firstTimeSync();
});

let hasPushRegistrationObserverFired = false;
const pushRegistrationObserver = store.subscribe(() => {
  // This will run on every redux state update until a uuid is set when it will try to register for push notifications
  if (!hasPushRegistrationObserverFired && store.getState().notification.uuid) {
    Notifications.scheduleNotificationAsync({
      content: {
        title: "DanceBlue",
        body: "You have a new message!",
        data: {
          url: "exp://192.168.1.101:19000/--/",
        },
      },
      trigger: {
        seconds: 1,
      },
    });
    hasPushRegistrationObserverFired = true;
    store.dispatch(registerPushNotifications());
    pushRegistrationObserver();
  }
});

const navLinking: LinkingOptions<ReactNavigation.RootParamList> = {
  prefixes: [Linking.createURL("/"), "https://www.danceblue.org/redirect/"],
  config: {
    screens: {
      Main: {
        initialRouteName: "Tab",
        screens: {
          Tab: {
            initialRouteName: "Home",
            screens: {
              Home: { path: "" },
              Scoreboard: "team-rankings",
              Team: "my-team",
              Store: "dancebluetique",
              Donate: "donate",
              HoursScreen: "marathon",
            },
          },
          Profile: { path: "app-profile" },
          Notifications: { path: "app-notifications" },
          Event: { path: "event/:id" },
        },
      },
    },
  },
  async getInitialURL(): Promise<string> {
    // First, you may want to do the default deep link handling
    // Check if app was opened from a deep link
    let url = await Linking.getInitialURL();

    if (url != null) {
      console.log(1);
      console.log(url);
      return url;
    }

    // Handle URL from expo push notifications
    const response = await Notifications.getLastNotificationResponseAsync();
    url = response?.notification.request.content.data.url as string;

    console.log(2);
    console.log(url);

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

      console.log(url);
      listener(url);
    });

    return () => {
      // Clean up the event listeners
      Linking.removeEventListener("url", onReceiveURL);

      if (expoSubscription) {
        expoSubscription.remove();
      }
    };
  },
};
/**
 * Main app container
 */
const App = () => {
  const [assets, assetError] = useAssets([splashLoginBackground, homeBackgroundImg, dbLogo]);

  const isOfflineInternal = useRef(false);
  useEffect(
    () =>
      NetInfo.addEventListener((state) => {
        if (!state.isConnected && !isOfflineInternal.current) {
          isOfflineInternal.current = true;
          showMessage(
            "You seem to be offline, some functionality may be unavailable or out of date"
          );
          // store.dispatch(appConfigSlice.actions.goOffline()); TODO Reimplement
          store.dispatch(authSlice.actions.loginOffline());
        } else if (isOfflineInternal.current) {
          // store.dispatch(appConfigSlice.actions.goOnline());
          // if (firebaseAuth.currentUser) {
          //   store.dispatch(syncAuthStateWithUser(firebaseAuth.currentUser));
          // }
          isOfflineInternal.current = false;
        }
      }),
    []
  );

  if (assetError) {
    showMessage(assetError, "Error loading assets");
  }

  if (!assets && hasPushRegistrationObserverFired) {
    return null;
  }

  SplashScreen.hideAsync();

  return (
    <Provider store={store}>
      <ThemeProvider theme={rnElementsTheme}>
        <StatusBar backgroundColor="white" barStyle="dark-content" />
        <NavigationContainer linking={navLinking}>
          <RootScreen />
        </NavigationContainer>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
