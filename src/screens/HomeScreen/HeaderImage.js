import React from 'react';
import { View, ImageBackground, Image, StyleSheet } from 'react-native';
import { globalStyles } from '../../theme';

const backgroundImg = require('../../../assets/home/db20_ribbon.jpg');
const dbLogo = require('../../../assets/home/DB_Primary_Logo-01.png');

/**
 * A header image container used on the home screen
 */
const HeaderImage = () => (
  <View style={localStyles.headerContainer}>
    <ImageBackground source={backgroundImg} style={globalStyles.genericBackgroundImage}>
      <Image source={dbLogo} style={localStyles.dbLogo} />
    </ImageBackground>
  </View>
);

const localStyles = {
  headerContainer: StyleSheet.compose(globalStyles.genericView, {
    height: 280,
    width: '100%',
    alignSelf: 'center',
    overflow: 'hidden',
  }),
  dbLogo: StyleSheet.compose(globalStyles.genericIcon, { backgroundColor: '#FFFFFF99' }),
};

export default HeaderImage;
