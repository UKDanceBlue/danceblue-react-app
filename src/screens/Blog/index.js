// Import third-party dependencies
import React from "react";
import { Text, View } from "react-native";

// Component for blogs screen in main navigation
export class BlogScreen extends React.Component {
  static navigationOptions = {
    title: "Blog"
  };
  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Blog</Text>
      </View>
    );
  }
}
