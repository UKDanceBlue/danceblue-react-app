import React from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
  ImageBackground,
  Dimensions,
} from 'react-native';

import SingleSignOn from '../../common/SingleSignOn';
import { globalStyles, globalTextStyles } from '../../theme';

import store from '../../redux/store';
import { loginAnon } from '../../redux/authSlice';

const splashBackgorund = require('../../../assets/home/Dancing-min.jpg');

/**
 * A simplified sign in page shown when the user first opens the app
 * @param {Object} props Properties of the component: navigation, firebase
 * @class
 */
const SplashLoginScreen = () => (
  <View style={globalStyles.genericCenteredView}>
    <ImageBackground source={splashBackgorund} style={localStyles.image}>
      <View style={localStyles.textContainerWithBackground}>
        <View style={globalStyles.genericHeaderContainer}>
          <Text h2 style={{ textAlign: 'center' }}>
            Welcome to UK DanceBlue!
          </Text>
          <Text style={globalTextStyles.headerText}>
            The UK DanceBlue app has many features that are only available with a user account.
          </Text>
          <Text />
          <Text style={globalTextStyles.headerText}>
            With an account you get access to profile badges, team info, and other features coming
            soon!
          </Text>
        </View>
        <View style={globalStyles.genericHeaderContainer}>
          <Text h3 style={globalStyles.genericText}>
            Sign in with your UK LinkBlue account
          </Text>
          <TouchableOpacity
            onPress={() => {
              const sso = new SingleSignOn();
              sso.authenticate('saml-sign-in');
            }}
            style={globalStyles.genericButton}
          >
            <Text style={globalStyles.genericText}>SSO Login!</Text>
          </TouchableOpacity>
        </View>
        <View style={globalStyles.genericCenteredView}>
          <Text style={globalStyles.genericText}>
            Want to look around first? You can always sign in later on the profile page
          </Text>
          <TouchableOpacity
            onPress={() => store.dispatch(loginAnon())}
            style={globalStyles.genericButton}
          >
            <Text style={globalStyles.genericText}>Continue as a Guest</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  </View>
);

const localStyles = {
  image: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  textContainerWithBackground: StyleSheet.compose(globalStyles.genericView, {
    backgroundColor: '#FFFFFF99',
  }),
};

export default SplashLoginScreen;
