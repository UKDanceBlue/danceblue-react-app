/// <reference types="react" />
import React, { useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Text, Button, Image } from 'react-native-elements';
import * as Linking from 'expo-linking';
import { useAssets } from 'expo-asset';
import { useAppSelector } from '../../common/CustomHooks';
import SingleSignOn from '../../common/SingleSignOn';
import { globalStyles, globalColors, globalTextStyles } from '../../theme';

import store from '../../redux/store';
import { authSlice, logout } from '../../redux/authSlice';
import { appConfigSlice } from '../../redux/appConfigSlice';

/**
 * Component for "Profile" screen in main navigation
 */
const ProfileScreen = () => {
  const userData = useAppSelector((state) => state.auth);
  const demoModeKey = useAppSelector((state) => state.appConfig.demoModeKey);
  const [assets, error] = useAssets(require('../../../assets/avatar.png'));
  const [reportLongPressed, setReportLongPressed] = useState(false);
  const [suggestLongPressed, setSuggestLongPressed] = useState(false);

  return (
    <View style={{ alignItems: 'center', ...globalStyles.genericView }}>
      <>
        {
          /* Start of still loading view */ !userData.isAuthLoaded && (
            <ActivityIndicator size="large" color={globalColors.dbBlue} />
          ) /* End of still loading view */
        }
        {
          /* Start of loaded view */ userData.isAuthLoaded && (
            <>
              {assets && <Image source={assets[0]} style={{ height: 64, width: 64 }} />}
              {
                /* Start of logged in view */ userData.isLoggedIn &&
                  !userData.isAnonymous && (
                    <>
                      <Text style={globalStyles.genericText}>
                        You are logged in as {userData.firstName} {userData.lastName}
                      </Text>
                      <Text style={globalTextStyles.italicText}>{userData.email}</Text>
                      <Button
                        style={{ margin: 10, alignSelf: 'center' }}
                        onPress={() => store.dispatch(logout())}
                        title="Log out"
                      />
                    </>
                  ) /* End of logged in view */
              }
              {
                /* Start of logged in anonymously view */ userData.isLoggedIn &&
                  userData.isAnonymous && (
                    <>
                      <Text>You are logged in anonymously</Text>
                      <Button
                        style={{ margin: 10, alignSelf: 'center' }}
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
                      style={{ margin: 10, alignSelf: 'center' }}
                      onPress={() => {
                        const sso = new SingleSignOn();
                        sso.authenticate('saml-sign-in');
                      }}
                      title="Log in"
                    />
                  </>
                ) /* End of logged in view */
              }
              {reportLongPressed && suggestLongPressed && (
                <TextInput
                  style={{ borderWidth: 2, minWidth: '30%' }}
                  returnKeyType="go"
                  secureTextEntry={true}
                  onSubmitEditing={(event) => {
                    if (event.nativeEvent.text === demoModeKey) {
                      store.dispatch(appConfigSlice.actions.enterDemoMode());
                      store.dispatch(authSlice.actions.enterDemoMode());
                      setReportLongPressed(false);
                      setSuggestLongPressed(false);
                    }
                  }}
                />
              )}
              <View style={{ position: 'absolute', bottom: 0 }}>
                <Button
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    margin: 10,
                    alignSelf: 'center',
                  }}
                  onPress={() => {
                    Linking.openURL(
                      'mailto:app@danceblue.org?subject=DanceBlue%20App%20Issue%20Report&body=What%20happened%3A%0A%3Ctype%20here%3E%0A%0AWhat%20I%20was%20doing%3A%0A%3Ctype%20here%3E%0A%0AOther%20information%3A%0A%3Ctype%20here%3E'
                    );
                  }}
                  onLongPress={() => {
                    setReportLongPressed(true);
                  }}
                  title="Report an issue"
                />
                <Button
                  style={{ margin: 10, alignSelf: 'center' }}
                  onPress={() => {
                    Linking.openURL(
                      'mailto:app@danceblue.org?subject=DanceBlue%20App%20Suggestion&body=%3Ctype%20here%3E'
                    );
                  }}
                  onLongPress={() => {
                    setSuggestLongPressed(reportLongPressed ? true : false);
                  }}
                  title="Suggest a change"
                />
              </View>
            </>
          ) /* End of loaded view */
        }
      </>
    </View>
  );
};

export default ProfileScreen;
