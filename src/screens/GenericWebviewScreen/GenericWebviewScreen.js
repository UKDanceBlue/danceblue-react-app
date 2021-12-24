// Import third-party dependencies
import React, { useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { globalStyles } from '../../theme';

/**
 * A simple screen wrapper for a webview
 * @param {Object} route The route used by the navigator to reach this screen, should include a defaultParam *uri* that will be displayed by the component
 */
const GenericWebviewScreen = ({ route }) => {
  const [isWebpageLoading, setIsWebpageLoading] = useState(true);

  let { uri } = route.params;
  if (!uri && uri !== '') {
    // If a uri is not given (and I don't mean blank) then send a 404 from DanceBlue's website
    uri = 'https://www.danceblue.org/404/';
  }

  return (
    <View style={globalStyles.genericView}>
      {isWebpageLoading && <ActivityIndicator />}
      <WebView source={{ uri }} onLoadEnd={() => setIsWebpageLoading(false)} />
    </View>
  );
};

export default GenericWebviewScreen;
