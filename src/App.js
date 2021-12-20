// Import third-party dependencies
import { registerRootComponent } from 'expo';
import React, { useEffect } from 'react';
import { StatusBar, LogBox, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';
import * as Notifications from 'expo-notifications';
import * as Random from 'expo-random';

// Import Firebase Context Provider
import { doc, setDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import RootScreen from './navigation/RootScreen';
import { handleFirebaeError, showMessage } from './common/AlertUtils';
import { globalColors } from './theme';

import { firebaseAuth, firebaseFirestore } from './common/FirebaseApp';

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
const App = () => {
  /**
   * 1. Everytime the app starts get the uuid stored in the OS (creating one if it doesn't exist)
   * 2. Register for push notifications
   * 3. Store/update the push token under the device's uuid
   * 4. Add an auth state listener to store the curent uid along with the push token in firebase
   */
  useEffect(() => {
    let observerUnsubscribe;

    const secureStoreKey = 'danceblue-device-uuid';
    const secureStoreOptions = { keychainAccessible: SecureStore.ALWAYS_THIS_DEVICE_ONLY };

    SecureStore.isAvailableAsync().then(async (isAvailable) => {
      if (isAvailable) {
        await SecureStore.getItemAsync(secureStoreKey, secureStoreOptions).then(async (value) => {
          let uuid;
          let deviceRef;
          // We have already set a UUID and can use the r etrieved value
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
          // Retrieve and store a push notification token
          await setDoc(
            deviceRef,
            {
              expoPushToken: await registerForPushNotificationsAsync(),
            },
            { mergeFields: ['expoPushToken'] }
          ).catch(handleFirebaeError);
          // Update the uid stored in firebase upon auth state change
          observerUnsubscribe = onAuthStateChanged(firebaseAuth, (newUser) =>
            setDoc(
              deviceRef,
              { latestUserId: newUser.uid },
              { mergeFields: ['latestUserId'] }
            ).catch(handleFirebaeError)
          );
        });
      } else {
        showMessage('Cannot save device ID, you will not recieve push notificatons');
      }
      return observerUnsubscribe;
    }, []);
  });

  /**
   * Register notification support with the OS and get a token from expo
   */
  const registerForPushNotificationsAsync = async () => {
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: globalColors.red,
      });
    }

    if (Constants.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (Platform.OS === 'ios' && finalStatus === 1) finalStatus = 'granted';
      if (finalStatus !== 'granted') {
        showMessage(
          'Failed to get push token for push notification!',
          'Error',
          () => {},
          true,
          `Final Status: ${finalStatus}`
        );
        return undefined;
      }
      return (await Notifications.getExpoPushTokenAsync()).data;
    }
    showMessage('Must use physical device for Push Notifications');
    return undefined;
  };

  /**
   * Called to generate a React Native component
   * @see {@link https://heartbeat.comet.ml/upload-images-in-react-native-apps-using-firebase-and-firestore-297934c9bae8#:~:text=the%20below%20snippet%3A-,Using%20the%20Context%20API,-Using%20the%20Context The article Kenton got the FirebaseProvider from}
   * @returns A JSX formatted component
   */
  return (
    <>
      <StatusBar backgroundColor="blue" barStyle="dark-content" />
      <NavigationContainer>
        <RootScreen />
      </NavigationContainer>
    </>
  );
};

export default registerRootComponent(App);
