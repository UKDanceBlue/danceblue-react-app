import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import { ActivityIndicator } from 'react-native';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import SplashLogin from '../screens/Modals/SplashLogin';
import MainStackRoot from './MainStackRoot';
import GenericWebviewScreen from '../screens/GenericWebviewScreen';
import { globalColors } from '../theme';
import { firebaseFirestore } from '../common/FirebaseApp';

const RootStack = createStackNavigator();

const RootScreen = () => {
  const isAuthLoaded = useSelector((state) => state.auth.isAuthLoaded);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const userAttributes = useSelector((state) => state.auth.attributes);
  const userTeamId = useSelector((state) => state.auth.teamId);
  const userId = useSelector((state) => state.auth.uid);
  const uuid = useSelector((state) => state.notification.uuid);
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      if (isAuthLoaded && uuid) {
        // Update the audience data in this device's firebase document
        const audiences = ['all'];
        if (
          typeof userAttributes === 'object' &&
          !Array.isArray(userAttributes) &&
          userAttributes !== null &&
          Object.keys(userAttributes).length > 0
        ) {
          // Grab the user's attributes
          const attributeNames = Object.keys(userAttributes);
          const audiencePromises = [];

          // Add any attributes with isAudience to the audiences array
          for (let i = 0; i < attributeNames.length; i++) {
            audiencePromises.push(
              getDoc(doc(firebaseFirestore, 'valid-attributes', attributeNames[i]))
            );
          }
          await Promise.all(audiencePromises).then((audienceDocs) => {
            for (let i = 0; i < audienceDocs.length; i++) {
              const attributeData = audienceDocs[i].data();
              const attributeName = audienceDocs[i].ref.id;
              const userAttributeValue = userAttributes[attributeName];
              if (attributeData[userAttributeValue].isAudience) {
                audiences.push(userAttributeValue);
              }
            }
          });
        }

        // If the user is on a team, add the team ID as an audience
        if (userTeamId) {
          audiences.push(userTeamId);
        }

        await setDoc(
          doc(firebaseFirestore, 'devices', uuid),
          {
            latestUserId: userId || null,
            audiences,
          },
          { mergeFields: ['latestUserId', 'audiences'] }
        );
      }
    })();
  }, [userAttributes, isAuthLoaded, userTeamId, userId, uuid]);

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
