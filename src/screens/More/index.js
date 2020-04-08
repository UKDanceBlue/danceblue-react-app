// Import third-party dependencies
import React from "react";
import {
  View,
  Button,
  ImageBackground,
  TouchableHighlight,
  Text
} from "react-native";
import { createStackNavigator } from "@react-navigation/stack";

import ProfileScreen from "./Profile";
import { FAQScreen } from "./FAQ";

import { styles } from "../../styles";

const Stack = createStackNavigator();

const profileButtonImage = require("./Profile_Button.jpg");

class MoreScreenOptions extends React.Component {
  render() {
    const { navigate } = this.props.navigation;
    return (
      <>
        <TouchableHighlight
          onPress={() => {
            navigate("Profile");
          }}
          style={styles.button}
        >
          <ImageBackground
            source={profileButtonImage}
            style={{
              height: "100%",
              width: "100%",
              opacity: 50
            }}
            imageStyle={{ borderRadius: 10 }}
          >
            <View
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(0,0,0,0.5)"
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: 50
                }}
              >
                Profile
              </Text>
            </View>
          </ImageBackground>
        </TouchableHighlight>
      </>
    );
  }
}

// Component for "more" screen in main navigation
export class MoreScreen extends React.Component {
  static navigationOptions = {
    title: "More"
  };
  render() {
    const { navigate } = this.props.navigation;
    return (
      <Stack.Navigator>
        <Stack.Screen name="More Options" component={MoreScreenOptions} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="FAQ" component={FAQScreen} />
      </Stack.Navigator>
    );
  }
}
