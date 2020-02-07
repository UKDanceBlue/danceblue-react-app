// Import third-party dependencies
import React from "react";
import { Text, View } from "react-native";

// Component for "more" screen in main navigation
export class MoreScreen extends React.Component {
  static navigationOptions = {
    title: "More"
  };
  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>More</Text>
      </View>
    );
  }
}
