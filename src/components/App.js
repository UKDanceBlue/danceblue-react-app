// Import third-party dependencies
import React from "react";
import { createAppContainer } from "react-navigation";
import { createBottomTabNavigator } from "react-navigation-tabs";

// Import font awesome icons
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faEllipsisH,
  faHome,
  faCalendarDay,
  faBlog
} from "@fortawesome/free-solid-svg-icons";

// Import screens for navigation
import { HomeScreen } from "../screens/Home";
import { EventsScreen } from "../screens/Events";
import { BlogScreen } from "../screens/Blog";
import { MoreScreen } from "../screens/More";

// Bottom tab navigator config
const MainNavigator = createBottomTabNavigator(
  {
    Home: {
      screen: HomeScreen,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <FontAwesomeIcon icon={faHome} color={tintColor} />
        )
      }
    },
    Events: {
      screen: EventsScreen,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <FontAwesomeIcon icon={faCalendarDay} color={tintColor} />
        )
      }
    },
    Blog: {
      screen: BlogScreen,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <FontAwesomeIcon icon={faBlog} color={tintColor} />
        )
      }
    },
    More: {
      screen: MoreScreen,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <FontAwesomeIcon icon={faEllipsisH} color={tintColor} />
        )
      }
    }
  },
  {
    tabBarOptions: {
      activeTintColor: "white",
      activeBackgroundColor: "#3248a8"
    }
  }
);

// Create container for app with navigations
const App = createAppContainer(MainNavigator);

export default App;
