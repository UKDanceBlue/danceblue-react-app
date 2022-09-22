// Polyfill
import "intl";
import "intl/locale-data/jsonp/en";

// Import third-party dependencies
import NetInfo from "@react-native-community/netinfo";
import analytics from "@react-native-firebase/analytics";
import { NavigationContainer, NavigationContainerRef } from "@react-navigation/native";
import { addEventListener as addLinkingEventListener, canOpenURL, createURL as createLinkingURL, getInitialURL as getInitialLinkingURL, openURL } from "expo-linking";
import { addNotificationResponseReceivedListener } from "expo-notifications";
import { hideAsync as hideSplashScreenAsync } from "expo-splash-screen";
import { UpdateEventType, addListener as addUpdateListener, checkForUpdateAsync, fetchUpdateAsync, reloadAsync } from "expo-updates";
import { ICustomTheme, NativeBaseProvider, useDisclose } from "native-base";
import { useEffect, useRef, useState } from "react";
import { EventSubscription, StatusBar } from "react-native";
import { WebViewSource } from "react-native-webview/lib/WebViewTypes";


import "./src/common/util/AndroidTimerFix"; // https://github.com/firebase/firebase-js-sdk/issues/97#issuecomment-427512040
import NotificationInfoModal from "./src/common/components/NotificationInfoModal";
import WebpageModal from "./src/common/components/WebpageModal";
import { log, universalCatch } from "./src/common/logging";
import { showMessage, showPrompt } from "./src/common/util/alertUtils";
import { CombinedContext } from "./src/context";
import RootScreen from "./src/navigation/root/RootScreen";
import { customTheme } from "./src/theme";
import { NotificationInfoPopup } from "./src/types/NotificationPayload";
import { RootStackParamList } from "./src/types/navigationTypes";

// Import and run the fistLaunch file
import "./src/firstLaunch";

const linkingPrefixes = [
  createLinkingURL("/"),
  // "https://*.danceblue.org",
  // "https://danceblue.org"
];

/**
 * Main app container
 */
const App = () => {
  const isOfflineInternal = useRef(false);
  const splashScreenHidden = useRef(false);
  const routeNameRef = useRef<string>();
  const navigationRef = useRef<NavigationContainerRef<RootStackParamList>>(null);

  const {
    isOpen: isNotificationInfoOpen,
    onClose: onNotificationInfoClose,
    onOpen: onNotificationInfoOpen,
  } = useDisclose(false);
  const [ notificationInfoPopupContent, setNotificationInfoPopupContent ] = useState<NotificationInfoPopup | null>(null);

  const {
    isOpen: isNotificationWebviewPopupSourceOpen,
    onClose: onNotificationWebviewPopupSourceClose,
    onOpen: onNotificationWebviewPopupSourceOpen,
  } = useDisclose(false);
  const [ notificationWebviewPopupSource, setNotificationWebviewPopupSource ] = useState<WebViewSource | null>(null);

  useEffect(
    () => NetInfo.addEventListener((state) => {
      if (!state.isConnected && !isOfflineInternal.current) {
        isOfflineInternal.current = true;
        showMessage(
          "You seem to be offline, some functionality may be unavailable or out of date"
        );
        // Store.dispatch(appConfigSlice.actions.goOffline()); TODO Reimplement
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

  useEffect(() => {
    if (!__DEV__) {
      checkForUpdateAsync().then(({ isAvailable }) => {
        if (isAvailable) {
          return fetchUpdateAsync();
        }
      }).catch(universalCatch);

      const updatesSubscription = addUpdateListener(({
        type, message
      }) => {
        if (type === UpdateEventType.UPDATE_AVAILABLE) {
          showPrompt(
            "The DanceBlue app needs to quickly restart to load updated information, restart app now?",
            "New Content Available",
            undefined,
            () => {
              reloadAsync()
                .catch(universalCatch);
            },
            "Later",
            "Yes"
          );
        } else if (type === UpdateEventType.ERROR) {
          log(`Expo-Updates error: ${message ?? "[UNKNOWN]"}`, "warn");
        }
      }) as EventSubscription;

      return () => {
        updatesSubscription.remove();
      };
    }
  }, []);

  return (
    <NativeBaseProvider config={{ strictMode: __DEV__ ? "error" : "off" }} theme={customTheme as ICustomTheme}>
      <CombinedContext>
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
            prefixes: linkingPrefixes,
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
                  url: notificationUrl, textPopup, webviewPopup
                } = response.notification.request.content.data as {
                  url?: string;
                  textPopup?: NotificationInfoPopup;
                  webviewPopup?: WebViewSource;
                };

                if (textPopup != null) {
                  setNotificationInfoPopupContent(textPopup);
                  onNotificationInfoOpen();
                }

                if (webviewPopup != null) {
                  setNotificationWebviewPopupSource(webviewPopup);
                  onNotificationWebviewPopupSourceOpen();
                }

                if (notificationUrl != null) {
                  const decodedUrl = decodeURI(notificationUrl);
                  if (linkingPrefixes.every((prefix) => !decodedUrl.includes(prefix))) {
                    canOpenURL(decodedUrl).then((canOpen) => {
                      if (canOpen) {
                        return openURL(decodedUrl);
                      }
                    }).catch(universalCatch);
                  }
                  // Let React Navigation handle the URL
                  listener(decodedUrl);
                }
              });

              return () => {
                // Clean up the event listeners
                linkingSubscription.remove();
                notificationSubscription.remove();
              };
            },
            config: {
              initialRouteName: "Tab",
              screens: {
                Tab: {
                  path: "/",
                  screens: {
                    Home: { path: "/" },
                    Events: { path: "/events" },
                    Team: { path: "/my-team" },
                    Scoreboard: { path: "/scoreboard" },
                  },
                }
              }
            }
          }}
        >
          <NotificationInfoModal isNotificationInfoOpen={isNotificationInfoOpen} onNotificationInfoClose={onNotificationInfoClose} notificationInfoPopupContent={notificationInfoPopupContent} />
          <WebpageModal isOpen={isNotificationWebviewPopupSourceOpen} onClose={onNotificationWebviewPopupSourceClose} source={notificationWebviewPopupSource} />
          <RootScreen />
        </NavigationContainer>
      </CombinedContext>
    </NativeBaseProvider>
  );
};

export default App;

