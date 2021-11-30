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
  const [userData, setUserData] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);

  const auth = useAuth();
  const firestore = useFirestore();

  useEffect(() => {
    auth.addUserObserver((authUser) => {
      if (authUser !== null && !authUser.isAnonymous) {
        firestore.getUser(authUser.uid).then((doc) => {
          const firestoreUserData = doc.data();
          setUserData({ id: authUser.uid, ...firestoreUserData });
          setLoggedIn(true);
        });
      } else {
        setLoggedIn(false);
      }
    });
    setIsLoading(false);
  }, [auth, firestore]);

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
                      You are logged in as {userData.firstName} {userData.lastName}
                    </Text>
                    <Text>{userData.email}</Text>
                    <Button onPress={auth.signOut} title="Log out" />
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
