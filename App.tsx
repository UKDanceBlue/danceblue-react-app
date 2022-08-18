// Polyfill
import "intl";
import "intl/locale-data/jsonp/en";

// Import third-party dependencies
import NetInfo from "@react-native-community/netinfo";
import analytics from "@react-native-firebase/analytics";
import { LinkingOptions, NavigationContainer, NavigationContainerRef } from "@react-navigation/native";
import { DevMenu, isDevelopmentBuild } from "expo-dev-client";
import * as Linking from "expo-linking";
import * as Notifications from "expo-notifications";
import * as SplashScreen from "expo-splash-screen";
import { ICustomTheme, NativeBaseProvider } from "native-base";
import { useEffect, useRef } from "react";
import { LogBox, StatusBar } from "react-native";
import { Provider } from "react-redux";

// https://github.com/firebase/firebase-js-sdk/issues/97#issuecomment-427512040
import "./src/common/util/AndroidTimerFix";
import { FirebaseProvider } from "./src/common/FirebaseApp";
import { universalCatch } from "./src/common/logging";
import { showMessage } from "./src/common/util/AlertUtils";
import RootScreen from "./src/navigation/root/RootScreen";
import { logout } from "./src/redux/authSlice";
import { registerPushNotifications } from "./src/redux/notificationSlice";
import store from "./src/redux/store";
import { customTheme } from "./src/theme";
import { RootStackParamList } from "./src/types/NavigationTypes";

LogBox.ignoreLogs([
  "EventEmitter.removeListener('url', ...): Method has been deprecated. Please instead use `remove()` on the subscription returned by `EventEmitter.addListener`.",
  "'SplashScreen.show' has already been called for given view controller."
]);

if (isDevelopmentBuild()) {
  // eslint-disable-next-line no-console
  DevMenu.registerDevMenuItems([{ name: "Print Redux State", callback: () => console.log(JSON.stringify(store.getState(), null, 2)) }]).catch(universalCatch);
}

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
SplashScreen.preventAutoHideAsync().catch(universalCatch);

let hasPushRegistrationObserverFired = false;
const pushRegistrationObserver = store.subscribe(() => {
  // This will run on every redux state update until a uuid is set when it will try to register for push notifications
  if (!hasPushRegistrationObserverFired && store.getState().notification.uuid) {
    hasPushRegistrationObserverFired = true;
    store.dispatch(registerPushNotifications()).catch(universalCatch);
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
  const routeNameRef = useRef<string>();
  const navigationRef = useRef<NavigationContainerRef<RootStackParamList>>(null);

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

  SplashScreen.hideAsync().catch(universalCatch);

  return (
    <Provider store={store}>
      <NativeBaseProvider config={{ strictMode: __DEV__ ? "error" : "off" }} theme={customTheme as ICustomTheme}>
        <FirebaseProvider>
          <StatusBar backgroundColor="white" barStyle="dark-content" />
          <NavigationContainer
            ref={navigationRef}
            onReady={() => {
              routeNameRef.current = navigationRef.current?.getCurrentRoute()?.name;
            }}
            onStateChange={async () => {
              try {
                const lastRouteName = routeNameRef.current;
                const currentRouteName = navigationRef.current?.getCurrentRoute()?.name;

                routeNameRef.current = currentRouteName;

                if (lastRouteName !== currentRouteName) {
                  await analytics().logScreenView({
                    screen_name: currentRouteName,
                    screen_class: currentRouteName,
                  });
                }
              } catch (error) {
                universalCatch(error);
              }
            }}
            linking={navLinking}
          >
            <RootScreen />
          </NavigationContainer>
        </FirebaseProvider>
      </NativeBaseProvider>
    </Provider>
  );
};

export default App;
