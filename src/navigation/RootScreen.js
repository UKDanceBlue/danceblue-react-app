import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import SplashLogin from '../screens/Modals/SplashLogin';
import MainStackRoot from './MainStackRoot';
import GenericWebviewScreen from '../screens/GenericWebviewScreen';

const RootStack = createStackNavigator();

const RootScreen = ({ navigation }) => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const isAuthLoaded = useSelector((state) => state.auth.isAuthLoaded);

  useEffect(() => {
    if (isAuthLoaded && !isLoggedIn) {
      navigation.navigate('SplashLogin');
    }
  }, [navigation, isAuthLoaded, isLoggedIn]);

  return (
    <>
      <RootStack.Navigator>
        <RootStack.Screen name="Main" component={MainStackRoot} options={{ headerShown: false }} />
        <RootStack.Screen
          name="SplashLogin"
          component={SplashLogin}
          options={{ headerShown: false, presentation: 'modal' }}
        />
        <RootStack.Screen
          name="DefaultRoute"
          component={GenericWebviewScreen}
          options={{ headerBackTitle: 'Back', headerTitle: 'DanceBlue' }}
        />
      </RootStack.Navigator>
    </>
  );
};

export default RootScreen;
