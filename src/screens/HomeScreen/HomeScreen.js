import React from 'react';
import { SafeAreaView, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import SponsorCarousel from './SponsorCarousel';
import CountdownView from '../../common/components/CountdownView';
import HeaderImage from './HeaderImage';

/**
 * Component for home screen in main navigation
 * @param {Object} props Properties of the component: navigation, firebase
 */
const HomeScreen = () => {
  const countdown = useSelector((state) => state.appConfig.countdown);
  const isConfigLoaded = useSelector((state) => state.appConfig.isConfigLoaded);

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <SafeAreaView style={{ flex: 1 }}>
        <HeaderImage />
        {isConfigLoaded && countdown && <CountdownView />}
        <SponsorCarousel />
      </SafeAreaView>
    </ScrollView>
  );
};

HomeScreen.navigationOptions = {
  title: 'Home',
};

export default HomeScreen;
