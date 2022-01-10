// Import third-party dependencies
import React, { useEffect, useState } from 'react';
import { StatusBar, LogBox, Linking } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import * as SecureStore from 'expo-secure-store';
import * as Random from 'expo-random';
import * as Device from 'expo-device';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
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

const uuidStoreKey = __DEV__ ? 'danceblue.device-uuid.dev' : 'danceblue.device-uuid';

/**
 * Main app container
 */
const App = () => {
  const [authObserverUnsubscribe, setAuthObserverUnsubscribe] = useState(() => {});

  /**
   * 1. Everytime the app starts get the uuid stored in the OS (creating one if it doesn't exist)
   * 2. Register for push notifications
   * 3. Store/update the push token under the device's uuid
   * 4. Add an auth state listener to store the current uid and audiences along with the push token in firebase
   */
  useEffect(() => {
    const getDeviceInfo = async () => {
      let uuid;
      let deviceRef;
      try {
        // Get UUID from async storage
        uuid = await SecureStore.getItemAsync(uuidStoreKey, {
          keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY,
        });

        // If nothing was in async storage, generate a new uuid and store it
        if (!uuid) {
          // Magic code to generate a uuid (not uid) for this device from SO - https://stackoverflow.com/a/2117523
          uuid = ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
            // eslint-disable-next-line no-bitwise
            (c ^ (Random.getRandomBytes(1)[0] & (15 >> (c / 4)))).toString(16)
          );
          await SecureStore.setItemAsync(uuidStoreKey, uuid, {
            keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY,
          });
        }

        deviceRef = doc(firebaseFirestore, 'devices', uuid);

        // Register push notifications
        const pushToken = await registerForPushNotificationsAsync();
        const audiences = ['all'];

        // Store the push notification token in firebase
        await setDoc(
          deviceRef,
          {
            expoPushToken: pushToken || null,
            audiences,
          },
          { mergeFields: ['expoPushToken', 'audiences'] }
        ).catch(handleFirebaeError);
        // Update the uid and audience stored in firebase for this device upon auth state change
        const observerUnsubscribe = onAuthStateChanged(firebaseAuth, (newUser) => {
          if (newUser) {
            // Get info about the user, including attributes
            getDoc(doc(firebaseFirestore, 'users', newUser.uid)).then(async (newUserData) => {
              if (newUserData?.data().attributes) {
                // Grab the user's attributes
                const attributeNames = Object.keys(newUserData.data().attributes);
                const audiencePromises = [];

                // Add any attributes with isAudience to the audiences array
                for (let i = 0; i < attributeNames.length; i++) {
                  audiencePromises.push(
                    getDoc(doc(firebaseFirestore, 'valid-attributes', attributeNames[i])).catch(
                      handleFirebaeError
                    )
                  );
                }
                await Promise.all(audiencePromises).then((audienceDocs) => {
                  for (let i = 0; i < audienceDocs.length; i++) {
                    const attributeData = audienceDocs[i].data();
                    const attributeName = audienceDocs[i].ref.id;
                    const userAttributeValue = newUserData.data().attributes[attributeName];
                    if (attributeData[userAttributeValue].isAudience) {
                      audiences.push(userAttributeValue);
                    }
                  }
                });
              }

              // If the user is on a team, add the team ID as an audience
              if (newUserData?.data().team) {
                audiences.push(newUserData?.data().team.id);
              }

              // Set the uid and audiences in firebase
              setDoc(
                deviceRef,
                {
                  latestUserId: newUser ? newUser.uid : null,
                  audiences,
                },
                { mergeFields: ['latestUserId', 'audiences'] }
              ).catch(handleFirebaeError);
            });
          } else {
            setDoc(
              deviceRef,
              {
                latestUserId: null,
              },
              { mergeFields: ['latestUserId', 'audiences'] }
            ).catch(handleFirebaeError);
          }
        });

        setAuthObserverUnsubscribe(observerUnsubscribe);
      } catch (error) {
        showMessage(error, 'Error setting notifications', null, true, { uuid, deviceRef });
        setAuthObserverUnsubscribe(() => {});
      }
    };
    getDeviceInfo();
  });

  useEffect(() => authObserverUnsubscribe, [authObserverUnsubscribe]);

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
          settings.status === 'undetermined' ||
          settings.ios?.status === Notifications.IosAuthorizationStatus.NOT_DETERMINED
        ) {
          settings = await Notifications.requestPermissionsAsync({
            android: {},
            ios: {
              allowAlert: true,
              allowBadge: true,
              allowSound: true,
              allowDisplayInCarPlay: false,
              allowCriticalAlerts: true,
              provideAppNotificationSettings: false,
              allowProvisional: false,
              allowAnnouncements: false,
            },
          }).catch(showMessage);
        }

        // The user allows notifications, return the push token
        if (
          settings.granted ||
          settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
        ) {
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
      } else {
        showMessage('Emulators will not recieve push notifications');
      }
    } catch (error) {
      showMessage(
        'Failed to get push token for push notification!',
        'Error',
        () => {},
        true,
        error
      );
    }
    return null;
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
    </>
  );
};

export default App;
