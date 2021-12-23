// Import third-party dependencies
import React from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';

/**
 * A simple screen wrapper for a webview
 * @param {Object} route The route used by the navigator to reach this screen, should include a defaultParam *uri* that will be displayed by the component
 */
const GenericWebviewScreen = ({ route }) => {
  // Is this a default case from react navigation deep linking?
  if (route.path) {
    console.log(
      <View style={{ flex: 1 }}>
        <WebView source={{ uri: `https://www.danceblue.org${route.path}` }} />
      </View>
    );
    return (
      <View style={{ flex: 1 }}>
        <WebView source={{ uri: `https://www.danceblue.org${route.path}` }} />
      </View>
    );
  }
  // Is this component being rendered by a navigator?
  if (route?.params?.uri) {
    return (
      <View style={{ flex: 1 }}>
        <WebView source={route.params} />
      </View>
    );
  }
  // Fallback to 404
  return (
    <View style={{ flex: 1 }}>
      <WebView source={{ uri: 'https://www.danceblue.org/404/' }} />
    </View>
  );
};

export default GenericWebviewScreen;
