// Import third-party dependencies
import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

// Component for profile screen in main navigation
export class DonateScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1}}>
        <WebView source={{ uri: "https://danceblue.networkforgood.com" }} />
      </View>
    );
  }
}
