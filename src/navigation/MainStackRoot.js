// Import third-party dependencies
import React from "react";
import { StyleSheet } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { BlurView } from "expo-blur";

// Import first-party dependencies
import { ScoreboardScreen } from "./Home/Home";
import Event from "../common/components/event/Event";

const MainStack = createStackNavigator();

const MainStackRoot = () => {
  return (
    <MainStack.Navigator>
      <MainStack.Screen
        name="Tab"
        component={TabsScreen}
        options={{ headerShown: false }}
      />
      <MainStack.Screen name="Profile" component={ProfileScreen} />
      <MainStack.Screen
        name="FAQ"
        component={FAQScreen}
        initialParams={{
          uri: "https://www.danceblue.org/frequently-asked-questions/",
        }}
      />
      <MainStack.Screen
        name="Donate"
        component={DonateScreen}
        initialParams={{ uri: "https://danceblue.networkforgood.com" }}
      />
      <MainStack.Screen
        name="About"
        component={AboutScreen}
        initialParams={{ uri: "http://www.danceblue.org/about/" }}
      />
      <MainStack.Screen name="Scoreboard" component={ScoreboardScreen} />
      <MainStack.Screen
        name="Event"
        component={Event}
        options={({ route }) => ({
          title: route.params.name,
          headerTransparent: true,
          headerMode: "screen",
          headerBackground: () => (
            <BlurView
              tint="light"
              intensity={100}
              style={StyleSheet.absoluteFill}
            />
          ),
        })}
      />
    </MainStack.Navigator>
  );
};

export default MainStackRoot;
