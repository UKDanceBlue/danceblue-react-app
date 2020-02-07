// Import third-party dependencies
import React from "react";
import { Text, View } from "react-native";

// Component for events screen in main navigation
export class EventsScreen extends React.Component {
  static navigationOptions = {
    title: "Events"
  };
  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Events</Text>
      </View>
    );
  }
}
