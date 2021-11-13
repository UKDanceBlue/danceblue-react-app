// Import third-party dependencies
import React, { useEffect, useState } from 'react';
import { Dimensions, Image } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

// Import first-party dependencies
import SplashLogin from '../screens/Modals/SplashLogin';
import { withFirebaseHOC } from '../firebase/FirebaseContext';
import MainStackRoot from './MainStackRoot';

const RootStack = createStackNavigator();

const RootScreen = ({ auth }) => {
  const [userID, setUserID] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    auth.checkAuthUser((user) => {
      if (user !== null) {
        setUserID(user.uid);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    });
  }, [auth]);

  if (isLoading) {
    return (
      <Image
        style={{
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height,
        }}
        source={require('../../assets/splash2.png')}
      />
    );
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

export default withFirebaseHOC(RootScreen);
