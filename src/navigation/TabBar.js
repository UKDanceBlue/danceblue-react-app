// Import third-party dependencies
import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome5 } from '@expo/vector-icons';

// Import first-party dependencies
import { useSelector } from 'react-redux';
import ScoreboardScreen from '../screens/ScoreBoardScreen';
import HomeScreen from '../screens/HomeScreen';
import EventScreen from '../screens/EventScreen';
import GenericWebviewScreen from '../screens/GenericWebviewScreen';
import TeamScreen from '../screens/TeamScreen';
import HoursScreen from '../screens/HoursScreen';
import HeaderIcons from './HeaderIcons';

const Tabs = createBottomTabNavigator();

const possibleTabs = {
  Events: <Tabs.Screen key="Events" name="Events" component={EventScreen} />,
  Scoreboard: <Tabs.Screen key="Scoreboard" name="Scoreboard" component={ScoreboardScreen} />,
  Team: <Tabs.Screen key="Team" name="Team" component={TeamScreen} />,
  MarathonHours: <Tabs.Screen key="HoursScreen" name="Marathon" component={HoursScreen} />,
  Store: (
    <Tabs.Screen
      key="Store"
      name="Store"
      component={GenericWebviewScreen}
      initialParams={{
        uri: 'https://www.danceblue.org/dancebluetique/',
      }}
    />
  ),
  Donate: (
    <Tabs.Screen
      key="Donate"
      name="Donate"
      component={GenericWebviewScreen}
      initialParams={{
        uri: 'https://danceblue.networkforgood.com/causes/4789-danceblue-golden-matrix-fund-dance-teams?utm_source=website&utm_medium=unit_website',
      }}
    />
  ),
};

const TabBar = () => {
  const isConfigLoaded = useSelector((state) => state.appConfig.isConfigLoaded);
  const configuredTabs = useSelector((state) => state.appConfig.configuredTabs);

  const [currentTabs, setCurrentTabs] = useState([]);

  useEffect(() => {
    if (isConfigLoaded) {
      const tempCurrentTabs = [];
      for (let i = 0; i < configuredTabs.length; i++) {
        if (possibleTabs[configuredTabs[i]]) {
          tempCurrentTabs.push(possibleTabs[configuredTabs[i]]);
        }
      }
      setCurrentTabs(tempCurrentTabs);
    }
  }, [configuredTabs, isConfigLoaded]);

  return (
    <>
      {isConfigLoaded && (
        <Tabs.Navigator
          screenOptions={({ route, navigation }) => ({
            tabBarIcon: ({ color, size }) => {
              const iconMap = {
                // https://icons.expo.fyi/
                // Key: Screen   Value: Icon ID
                Home: 'home',
                Events: 'calendar',
                Store: 'store',
                More: 'ellipsis-h',
                Scoreboard: 'list-ol',
                Team: 'users',
                Donate: 'hand-holding-heart',
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
            headerRight: ({ tintColor }) => (
              <HeaderIcons navigation={navigation} color={tintColor} />
            ),
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
          <Tabs.Screen key="HoursScreen" name="Marathon" component={HoursScreen} />
          {currentTabs}
        </Tabs.Navigator>
      )}
    </>
  );
};

export default TabBar;
