// Import third-party dependencies
import React, { useEffect } from 'react';
import { StatusBar, LogBox, Linking } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import * as Notifications from 'expo-notifications';
import * as Random from 'expo-random';
import * as Device from 'expo-device';

// Import Firebase Context Provider
import { doc, setDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { registerRootComponent } from 'expo';
import RootScreen from './src/navigation/RootScreen';
import { handleFirebaeError, showMessage } from './src/common/AlertUtils';
import { globalColors } from './src/theme';

import { firebaseAuth, firebaseFirestore } from './src/common/FirebaseApp';

// Block the pop-up error box in dev-mode until firebase finds a way to remove the old AsyncStorage
LogBox.ignoreLogs([
  `AsyncStorage has been extracted from react-native core and will be removed in a future release`,
]);

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

/**
 * Main app container
 */
export default registerRootComponent(() => {
  /**
   * 1. Everytime the app starts get the uuid stored in the OS (creating one if it doesn't exist)
   * 2. Register for push notifications
   * 3. Store/update the push token under the device's uuid
   * 4. Add an auth state listener to store the curent uid along with the push token in firebase
   */
  useEffect(() => {
    try {
      let observerUnsubscribe;

      const secureStoreKey = 'danceblue-device-uuid';
      const secureStoreOptions = { keychainAccessible: SecureStore.ALWAYS_THIS_DEVICE_ONLY };

      SecureStore.getItemAsync(secureStoreKey, secureStoreOptions).then(async (value) => {
        let uuid;
        let deviceRef;
        // We have already set a UUID and can use the retrieved value
        if (value) {
          uuid = value;
          // Get this device's doc
          deviceRef = doc(firebaseFirestore, 'devices', uuid);
        }
        // We need to generate and save the UUID
        else {
          // Magic code to generate a uuid (not uid) for this device from SO - https://stackoverflow.com/a/2117523
          uuid = ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
            // eslint-disable-next-line no-bitwise
            (c ^ (Random.getRandomBytes(1)[0] & (15 >> (c / 4)))).toString(16)
          );
          deviceRef = doc(firebaseFirestore, 'devices', uuid);
          await SecureStore.setItemAsync(secureStoreKey, uuid, secureStoreOptions).catch(
            showMessage
          );
        }
        const pushToken = await registerForPushNotificationsAsync();
        if (pushToken) {
          // Retrieve and store a push notification token
          await setDoc(
            deviceRef,
            {
              expoPushToken: pushToken,
            },
            { mergeFields: ['expoPushToken'] }
          ).catch(handleFirebaeError);
          // Update the uid stored in firebase upon auth state change
          observerUnsubscribe = onAuthStateChanged(firebaseAuth, (newUser) =>
            setDoc(
              deviceRef,
              {
                latestUserId: newUser ? newUser.uid : null,
                audiences: newUser && newUser.attributes ? ['all', ...newUser.attributes] : ['all'],
              },
              { mergeFields: ['latestUserId', 'audiences'] }
            ).catch(handleFirebaeError)
          );
        }
      });
      // Unsubscribe on unmount
      return observerUnsubscribe;
    } catch (e) {
      showMessage(e);
    }
    return null;
  });

  /**
   * Register notification support with the OS and get a token from expo
   */
  const registerForPushNotificationsAsync = async () => {
    try {
      if (Device.isDevice) {
        // Get the user's current preference
        let settings = await Notifications.getPermissionsAsync().catch(showMessage);
        // If the user hasn't set a preference yet, ask them.
        if (
          !(
            settings.status === 'undetermined' ||
            settings.ios?.status === Notifications.IosAuthorizationStatus.NOT_DETERMINED
          )
        ) {
          settings = await Notifications.requestPermissionsAsync().catch(showMessage);
        }
        // If the user does not allow notifications, return null
        if (
          !(
            settings.granted ||
            settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
          )
        ) {
          return null;
        }

        if (Device.osName === 'Android') {
          Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: globalColors.red,
          }).catch(showMessage);
        }

        return (await Notifications.getExpoPushTokenAsync().catch(showMessage)).data;
      }
      showMessage('Emulators will not recieve push notifications');
      return null;
    } catch (error) {
      showMessage(
        'Failed to get push token for push notification!',
        'Error',
        () => {},
        true,
        error
      );
      return null;
    }
  };

  return (
    <>
      <StatusBar backgroundColor="blue" barStyle="dark-content" />
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
                      },
                    },
                    Profile: 'redirect/app-profile',
                    Notifications: 'redirect/app-notifications',
                  },
                },
                DefaultRoute: '*',
              },
            },
            async getInitialURL() {
              // First, you may want to do the default deep link handling
              // Check if app was opened from a deep link
              let url = await Linking.getInitialURL();

              if (url != null) {
                return url;
              }

              // Handle URL from expo push notifications
              const response = await Notifications.getLastNotificationResponseAsync();
              url = response?.notification.request.content.data.url;

              return url;
            },
            subscribe(listener) {
              const onReceiveURL = ({ url }) => listener(url);

              // Listen to incoming links from deep linking
              const deepLinkSubscription = Linking.addEventListener('url', onReceiveURL);

              // Listen to expo push notifications
              const expoSubscription = Notifications.addNotificationResponseReceivedListener(
                (response) => {
                  const { url } = response.notification.request.content.data;

                  // Any custom logic to see whether the URL needs to be handled
                  // ...

                  // Let React Navigation handle the URL
                  listener(url);
                }
              );

              return () => {
                // Clean up the event listeners
                deepLinkSubscription.remove();
                expoSubscription.remove();
              };
            },
          }
        }
      >
        <RootScreen />
      </NavigationContainer>
    </>
  );
});
