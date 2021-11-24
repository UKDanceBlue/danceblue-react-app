// Import third-party dependencies
import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, ActivityIndicator, Button } from 'react-native';
import SingleSignOn from '../../common/SingleSignOn';

import { withFirebaseHOC } from '../../firebase/FirebaseContext';

/**
 * Component for "Profile" screen in main navigation
 */
const ProfileScreen = ({ auth, firestore }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    auth.checkAuthUser((authUser) => {
      if (authUser !== null) {
        if (!authUser.isAnonymous) {
          firestore.getUser(authUser.uid).then((doc) => {
            const userData = doc.data();
            setUser({ id: authUser.uid, ...userData });
            setLoggedIn(true);
            setIsLoading(false);
          });
        }
      }
    });
    setIsLoading(false);
  }, [auth, firestore]);

  /**
   * Have firebase sign out the current user and then sign in an anonomous user
   */
  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => auth.signInAnon())
      .then(() => {
        setLoggedIn(false);
        setUser(undefined);
      });
  };

  return (
    <View style={styles.container}>
      <>
        {
          /* Start of still loading view */ isLoading && (
            <ActivityIndicator style={styles.image} size="large" color="blue" />
          ) /* End of still loading view */
        }
        {
          /* Start of loaded view */ !isLoading && (
            <>
              {
                /* Start of logged in view */ loggedIn && (
                  <>
                    <Text>
                      You are logged in as {user.firstName} {user.lastName}
                    </Text>
                    <Text>{user.email}</Text>
                    <Button onPress={handleSignOut} title="Log out" />
                  </>
                ) /* End of logged in view */
              }
              {
                /* Start of logged out view */ !loggedIn && (
                  <>
                    <Text>You are logged out, to log in:</Text>
                    <Button
                      onPress={() => {
                        const sso = new SingleSignOn(auth, firestore);
                        sso.authenticate('saml-sign-in');
                      }}
                      title="Press me"
                    />
                  </>
                ) /* End of logged in view */
              }
            </>
          ) /* End of loaded view */
        }
      </>
    </View>
  );
};

const styles = StyleSheet.create({
  headerText: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badges: {
    flex: 5,
  },
  avatar: {
    flex: 1,
    height: 100,
    width: 100,
    resizeMode: 'contain',
    paddingLeft: 50,
  },
  footer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  sectionTitleView: {
    borderBottomColor: '#0033A0',
    borderBottomWidth: 1,
    textAlign: 'center',
  },
  container: {
    overflow: 'hidden',
    padding: 10,
    flex: 1,
  },
});

export default withFirebaseHOC(ProfileScreen);
