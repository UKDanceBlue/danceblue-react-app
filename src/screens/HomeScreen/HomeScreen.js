// Import third-party dependencies
import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView } from 'react-native';

// Import first-party dependencies
import SponsorCarousel from './SponsorCarousel';
import CountdownView from '../../common/components/CountdownView';
import HeaderImage from './HeaderImage';
import { withFirebaseHOC } from '../../firebase/FirebaseContext';

/**
 * Component for home screen in main navigation
 * @param {Object} props Properties of the component: navigation, firebase
 */
const HomeScreen = ({ navigation, navigation: { navigate }, firestore, auth }) => {
  [activeCountdown, setActiveCountDown] = useState(true);
  [userID, setUserID] = useState('');

  useEffect(() => {
    firestore.getConfig().then((doc) => {
      setActiveCountDown(doc.data().activeCountdown);
    });
    auth.checkAuthUser((user) => {
      if (user !== null) {
        if (!user.isAnonymous) {
          setUserID(user.uid);
        }
      }
    });
  });

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <SafeAreaView style={{ flex: 1 }}>
        <HeaderImage />
        {activeCountdown && <CountdownView />}
        <SponsorCarousel />
      </SafeAreaView>
    </ScrollView>
  );
};

HomeScreen.navigationOptions = {
  title: 'Home',
};

export default withFirebaseHOC(HomeScreen);
