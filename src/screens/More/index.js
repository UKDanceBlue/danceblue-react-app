// Import third-party dependencies
import React from "react";
import { Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/core";
import { createStackNavigator } from "@react-navigation/stack";

import { ProfileScreen } from "../Profile";

const MoreNavigator = createStackNavigator();

// Component for "more" screen in main navigation
export class MoreScreen extends React.Component {
  static navigationOptions = {
    title: "More"
  };
  render() {
    const { navigate } = this.props.navigation;
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Profile" component={ProfileScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
