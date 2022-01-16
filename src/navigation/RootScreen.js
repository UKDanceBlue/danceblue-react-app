import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import { ActivityIndicator } from 'react-native';
import SplashLogin from '../screens/Modals/SplashLogin';
import MainStackRoot from './MainStackRoot';
import GenericWebviewScreen from '../screens/GenericWebviewScreen';
import { globalColors } from '../theme';

const RootStack = createStackNavigator();

const RootScreen = () => {
  const isAuthLoaded = useSelector((state) => state.auth.isAuthLoaded);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const navigation = useNavigation();

  useEffect(() => {
    if (isAuthLoaded) {
      if (isLoggedIn) {
        if (
          navigation.getState() &&
          navigation.getState().routes[navigation.getState().index].name === 'SplashLogin' &&
          navigation.canGoBack()
        ) {
          navigation.goBack();
        }
      } else {
        navigation.navigate('SplashLogin');
      }
    }
  }, [navigation, isAuthLoaded, isLoggedIn]);

  return (
    <>
      {!isAuthLoaded && (
        <ActivityIndicator
          size="large"
          color={globalColors.lightBlue}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
          }}
        />
      )}
      {isAuthLoaded && (
        <RootStack.Navigator>
          <RootStack.Screen
            name="Main"
            component={MainStackRoot}
            options={{ headerShown: false }}
          />
          <RootStack.Screen
            name="SplashLogin"
            component={SplashLogin}
            options={{ headerShown: false, presentation: 'modal', gestureEnabled: false }}
          />
          <RootStack.Screen
            name="DefaultRoute"
            component={GenericWebviewScreen}
            options={{ headerBackTitle: 'Back', headerTitle: 'DanceBlue' }}
          />
        </RootStack.Navigator>
      )}
    </>
  );
};

export default RootScreen;
