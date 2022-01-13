import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { useSelector } from 'react-redux';
import SponsorCarousel from './SponsorCarousel';
import CountdownView from '../../common/components/CountdownView';
import HeaderImage from './HeaderImage';
import { firebaseFirestore } from '../../common/FirebaseApp';

/**
 * Component for home screen in main navigation
 * @param {Object} props Properties of the component: navigation, firebase
 */
const HomeScreen = () => {
  const userID = useSelector((state) => state.auth.uid);
  const [activeCountdown, setActiveCountDown] = useState(true);

  // Run on mount and when userID changes
  useEffect(() => {
    getDoc(doc(firebaseFirestore, 'configs', 'mobile-app')).then((document) => {
      setActiveCountDown(document.data().activeCountdown);
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
