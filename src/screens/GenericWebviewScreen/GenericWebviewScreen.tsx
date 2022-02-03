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
  // Is this a default case from react navigation deep linking?
  if (route.path) {
    return (
      <View style={globalStyles.genericView}>
        {isWebpageLoading && <ActivityIndicator />}
        <WebView
          source={{ uri: `https://www.danceblue.org${route.path}` }}
          onLoadEnd={() => setIsWebpageLoading(false)}
        />
      </View>
    );
  }
  // Is this component being rendered by a navigator?
  if (route?.params?.uri) {
    return (
      <View style={globalStyles.genericView}>
        {isWebpageLoading && <ActivityIndicator />}
        <WebView source={route.params} onLoadEnd={() => setIsWebpageLoading(false)} />
      </View>
    );
  }
  // Fallback to 404
  return (
    <View style={globalStyles.genericView}>
      {isWebpageLoading && <ActivityIndicator />}
      <WebView
        source={{ uri: 'https://www.danceblue.org/404/' }}
        onLoadEnd={() => setIsWebpageLoading(false)}
      />
    </View>
  );
};

export default GenericWebviewScreen;
