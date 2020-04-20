// Import third-party dependencies
import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

// Component for profile screen in main navigation
export class FAQScreen extends React.Component {
  render() {
    // I'm really sorry, it's crunchtime and I know this is gross. Will fix later
    const myScript = `
      document.querySelector("header").style.display = "none"
      document.querySelector("#sliders-container").style.display = "none"
      document.querySelector(".fusion-footer").style.display = "none"
      document.querySelector("#main").style.paddingTop = "5px"
      document.querySelectorAll(".tab-link").forEach(tab => {
      tab.addEventListener("click", () => {
        setTimeout(() => document.querySelector("header").style.display = "none", 353)
      })
})
    `;

    return (
      <View style={{ flex: 1 }}>
        <WebView
          javaScriptEnabled={true}
          domStorageEnabled={true}
          source={{
            uri: "http://www.danceblue.org/frequently-asked-questions#content/"
          }}
          injectedJavaScript={myScript}
        />
      </View>
    );
  }
}
