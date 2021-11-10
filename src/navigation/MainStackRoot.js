// Import third-party dependencies
import React from 'react';
import { StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { BlurView } from 'expo-blur';

// Import first-party dependencies
import ScoreboardScreen from '../screens/ScoreBoardScreen';
import { EventView } from '../screens/EventScreen';
import GenericWebviewScreen from '../screens/GenericWebviewScreen';
import ProfileScreen from '../screens/ProfileScreen';
import TabBar from './TabBar';

const MainStack = createStackNavigator();

const MainStackRoot = () => (
  <MainStack.Navigator>
    <MainStack.Screen name="Tab" component={TabBar} options={{ headerShown: false }} />
    <MainStack.Screen name="Profile" component={ProfileScreen} />
    <MainStack.Screen
      name="FAQ"
      component={GenericWebviewScreen}
      initialParams={{
        uri: 'https://www.danceblue.org/frequently-asked-questions/',
      }}
    />
    <MainStack.Screen
      name="Donate"
      component={GenericWebviewScreen}
      initialParams={{ uri: 'https://danceblue.networkforgood.com' }}
    />
    <MainStack.Screen
      name="About"
      component={GenericWebviewScreen}
      initialParams={{ uri: 'https://www.danceblue.org/about/' }}
    />
    <MainStack.Screen name="Scoreboard" component={ScoreboardScreen} />
    <MainStack.Screen
      name="Event"
      component={EventView}
      options={({ route }) => ({
        title: route.params.name,
        headerTransparent: true,
        headerMode: 'screen',
        headerBackground: () => (
          <BlurView tint="light" intensity={100} style={StyleSheet.absoluteFill} />
        ),
      })}
    />
  </MainStack.Navigator>
);

export default MainStackRoot;
