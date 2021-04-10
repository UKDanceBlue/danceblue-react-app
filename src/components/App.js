// Import third-party dependencies
import { registerRootComponent } from 'expo'
import React from 'react'
import { StatusBar, LogBox } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';

// Import Firebase Context Provider
import Firebase, { FirebaseProvider } from '../../config/Firebase'
import { RootStackScreen } from '../screens'

// Fix firestore error - can be removed if issue is resolved in package
import { decode, encode } from 'base-64'
if (!global.btoa) {
  global.btoa = encode
}
if (!global.atob) {
  global.atob = decode
}

LogBox.ignoreLogs(['Setting a timer'])

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

// Create container for app with navigations
class App extends React.Component {

  constructor(props) {
    super(props)

    this.state = {}
  }

  componentDidMount() {

    this.registerForPushNotificationsAsync()

    Notifications.addNotificationReceivedListener(this._handleNotification)

    Notifications.addNotificationResponseReceivedListener(this._handleNotificationResponse)
  }

  _handleNotification = notification => {
    this.setState({ notification: notification });
  };

  _handleNotificationResponse = response => {
  };

  async registerForPushNotificationsAsync() {
    if (Constants.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      console.log(finalStatus)
      if (Platform.OS === 'ios' && finalStatus === 1) finalStatus = 'granted'
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      const token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token)
      Firebase.addPushToken(token)
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
  };

  render() {
    return (
      <FirebaseProvider value={Firebase}>
        <StatusBar />
        <NavigationContainer>
          <RootStackScreen />
        </NavigationContainer>
      </FirebaseProvider>
    )
  }
}

export default registerRootComponent(App)
