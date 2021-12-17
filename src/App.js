// Import third-party dependencies
import { registerRootComponent } from 'expo';
import React, { useEffect } from 'react';
import { StatusBar, LogBox, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';

// Import Firebase Context Provider
import { decode, encode } from 'base-64';
import RootScreen from './navigation/RootScreen';
import { showMessage } from './common/AlertUtils';
import { globalColors } from './theme';

import { firebaseFirestore } from './firebase/FirebaseApp';
import { addPushTokenToFirebase } from './firebase/FirebaseUtils';

// Fix firestore error - can be removed if issue is resolved in package
if (!global.btoa) {
  global.btoa = encode;
}
if (!global.atob) {
  global.atob = decode;
}

LogBox.ignoreLogs(['Setting a timer']);

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
   * Register notification support with the OS
   * Adds *expoPushToken* to *this.state* if successfull
   */
  const registerForPushNotificationsAsync = async () => {
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
        return;
      }
      const token = (await Notifications.getExpoPushTokenAsync()).data;
      addPushTokenToFirebase(firebaseFirestore, token);
    } else {
      showMessage('Must use physical device for Push Notifications');
      return;
    }

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: globalColors.red,
      });
    }
  };

  useEffect(() => {
    registerForPushNotificationsAsync();

    // TODO handle notifications here
  }, []);

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
