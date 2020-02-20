// Import third-party dependencies
import React from "react";
import { Text, View } from "react-native";

// Component for profile screen in main navigation
export class FAQScreen extends React.Component {
  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>FAQ</Text>
      </View>
    );
  }
}
