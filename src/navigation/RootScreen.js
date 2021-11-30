// Import third-party dependencies
import React, { useEffect, useState } from 'react';
import { Dimensions, Image } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAssets } from 'expo-asset';
import AppLoading from 'expo-app-loading';

// Import first-party dependencies
import SplashLogin from '../screens/Modals/SplashLogin';
import MainStackRoot from './MainStackRoot';
import { showMessage } from '../common/AlertUtils';
import { useAuth } from '../firebase/FirebaseAuthWrappers';

// All assets that should be preloaded:
const profileButtonImage = require('../../assets/more/Profile_Button.jpg');
const donateButtonImage = require('../../assets/more/Donate_Button.jpg');
const faqsButtonImage = require('../../assets/more/FAQs_Button.jpg');
const aboutButtonImage = require('../../assets/more/About_Button.jpg');
const backgroundImg = require('../../assets/home/db20_ribbon.jpg');
const dbLogo = require('../../assets/home/DB_Primary_Logo-01.png');

const RootStack = createStackNavigator();

const RootScreen = () => {
  const [userID, setUserID] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const auth = useAuth();

  const [assets, error] = useAssets([
    profileButtonImage,
    donateButtonImage,
    faqsButtonImage,
    aboutButtonImage,
    backgroundImg,
    dbLogo,
  ]);

  useEffect(() => {
    auth.checkAuthUser((user) => {
      if (user !== null) {
        setUserID(user.uid);
      }
      setIsLoading(false);
    });
  }, [auth]);

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
    </RootStack.Navigator>
  );
};

export default RootScreen;
