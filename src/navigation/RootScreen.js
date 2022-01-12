import React, { useEffect, useState } from 'react';
import { Linking } from 'react-native';
import * as Notifications from 'expo-notifications';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { onAuthStateChanged } from 'firebase/auth';
import SplashLogin from '../screens/Modals/SplashLogin';
import MainStackRoot from './MainStackRoot';
import { firebaseAuth } from '../common/FirebaseApp';
import GenericWebviewScreen from '../screens/GenericWebviewScreen';

const RootStack = createStackNavigator();

const RootScreen = () => {
  const [userID, setUserID] = useState(null);

  useEffect(
    () =>
      onAuthStateChanged(firebaseAuth, (user) => {
        if (user) {
          setUserID(user.uid);
        } else {
          setUserID(user);
        }
      }),
    []
  );

  return (
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
      <RootStack.Navigator screenOptions={{ presentation: 'modal' }}>
        {userID && (
          <RootStack.Screen
            name="Main"
            component={MainStackRoot}
            options={{ headerShown: false }}
          />
        )}
        {!userID && (
          <RootStack.Screen
            name="SplashLogin"
            component={SplashLogin}
            options={{ headerShown: false }}
          />
        )}
        <RootStack.Screen
          name="DefaultRoute"
          component={GenericWebviewScreen}
          options={{ headerBackTitle: 'Back', headerTitle: 'DanceBlue' }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default RootScreen;
