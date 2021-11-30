// Import third-party dependencies
import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView } from 'react-native';

// Import first-party dependencies
import SponsorCarousel from './SponsorCarousel';
import CountdownView from '../../common/components/CountdownView';
import HeaderImage from './HeaderImage';
import { useFirestore } from '../../firebase/FirebaseFirestoreWrappers';
import { useAuth } from '../../firebase/FirebaseAuthWrappers';

/**
 * Component for home screen in main navigation
 * @param {Object} props Properties of the component: navigation, firebase
 */
const HomeScreen = () => {
  const [activeCountdown, setActiveCountDown] = useState(true);
  const [userID, setUserID] = useState(undefined);

  const firestore = useFirestore();
  const auth = useAuth();

  // Run on mount and when userID changes
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
  }, [auth, firestore, userID]);

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

export default HomeScreen;
