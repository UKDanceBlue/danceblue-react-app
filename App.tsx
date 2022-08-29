// Polyfill
import "intl";
import "intl/locale-data/jsonp/en";

// Import third-party dependencies
import NetInfo from "@react-native-community/netinfo";
import analytics from "@react-native-firebase/analytics";
import { NavigationContainer, NavigationContainerRef } from "@react-navigation/native";
import { addEventListener as addLinkingEventListener, createURL as createLinkingURL, getInitialURL as getInitialLinkingURL } from "expo-linking";
import { addNotificationResponseReceivedListener } from "expo-notifications";
import { hideAsync as hideSplashScreenAsync } from "expo-splash-screen";
import { ICustomTheme, NativeBaseProvider } from "native-base";
import { useEffect, useRef } from "react";
import { StatusBar } from "react-native";
import { Provider } from "react-redux";

// https://github.com/firebase/firebase-js-sdk/issues/97#issuecomment-427512040
import "./src/common/util/AndroidTimerFix";
import { FirebaseProvider } from "./src/common/FirebaseContext";
import { universalCatch } from "./src/common/logging";
import { showMessage } from "./src/common/util/alertUtils";
import RootScreen from "./src/navigation/root/RootScreen";
import { logout } from "./src/redux/authSlice";
import store from "./src/redux/store";
import { customTheme } from "./src/theme";
import { RootStackParamList } from "./src/types/navigationTypes";

// Import and run the fistLaunch file
import "./src/firstLaunch";


/**
 * Main app container
 */
const App = () => {
  const isOfflineInternal = useRef(false);
  const splashScreenHidden = useRef(false);
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
        isOfflineInternal.current = false;
      }
    }),
    []
  );

  useEffect(() => {
    if (!splashScreenHidden.current) {
      hideSplashScreenAsync().then(() => {
        splashScreenHidden.current = true;
      }).catch(universalCatch);
    }
  }, []);

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
            linking={{
              prefixes: [
                createLinkingURL("/"),
                "https://*.danceblue.org",
                "https://danceblue.org"
              ],
              getInitialURL: getInitialLinkingURL,
              // Filter out URLs used by expo-auth-session
              filter: (url) => !url.includes("+expo-auth-session"),
              subscribe: (listener) => {
                const onReceiveURL = ({ url }: { url: string }) => listener(url);

                // Listen to incoming links from deep linking
                const linkingSubscription = addLinkingEventListener("url", onReceiveURL);

                // THIS IS THE NOTIFICATION ENTRY POINT
                const notificationSubscription = addNotificationResponseReceivedListener((response) => {
                  const {
                    url, message
                  } = response.notification.request.content.data as {
                    url?: string;
                    message?: string;
                  };

                  if (message != null) {
                    showMessage(message, response.notification.request.content.title ?? "Notification");
                  }

                  if (url != null) {
                  // Let React Navigation handle the URL
                    listener(url);
                  }
                });

                return () => {
                  // Clean up the event listeners
                  linkingSubscription.remove();
                  notificationSubscription.remove();
                };
              }
            }}
          >
            <RootScreen />
          </NavigationContainer>
        </FirebaseProvider>
      </NativeBaseProvider>
    </Provider>
  );
};

export default App;
