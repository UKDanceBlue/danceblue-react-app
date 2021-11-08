// Import third-party dependencies
import React from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';
import Constants from 'expo-constants';

/**
 * A simple screen wrapper for a webview
 * @param {Object} props Properties of the component: navigation, uri
 * @author Tag Howard
 * @since 1.1.0
 * @class
 */
const GenericWebviewScreen = (props) => {
  let uri = props.route.params.uri;
  if(!uri && uri!="") {// If a uri is not given (and I don't mean blank) then send a 404 from DanceBlue's website
    uri = "https://www.danceblue.org/404/";
  }
  return (
    <View style={{ flex: 1 }}>
      <WebView source={{uri: uri}} />
    </View>
  );
}

export default GenericWebviewScreen;