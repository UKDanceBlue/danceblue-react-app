import { isDevelopmentBuild } from "expo-dev-client";
import { setNotificationHandler } from "expo-notifications";
import { preventAutoHideAsync } from "expo-splash-screen";
import { LogBox } from "react-native";

import { universalCatch } from "./common/logging";

preventAutoHideAsync().catch(universalCatch);

LogBox.ignoreLogs(["'SplashScreen.show' has already been called for given view controller."]);

if (isDevelopmentBuild()) {
  // This is where dev-menu registration goes
}

// Configure the notifications handler to decide what to do when a notification is received if the app is open
setNotificationHandler({
  // eslint-disable-next-line @typescript-eslint/require-await
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});
