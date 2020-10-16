// Import third-party dependencies
import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import { Dimensions } from "react-native";

var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height

// Component for profile screen in main navigation
export class BlogScreen extends React.Component {
  render() {
    return (
      <View style={styles.viewPortContainer}>
            <WebView
                source={{ uri: "https://www.danceblue.org/blog/" }}
                style={styles.webviewContainer}
            />
      </View>
    );
  }
}

const styles = StyleSheet.create({
    viewPortContainer: {
        flex: 1
    },
    webviewContainer: {
        flex: 1,
        width: width,
        borderWidth: 0,
    }
});