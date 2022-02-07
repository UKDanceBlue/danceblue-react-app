import React from 'react';
import { SafeAreaView, ScrollView } from 'react-native';
import { useAppSelector } from '../../common/CustomHooks';
import SponsorCarousel from './SponsorCarousel';
import CountdownView from '../../common/components/CountdownView';
import HeaderImage from './HeaderImage';

/**
 * Component for home screen in main navigation
 */
const HomeScreen = () => {
  const countdown = useAppSelector((state) => state.appConfig.countdown);
  const isConfigLoaded = useAppSelector((state) => state.appConfig.isConfigLoaded);

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
