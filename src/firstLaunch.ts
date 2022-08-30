import { DevMenu, isDevelopmentBuild } from "expo-dev-client";
import { setNotificationHandler } from "expo-notifications";
import { preventAutoHideAsync as preventSplashAutoHideAsync } from "expo-splash-screen";
import { LogBox } from "react-native";

import { universalCatch } from "./common/logging";
import { obtainUuid } from "./redux/notificationSlice";
import store from "./redux/store";

LogBox.ignoreLogs(["'SplashScreen.show' has already been called for given view controller."]);

if (isDevelopmentBuild()) {
  // eslint-disable-next-line no-console
  DevMenu.registerDevMenuItems([{ name: "Print Redux State", callback: () => console.log(JSON.stringify(store.getState(), null, 2)) }]).catch(universalCatch);
}

// All assets that should be preloaded:

// Configure the notifications handler to decide what to do when a notification is received if the app is open
setNotificationHandler({
  // eslint-disable-next-line @typescript-eslint/require-await
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

// Don't hide the splash screen until it is dismissed
preventSplashAutoHideAsync().catch(universalCatch);

store.dispatch(obtainUuid()).catch(universalCatch);
