// Import third-party dependencies
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome5 } from '@expo/vector-icons';

// Import first-party dependencies
import ScoreboardScreen from '../screens/ScoreBoardScreen';
import HomeScreen from '../screens/HomeScreen';
import EventScreen from '../screens/EventScreen';
import GenericWebviewScreen from '../screens/GenericWebviewScreen';
import MoreScreen from '../screens/More';
import HeaderIcons from './HeaderIcons';

const Tabs = createBottomTabNavigator();

const TabBar = () => (
  <Tabs.Navigator
    screenOptions={({ route, navigation }) => ({
      tabBarIcon: ({ color, size }) => {
        const iconMap = {
          // Key: Screen   Value: Icon ID
          Home: 'home',
          Events: 'calendar',
          Store: 'store',
          More: 'ellipsis-h',
          Scoreboard: 'list-ol',
        };

        // You can return any component that you like here!
        return (
          <FontAwesome5
            name={iconMap[route.name]}
            size={size}
            color={color}
            style={{ textAlignVertical: 'center' }}
          />
        );
      },
      headerRight: ({ tintColor }) => <HeaderIcons navigation={navigation} color={tintColor} />,
      tabBarActiveTintColor: 'white',
      tabBarActiveBackgroundColor: '#3248a8',
      tabBarStyle: [
        {
          display: 'flex',
        },
        null,
      ],
    })}
  >
    <Tabs.Screen name="Home" component={HomeScreen} />
    <Tabs.Screen name="Events" component={EventScreen} />
    <Tabs.Screen name="Scoreboard" component={ScoreboardScreen} />
    <Tabs.Screen
      name="Store"
      component={GenericWebviewScreen}
      initialParams={{ uri: 'https://www.danceblue.org/dancebluetique/' }}
    />
    <Tabs.Screen name="More" component={MoreScreen} />
  </Tabs.Navigator>
);

export default TabBar;
