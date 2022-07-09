import { DevMenu, isDevelopmentBuild } from "expo-dev-client";
import { scheduleNotificationAsync, setNotificationHandler } from "expo-notifications";
import { preventAutoHideAsync } from "expo-splash-screen";
import registerRootComponent from "expo/build/launch/registerRootComponent";

import App from "./App";
import { registerPushNotifications } from "./src/redux/notificationSlice";
import store from "./src/redux/store";


if (isDevelopmentBuild()) {
  // eslint-disable-next-line
  void DevMenu.registerDevMenuItems([{ name: "Print Redux State", callback: () => console.log(JSON.stringify(store.getState(), null, 2)) }]);
}

// All assets that should be preloaded:

// Configure the notifications handler
setNotificationHandler({
  // eslint-disable-next-line @typescript-eslint/require-await
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

// Don't hide the splash screen until it is dismissed automatically
void preventAutoHideAsync();

let hasPushRegistrationObserverFired = false;
const pushRegistrationObserver = store.subscribe(() => {
  // This will run on every redux state update until a uuid is set when it will try to register for push notifications
  if (!hasPushRegistrationObserverFired && store.getState().notification.uuid) {
    void scheduleNotificationAsync({
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

registerRootComponent(App);
