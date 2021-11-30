// Import third-party dependencies
import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, ActivityIndicator, Button } from 'react-native';
import SingleSignOn from '../../common/SingleSignOn';
import { useAuth } from '../../firebase/FirebaseAuthWrappers';
import { useFirestore } from '../../firebase/FirebaseFirestoreWrappers';

import { globalStyles, globalColors } from '../../theme';

/**
 * Component for "Profile" screen in main navigation
 */
const ProfileScreen = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);

  const auth = useAuth();
  const firestore = useFirestore();

  useEffect(() => {
    auth.addUserObserver((authUser) => {
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
    <View style={globalStyles.genericView}>
      <>
        {
          /* Start of still loading view */ isLoading && (
            <ActivityIndicator size="large" color={globalColors.dbBlue} />
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

export default ProfileScreen;
