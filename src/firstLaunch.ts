import firestore from "@react-native-firebase/firestore";
import { DevMenu, isDevelopmentBuild } from "expo-dev-client";
import { setNotificationHandler } from "expo-notifications";
import { preventAutoHideAsync as preventSplashAutoHideAsync } from "expo-splash-screen";
import { LogBox } from "react-native";

import { universalCatch } from "./common/logging";
import { registerPushNotifications } from "./redux/notificationSlice";
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

let hasPushRegistrationObserverFired = false;
const pushRegistrationObserver = store.subscribe(() => {
  const { uuid } = store.getState().notification;
  // This will run on every redux state update until a uuid is set at which point it will try to register for push notifications
  if (!hasPushRegistrationObserverFired && uuid != null) {
    hasPushRegistrationObserverFired = true;
    store.dispatch(registerPushNotifications()).catch(universalCatch);
    pushRegistrationObserver();

    // Update the user's uid in firestore once the push registration is complete since uuid might have been uninitialized when the auth state first loads
    firestore()
      .doc(`devices/${uuid}`)
      .update({ latestUserId: store.getState().auth.uid })
      .catch(universalCatch);
  }
});
