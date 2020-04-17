// Import third-party dependencies
import React from "react";
import {
  View,
  ImageBackground,
  TouchableHighlight,
  Text,
  SafeAreaView
} from "react-native";
import * as WebBrowser from 'expo-web-browser';
import { createStackNavigator } from "@react-navigation/stack";

import ProfileScreen from "./Profile";
import { FAQScreen } from "./FAQ";
import { DonateScreen } from "./Donate";
import { ContactScreen } from "./Contact";

import { styles } from "../../styles";

const Stack = createStackNavigator();

const profileButtonImage = require("./Profile_Button.jpg");
const donateButtonImage = require("./Donate_Button.jpg");
const faqsButtonImage = require("./FAQs_Button.jpg");
const contactButtonImage = require("./Contact_Button.jpg");

class MoreScreenOptions extends React.Component {
  render() {
    const { navigate } = this.props.navigation;
    return (
      <>
      <SafeAreaView style={{flex: 1}}>
        <TouchableHighlight
          onPress={() => {
            navigate("Profile");
          }}
          style={styles.button}
        >
          <ImageBackground
            source={profileButtonImage}
            style={styles.img}
            imageStyle={{ borderRadius: 10 }}
          >
            <View style={styles.view}>
              <Text style={styles.text}>
                Profile
              </Text>
            </View>
          </ImageBackground>
        </TouchableHighlight>
        <TouchableHighlight
        onPress={() => {
          navigate("Donate");
        }}
          style={styles.button}
        >
          <ImageBackground
            source={donateButtonImage}
            style={styles.img}
            imageStyle={{ borderRadius: 10 }}
          >
            <View style={styles.view}>
              <Text style={styles.text}>
                Donate
              </Text>
            </View>
          </ImageBackground>
        </TouchableHighlight>
        <TouchableHighlight
        onPress={() => {
          navigate("FAQ");
        }}
          style={styles.button}
        >
          <ImageBackground
            source={faqsButtonImage}
            style={styles.img}
            imageStyle={{ borderRadius: 10 }}
          >
            <View style={styles.view}>
              <Text style={styles.text}>
                FAQs
              </Text>
            </View>
          </ImageBackground>
        </TouchableHighlight>
        <TouchableHighlight
        onPress={() => {
          navigate("Contact");
        }}
          style={styles.button}
        >
          <ImageBackground
            source={contactButtonImage}
            style={styles.img}
            imageStyle={{ borderRadius: 10 }}
          >
            <View style={styles.view}>
              <Text style={styles.text}>
                Contact
              </Text>
            </View>
          </ImageBackground>
        </TouchableHighlight>
        </SafeAreaView>
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
        <Stack.Screen name="Donate" component={DonateScreen} />
        <Stack.Screen name="Contact" component={ContactScreen} />
      </Stack.Navigator>
    );
  }
}
