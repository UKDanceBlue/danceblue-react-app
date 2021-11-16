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

import { withFirebaseHOC } from '../../firebase/FirebaseContext';

const splashBackgorund = require('../../../assets/home/Dancing-min.jpg');

/**
 * A simplified sign in page shown when the user first opens the app
 * @param {Object} props Properties of the component: navigation, firebase
 * @class
 */
const SplashLoginScreen = ({ auth, firestore }) => (
  <View style={styles.container}>
    <ImageBackground source={splashBackgorund} style={styles.image}>
      <View style={styles.textBackground}>
        <View style={styles.header}>
          <Text h2 style={{ textAlign: 'center' }}>
            Welcome to UK DanceBlue!
          </Text>
          <Text style={styles.headerText}>
            The UK DanceBlue app has many features that are only available with a user account.
          </Text>
          <Text />
          <Text style={styles.headerText}>
            With an account you get access to profile badges, team info, and other features coming
            soon!
          </Text>
        </View>
        <View style={styles.form}>
          <Text h3 style={{ textAlign: 'center' }}>
            Sign in with your UK LinkBlue account
          </Text>
          <TouchableOpacity
            onPress={() => {
              const sso = new SingleSignOn(auth, firestore);
              sso.authenticate('saml-sign-in');
            }}
          >
            <Text>SSO Login!</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.footer}>
          <Text>Want to look around first? You can always sign in later on the profile page</Text>
          <TouchableOpacity onPress={() => auth.signInAnon()}>
            <Text>Continue as a Guest</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textBackground: {
    backgroundColor: '#FFFFFF99',
    flex: 1,
  },
  header: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 16,
    textAlign: 'center',
  },
  form: {
    flex: 2,
  },
  footer: {
    flex: 1,
  },
  image: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

export default withFirebaseHOC(SplashLoginScreen);
