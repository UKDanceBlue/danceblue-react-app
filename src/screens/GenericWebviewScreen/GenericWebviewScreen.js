// Import third-party dependencies
import React from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';
import Constants from 'expo-constants';

/**
 * A simple screen wrapper for a webview
 * @param {Object} route The route used by the navigator to reach this screen, should include a defaultParam *uri* that will be displayed by the component
 */
const GenericWebviewScreen = ({ route }) => {
  let { uri } = route.params;
  if (!uri && uri != '') {
    // If a uri is not given (and I don't mean blank) then send a 404 from DanceBlue's website
    uri = 'https://www.danceblue.org/404/';
  }
  return (
    <View style={{ flex: 1 }}>
      <WebView source={{ uri }} />
    </View>
  );
};

export default GenericWebviewScreen;
