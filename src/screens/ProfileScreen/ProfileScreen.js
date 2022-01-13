import { signOut } from 'firebase/auth';
import React from 'react';
import { Text, View, ActivityIndicator, Button } from 'react-native';
import { useSelector } from 'react-redux';
import SingleSignOn from '../../common/SingleSignOn';
import { firebaseAuth } from '../../common/FirebaseApp';
import { globalStyles, globalColors } from '../../theme';
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
                /* Start of logged in view */ userData.isLoggedIn && (
                  <>
                    <Text>
                      You are logged in as {userData.firstName} {userData.lastName}
                    </Text>
                    <Text>{userData.email}</Text>
                    <Button onPress={() => signOut(firebaseAuth)} title="Log out" />
                  </>
                ) /* End of logged in view */
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
