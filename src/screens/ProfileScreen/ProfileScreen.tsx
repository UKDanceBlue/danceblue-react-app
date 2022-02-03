import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Text, Button } from 'react-native-elements';
import * as Linking from 'expo-linking';
import { useSelector } from 'react-redux';
import SingleSignOn from '../../common/SingleSignOn';
import { globalStyles, globalColors } from '../../theme';

import store from '../../redux/store';
import { logout } from '../../redux/authSlice';

/**
 * Component for "Profile" screen in main navigation
 */
const ProfileScreen = () => {
  const userData = useSelector((state) => state.auth);

  return (
    <View style={globalStyles.genericView}>
      <>
        {
          /* Start of still loading view */ !userData.isAuthLoaded && (
            <ActivityIndicator size="large" color={globalColors.dbBlue} />
          ) /* End of still loading view */
        }
        {
          /* Start of loaded view */ userData.isAuthLoaded && (
            <>
              {
                /* Start of logged in view */ userData.isLoggedIn &&
                  !userData.isAnonymous && (
                    <>
                      <Text>
                        You are logged in as {userData.firstName} {userData.lastName}
                      </Text>
                      <Text>{userData.email}</Text>
                      <Button onPress={() => store.dispatch(logout())} title="Log out" />
                    </>
                  ) /* End of logged in view */
              }
              {
                /* Start of logged in anonymously view */ userData.isLoggedIn &&
                  userData.isAnonymous && (
                    <>
                      <Text>You are logged in anonymously</Text>
                      <Button
                        onPress={() => {
                          const sso = new SingleSignOn();
                          sso.authenticate('saml-sign-in');
                        }}
                        title="Log in"
                      />
                    </>
                  ) /* End of logged in anonymously view */
              }
              {
                /* Start of logged out view */ !userData.isLoggedIn && (
                  <>
                    <Text>You are logged out, to log in:</Text>
                    <Button
                      onPress={() => {
                        const sso = new SingleSignOn();
                        sso.authenticate('saml-sign-in');
                      }}
                      title="Log in"
                    />
                  </>
                ) /* End of logged in view */
              }
              <Button
                onPress={() => {
                  Linking.openURL(
                    'mailto:app@danceblue.org?subject=DanceBlue%20App%20Issue%20Report&body=What%20happened%3A%0A%3Ctype%20here%3E%0A%0AWhat%20I%20was%20doing%3A%0A%3Ctype%20here%3E%0A%0AOther%20information%3A%0A%3Ctype%20here%3E'
                  );
                }}
                title="Report an issue"
              />
              <Button
                onPress={() => {
                  Linking.openURL(
                    'mailto:app@danceblue.org?subject=DanceBlue%20App%20Suggestion&body=%3Ctype%20here%3E'
                  );
                }}
                title="Suggest a change"
              />
            </>
          ) /* End of loaded view */
        }
      </>
    </View>
  );
};

export default ProfileScreen;
