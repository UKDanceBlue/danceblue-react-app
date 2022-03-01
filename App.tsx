/// <reference types="react" />
// Import third-party dependencies
import React, { useEffect } from 'react';
import { StatusBar, Linking } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import * as Notifications from 'expo-notifications';
import { useAssets } from 'expo-asset';
import AppLoading from 'expo-app-loading';
import { NavigationContainer } from '@react-navigation/native';
import { onAuthStateChanged } from 'firebase/auth';
import { Provider } from 'react-redux';
// https://github.com/firebase/firebase-js-sdk/issues/97#issuecomment-427512040
import './src/common/AndroidTimerFix';
import { ThemeProvider } from 'react-native-elements';
import RootScreen from './src/navigation/RootScreen';
import { showMessage } from './src/common/AlertUtils';

import store from './src/redux/store';
import { logout, syncAuthStateWithUser } from './src/redux/authSlice';
import { firebaseAuth } from './src/common/FirebaseApp';
import { obtainUuid, registerPushNotifications } from './src/redux/notificationSlice';
import { appConfigSlice, updateConfig } from './src/redux/appConfigSlice';
import { rnElementsTheme } from './src/theme';

// All assets that should be preloaded:
const homeBackgroundImg = require('./assets/home/db20_ribbon.jpg');
const dbLogo = require('./assets/home/DB_Primary_Logo-01.png');
const splashLoginBackground = require('./assets/home/Dancing-min.jpg');

// Promise.allSettled polyfill
Promise.allSettled =
  Promise.allSettled ||
  ((promises: any[]) =>
    Promise.all(
      promises.map((p) =>
        p
          .then((value: any) => ({
            status: 'fulfilled',
            value,
          }))
          .catch((reason: any) => ({
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
  if (user) {
    // This will run after auth is initialized and never again
    store.dispatch(syncAuthStateWithUser(user));
  } else {
    store.dispatch(logout());
  }
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
  const [assets, assetError] = useAssets([splashLoginBackground, homeBackgroundImg, dbLogo]);

  useEffect(
    () =>
      NetInfo.addEventListener((state) => {
        if (!state.isInternetReachable) {
          if (!store.getState().appConfig.offline) {
            showMessage(
              'You seem to be offline, some functionality may be unavailable or out of date'
            );
            store.dispatch(appConfigSlice.actions.goOffline());
          }
        } else if (store.getState().appConfig.offline) {
          store.dispatch(appConfigSlice.actions.goOnline());
        }
      }),
    []
  );

  if (assetError) {
    showMessage(assetError, 'Error loading assets');
  }

  if (!assets && hasPushRegistrationObserverFired) {
    return <AppLoading />;
  }

  return (
    <Provider store={store}>
      <ThemeProvider theme={rnElementsTheme}>
        <StatusBar backgroundColor="white" barStyle="dark-content" />
        <NavigationContainer
          linking={
            // From https://docs.expo.dev/versions/latest/sdk/notifications/#handling-push-notifications-with-react-navigation
            {
              prefixes: ['danceblue://'],
              config: {
                screens: {
                  Main: {
                    initialRouteName: 'Tab',
                    screens: {
                      Tab: {
                        screens: {
                          Home: 'redirect',
                          Scoreboard: 'redirect/team-rankings',
                          Team: 'redirect/my-team',
                          Store: 'redirect/dancebluetique',
                          Donate: 'redirect/donate',
                          HoursScreen: 'redirect/marathon',
                        },
                      },
                      Profile: 'redirect/app-profile',
                      Notifications: 'redirect/app-notifications',
                    },
                  },
                  DefaultRoute: '*',
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
                const deepLinkSubscription = Linking.addEventListener('url', onReceiveURL);

                // Listen to expo push notifications
                const expoSubscription = Notifications.addNotificationResponseReceivedListener(
                  (response) => {
                    const url = response.notification.request.content.data.url as string;

                    // Any custom logic to see whether the URL needs to be handled
                    // ...

                    // Let React Navigation handle the URL
                    listener(url);
                  }
                );

                return () => {
                  // Clean up the event listeners
                  if (deepLinkSubscription) {
                    deepLinkSubscription.remove();
                  }
                  if (expoSubscription) {
                    expoSubscription.remove();
                  }
                };
              },
            }
          }
        >
          <RootScreen />
        </NavigationContainer>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
