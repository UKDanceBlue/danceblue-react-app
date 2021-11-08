import React from 'react';
import { StyleSheet, View, ImageBackground, Dimensions } from 'react-native';
import { Text, Button } from 'react-native-elements';

import { withFirebaseHOC } from '../../firebase/FirebaseContext';

/**
 * A simplified sign in page shown when the user first opens the app
 * @param {Object} props Properties of the component: navigation, firebase
 * @author Kenton Carrier
 * @since 1.0.1
 * @class
 */
class SplashLoginScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      formShown: 'signup',
    };

    this.signInAnon = this.signInAnon.bind(this);
  }

  /**
   * Wraps config/Firebase's firebase.signInAnon()
   */
  signInAnon() {
    this.props.auth.signInAnon();
  }

  /**
   * Called by React Native when rendering the screen
   * @returns A JSX formatted Component
   * @author Kenton Carrier
   * @since 1.0.1
   */
  render() {
    return (
      <View style={styles.container}>
        <ImageBackground
          source={require('../../../assets/home/Dancing-min.jpg')}
          style={styles.image}
        >
          <View style={styles.textBackground}>
            <View style={styles.header}>
              <Text h2 style={{ textAlign: 'center' }}>
                Welcome to UK DanceBlue!
              </Text>
              <Text style={styles.headerText}>
                The UK DanceBlue app has many features that are only available with a user account.
              </Text>
              <Text></Text>
              <Text style={styles.headerText}>
                With an account you get access to profile badges, and many more new features coming
                soon!
              </Text>
            </View>
            <View style={styles.form}>
              {this.state.formShown === 'signup' ? (
                <>
                  <Text h3 style={{ textAlign: 'center' }}>
                    Sign Up
                  </Text>
                  <Text>WIP</Text>
                  <Button
                    title="Already signed up? Click here to Log in!"
                    onPress={() => this.setState({ formShown: 'login' })}
                    type="clear"
                  />
                </>
              ) : (
                <>
                  <Text h3 style={{ textAlign: 'center' }}>
                    Login
                  </Text>
                  <Text>WIP</Text>
                  <Button
                    type="clear"
                    title="New? Click here to Sign Up!"
                    onPress={() => this.setState({ formShown: 'signup' })}
                  />
                </>
              )}
            </View>
            <View style={styles.footer}>
              <Text style={{ textAlign: 'center' }}>
                Want to look around first? You can always sign up later on the profile page
              </Text>
              <Button type="clear" title="Continue as a Guest" onPress={() => this.signInAnon()} />
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  }
}

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
