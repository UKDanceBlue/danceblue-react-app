import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import SponsorCarousel from './SponsorCarousel';
import CountdownView from '../../common/components/CountdownView';
import HeaderImage from './HeaderImage';
import { firebaseAuth, firebaseFirestore } from '../../common/FirebaseApp';

/**
 * Component for home screen in main navigation
 * @param {Object} props Properties of the component: navigation, firebase
 */
const HomeScreen = () => {
  const [activeCountdown, setActiveCountDown] = useState(true);
  const [userID, setUserID] = useState(undefined);

  // Run on mount and when userID changes
  useEffect(() => {
    getDoc(doc(firebaseFirestore, 'configs', 'mobile-app')).then((document) => {
      setActiveCountDown(document.data().activeCountdown);
    });
    return onAuthStateChanged(firebaseAuth, (user) => {
      if (user !== null) {
        if (!user.isAnonymous) {
          setUserID(user.uid);
        }
      }
    });
  }, [userID]);

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
