// Import third-party dependencies
import { registerRootComponent } from 'expo';
import React from 'react';
import { StatusBar, LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { compose } from 'recompose';

// Import Firebase Context Provider
import FirebaseFirestoreWrappers from './firebase/FirebaseFirestoreWrappers';
import FirebaseAuthWrappers from './firebase/FirebaseAuthWrappers';
import FirebaseCoreWrappers from './firebase/FirebaseCoreWrappers';
import { FirebaseProvider } from './firebase/FirebaseContext';
import RootScreen from './navigation/RootScreen';

// Fix firestore error - can be removed if issue is resolved in package
import { decode, encode } from 'base-64';
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
class App extends React.Component {
  constructor(props) {
    super(props);
    console.log('test');
    this.state = {
      isReady: false,
    };
  }

  /**
   * Called immediately after a component is mounted. Setting state here will trigger re-rendering.
   */
  componentDidMount() {
    this.registerForPushNotificationsAsync();

    Notifications.addNotificationReceivedListener(this._handleNotification);

    Notifications.addNotificationResponseReceivedListener(this._handleNotificationResponse);
  }

  /**
   * Called by Expo
   * Adds *notification* to *this.state*
   * @param {Notifications.Notification} notification
   * @private
   */
  _handleNotification = (notification) => {
    this.setState({ notification: notification });
  };

  /**
   * Called by Expo
   * @param {Notifications.NotificationResponse} response
   * @private
   */
  _handleNotificationResponse = (response) => {};

  /**
   * Register notification support with the OS
   * Adds *expoPushToken* to *this.state* if successfull
   */
  async registerForPushNotificationsAsync() {
    if (Constants.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (Platform.OS === 'ios' && finalStatus === 1) finalStatus = 'granted';
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      const token = (await Notifications.getExpoPushTokenAsync()).data;
      FirebaseFirestoreWrappers.addPushToken(token);
      this.setState({ expoPushToken: token });
    } else {
      alert('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  }

  /**
   * Called to generate a React Native component
   * @see {@link https://heartbeat.comet.ml/upload-images-in-react-native-apps-using-firebase-and-firestore-297934c9bae8#:~:text=the%20below%20snippet%3A-,Using%20the%20Context%20API,-Using%20the%20Context The article Kenton got the FirebaseProvider from}
   * @returns A JSX formatted component
   */
  render() {
    return (
      <FirebaseProvider
        value={{
          firestore: FirebaseFirestoreWrappers,
          auth: FirebaseAuthWrappers,
          core: FirebaseCoreWrappers,
        }}
      >
        <StatusBar />
        <NavigationContainer>
          <RootScreen />
        </NavigationContainer>
      </FirebaseProvider>
    );
  }
}

export default compose(registerRootComponent)(App);
