// Import third-party dependencies
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome5';

// Import first-party dependencies
import HomeScreen from '../screens/HomeScreen';
import EventScreen from '../screens/EventScreen';
import GenericWebviewScreen from '../screens/GenericWebviewScreen';
import MoreScreen from '../screens/More';

const Tabs = createBottomTabNavigator();

const TabBar = () => (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          const iconMap = {
            // Key: Screen   Value: Icon ID
            Home: 'home',
            Events: 'calendar',
            Store: 'store',
            More: 'ellipsis-h',
          };

          // You can return any component that you like here!
          return (
            <Icon
              name={iconMap[route.name]}
              size={size}
              color={color}
              style={{ textAlignVertical: 'center' }}
            />
          );
        },
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
      <Tabs.Screen
        name="Store"
        component={GenericWebviewScreen}
        initialParams={{ uri: 'https://www.danceblue.org/dancebluetique/' }}
      />
      <Tabs.Screen name="More" component={MoreScreen} />
    </Tabs.Navigator>
  );

export default TabBar;
