// Polyfill
import "intl";
import "intl/locale-data/jsonp/en";

// Import third-party dependencies
import NetInfo from "@react-native-community/netinfo";
import { FontSource, useFonts } from "expo-font";
import { hideAsync } from "expo-splash-screen";
import { UpdateEventType,
  addListener as addUpdateListener,
  checkForUpdateAsync,
  fetchUpdateAsync,
  reloadAsync } from "expo-updates";
import { ICustomTheme, NativeBaseProvider } from "native-base";
import { useEffect, useRef, useState } from "react";
import { AppState, EventSubscription, StatusBar } from "react-native";

import "./src/common/util/AndroidTimerFix"; // https://github.com/firebase/firebase-js-sdk/issues/97#issuecomment-427512040
import ErrorBoundary from "./src/common/components/ErrorBoundary";
import { log, logError, universalCatch } from "./src/common/logging";
import { showMessage, showPrompt } from "./src/common/util/alertUtils";
import { CombinedContext } from "./src/context";
import { FilledNavigationContainer } from "./src/navigation/NavigationContainer";
import { getCustomTheme } from "./src/theme";

// Import and run the fistLaunch file
import "./src/firstLaunch";

/**
 * Main app container
 */
const App = () => {
  const isOfflineInternal = useRef(false);
  const [ theme, setTheme ] = useState<ICustomTheme | undefined>(undefined);

  const [ fontsLoaded, error ] = useFonts({
    "bodoni-flf-bold": require("./assets/fonts/bodoni-flf-font/Bodoni-FLF-Bold.ttf") as FontSource,
    "bodoni-flf-italic": require("./assets/fonts/bodoni-flf-font/Bodoni-FLF-Italic.ttf") as FontSource,
    "bodoni-flf-bold-italic": require("./assets/fonts/bodoni-flf-font/Bodoni-FLF-Bold-Italic.ttf") as FontSource,
    "bodoni-flf-roman": require("./assets/fonts/bodoni-flf-font/Bodoni-FLF-Roman.ttf") as FontSource,
    "opensans-condensed-bold": require("./assets/fonts/opensans-condensed/OpenSans-Condensed-Bold.ttf") as FontSource,
    "opensans-condensed-light": require("./assets/fonts/opensans-condensed/OpenSans-Condensed-Light.ttf") as FontSource,
    "opensans-condensed-light-italic": require("./assets/fonts/opensans-condensed/OpenSans-Condensed-Light-Italic.ttf") as FontSource,
  });

  useEffect(() => {
    if (error) {
      logError(error);
    }
  }, [error]);

  useEffect(() => {
    if (fontsLoaded) {
      hideAsync().catch(universalCatch);
      // Have to get the theme AFTER fonts are loaded
      setTheme(getCustomTheme());
    }
  }, [fontsLoaded]);

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
    if (!__DEV__) {
      const updatesSubscription = addUpdateListener(({
        type, message
      }) => {
        if (type === UpdateEventType.UPDATE_AVAILABLE) {
          showPrompt(
            "Updated data for the DanceBlue app is available, reload the app now?",
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

      const listener = AppState.addEventListener("change", (nextAppState) => {
        if (nextAppState === "active") {
          checkForUpdateAsync().then(({ isAvailable }) => {
            if (isAvailable) {
              return fetchUpdateAsync();
            }
          }).catch(universalCatch);
        }
      });

      return () => {
        updatesSubscription.remove();
        listener.remove();
      };
    }
  }, []);

  return (
    <NativeBaseProvider config={{ strictMode: __DEV__ ? "error" : "off" }} theme={theme}>
      <ErrorBoundary>
        <CombinedContext>
          <StatusBar backgroundColor="white" barStyle="dark-content" />
          <FilledNavigationContainer />
        </CombinedContext>
      </ErrorBoundary>
    </NativeBaseProvider>
  );
};

export default App;

