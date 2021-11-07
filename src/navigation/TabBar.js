// Import third-party dependencies
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/FontAwesome5";

// Import first-party dependencies
import HomeScreen from "./Home/Home";
import EventsScreen from "./Events/Events";
import { StoreScreen } from "./Store";
import MoreScreen from "./More";

const TabBar = createBottomTabNavigator();
function TabsScreen() {
  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          const iconMap = {
            //Key: Screen   Value: Icon ID
            Home: "home",
            Events: "calendar",
            Store: "store",
            More: "ellipsis-h",
          };

          // You can return any component that you like here!
          return (
            <Icon
              name={iconMap[route.name]}
              size={size}
              color={color}
              style={{ textAlignVertical: "center" }}
            />
          );
        },
        tabBarActiveTintColor: "white",
        tabBarActiveBackgroundColor: "#3248a8",
        tabBarStyle: [
          {
            display: "flex",
          },
          null,
        ],
      })}
    >
      <Tabs.Screen name="Home" component={HomeScreen} />
      <Tabs.Screen name="Events" component={EventsScreen} />
      <Tabs.Screen
        name="Store"
        component={StoreScreen}
        initialParams={{ uri: "http://www.danceblue.org/dancebluetique/" }}
      />
      <Tabs.Screen name="More" component={MoreScreen} />
    </Tabs.Navigator>
  );
}

export default TabBar