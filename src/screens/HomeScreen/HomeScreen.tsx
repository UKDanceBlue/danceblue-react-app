import React from 'react';
import { Linking, SafeAreaView, ScrollView } from 'react-native';
import { useAppSelector } from '../../common/CustomHooks';
import SponsorCarousel from './SponsorCarousel';
import CountdownView from '../../common/components/CountdownView';
import HeaderImage from './HeaderImage';
import { Button } from 'react-native-elements';

/**
 * Component for home screen in main navigation
 * @param {Object} props Properties of the component: navigation, firebase
 */
const HomeScreen = () => {
  const countdown = useAppSelector((state) => state.appConfig.countdown);
  const isConfigLoaded = useAppSelector((state) => state.appConfig.isConfigLoaded);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <HeaderImage />
      {isConfigLoaded && countdown && <CountdownView />}
      <Button
        style={{ margin: 10, alignSelf: 'center' }}
        onPress={() => {
          if (
            Linking.canOpenURL(
              'https://danceblue.networkforgood.com/causes/4789-danceblue-golden-matrix-fund-dance-teams?utm_source=website&utm_medium=unit_website'
            )
          ) {
            Linking.openURL(
              'https://danceblue.networkforgood.com/causes/4789-danceblue-golden-matrix-fund-dance-teams?utm_source=website&utm_medium=unit_website'
            );
          }
        }}
        title="Donate!"
      />
      <SponsorCarousel />
    </SafeAreaView>
  );
};

HomeScreen.navigationOptions = {
  title: 'Home',
};

export default HomeScreen;
