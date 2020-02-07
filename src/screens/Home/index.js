// Import third-party dependencies
import React from "react";
import { Text, View } from "react-native";

// Component for home screen in main navigation
export class HomeScreen extends React.Component {
  static navigationOptions = {
    title: "Home"
  };
  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Home</Text>
      </View>
    );
  }
}
