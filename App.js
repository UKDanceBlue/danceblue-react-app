// Import third-party dependencies
import React from 'react';
import { StatusBar, LogBox } from 'react-native';
import * as Notifications from 'expo-notifications';
import { useAssets } from 'expo-asset';
import AppLoading from 'expo-app-loading';
import { onAuthStateChanged } from 'firebase/auth';
import { Provider } from 'react-redux';
import RootScreen from './src/navigation/RootScreen';
import { showMessage } from './src/common/AlertUtils';

import store from './src/redux/store';
import { syncAuthDataWithUser } from './src/redux/authSlice';
import { firebaseAuth } from './src/common/FirebaseApp';
import { obtainUuid, registerPushNotifications } from './src/redux/notificationSlice';
import { updateConfig } from './src/redux/appConfigSlice';

// All assets that should be preloaded:
const homeBackgroundImg = require('./assets/home/db20_ribbon.jpg');
const dbLogo = require('./assets/home/DB_Primary_Logo-01.png');
const splashLoginBackgorund = require('./assets/home/Dancing-min.jpg');

// Block the pop-up error box in dev-mode until firebase finds a way to remove the old AsyncStorage
LogBox.ignoreLogs([
  `AsyncStorage has been extracted from react-native core and will be removed in a future release`,
]);

// Promise.allSettled polyfill
Promise.allSettled =
  Promise.allSettled ||
  ((promises) =>
    Promise.all(
      promises.map((p) =>
        p
          .then((value) => ({
            status: 'fulfilled',
            value,
          }))
          .catch((reason) => ({
            status: 'rejected',
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

const firstTimeSync = onAuthStateChanged(firebaseAuth, (user) => {
  // This will run after auth is initialized and never again
  store.dispatch(syncAuthDataWithUser(user));
  store.dispatch(obtainUuid());
  store.dispatch(updateConfig());
  firstTimeSync();
});

let hasPushRegistrationObserverFired = false;
const pushRegistrationObserver = store.subscribe(() => {
  // This will run on every redux state update until a uuid is set when it will try to register for push notifications
  if (!hasPushRegistrationObserverFired && store.getState().notification.uuid) {
    hasPushRegistrationObserverFired = true;
    store.dispatch(registerPushNotifications());
    pushRegistrationObserver();
  }
});

/**
 * Main app container
 */
const App = () => {
  const [assets, assetError] = useAssets([splashLoginBackgorund, homeBackgroundImg, dbLogo]);

  if (assetError) {
    showMessage(assetError, 'Error loading assets');
  }

  if (!assets) {
    return <AppLoading />;
  }

  return (
    <Provider store={store}>
      <StatusBar backgroundColor="blue" barStyle="dark-content" />
      <RootScreen />
    </Provider>
  );
};

export default App;
