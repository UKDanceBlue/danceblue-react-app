// Import third-party dependencies
import { registerRootComponent } from "expo";
import React from "react";
import { StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// Import font awesome icons
import Icon from "react-native-vector-icons/FontAwesome5";

// Import screens for navigation
import { HomeScreen } from "../screens/Home";
import { EventsScreen } from "../screens/Events";
import { BlogScreen } from "../screens/Blog";
import { MoreScreen } from "../screens/More";

// Bottom tab navigator config
const Tab = createBottomTabNavigator();

// Create container for app with navigations
const App = () => {
  return (
    <>
    <StatusBar barStyle={"dark-content"} />
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === "Home") {
              iconName = "home";
            } else if (route.name === "Events") {
              iconName = "calendar";
            } else if (route.name === "Blog") {
              iconName = "blog";
            } else if (route.name === "More") {
              iconName = "ellipsis-h";
            }

            // You can return any component that you like here!
            return (
              <Icon
                name={iconName}
                size={size}
                color={color}
                style={{ textAlignVertical: "center" }}
              />
            );
          }
        })}
        tabBarOptions={{
          activeTintColor: "white",
          activeBackgroundColor: "#3248a8"
        }}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Events" component={EventsScreen} />
        <Tab.Screen name="Blog" component={BlogScreen} />
        <Tab.Screen name="More" component={MoreScreen} />
      </Tab.Navigator>
    </NavigationContainer>
    </>
  );
};

export default registerRootComponent(App);
