import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useAssets } from 'expo-asset';
import AppLoading from 'expo-app-loading';
import { onAuthStateChanged } from 'firebase/auth';
import SplashLogin from '../screens/Modals/SplashLogin';
import MainStackRoot from './MainStackRoot';
import { showMessage } from '../common/AlertUtils';
import { firebaseAuth } from '../common/FirebaseApp';
import GenericWebviewScreen from '../screens/GenericWebviewScreen';

// All assets that should be preloaded:
const homeBackgroundImg = require('../../assets/home/db20_ribbon.jpg');
const dbLogo = require('../../assets/home/DB_Primary_Logo-01.png');
const splashLoginBackgorund = require('../../assets/home/Dancing-min.jpg');

const RootStack = createStackNavigator();

const RootScreen = () => {
  const [userID, setUserID] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [assets, error] = useAssets([splashLoginBackgorund, homeBackgroundImg, dbLogo]);

  useEffect(
    () =>
      onAuthStateChanged(firebaseAuth, (user) => {
        if (user) {
          setUserID(user.uid);
        } else {
          setUserID(user);
        }
        setIsLoading(false);
      }),
    []
  );

  if (error) {
    showMessage(error, 'Error loading assets');
  }

  if (isLoading || !assets) {
    return <AppLoading />;
  }
  return (
    <RootStack.Navigator screenOptions={{ presentation: 'modal' }}>
      {userID && (
        <RootStack.Screen name="Main" component={MainStackRoot} options={{ headerShown: false }} />
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
  );
};

export default RootScreen;
