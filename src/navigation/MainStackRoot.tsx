// Import third-party dependencies
import React from 'react';
import { StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { BlurView } from 'expo-blur';

// Import first-party dependencies
import { EventView } from '../screens/EventScreen';
import NotificationScreen from '../screens/NotificationScreen';
import ProfileScreen from '../screens/ProfileScreen';
import TabBar from './TabBar';
import HeaderIcons from './HeaderIcons';
import HourScreen from '../screens/HoursScreen/HourScreen';

const MainStack = createStackNavigator();

const MainStackRoot = () => (
  <MainStack.Navigator
    screenOptions={({ navigation }) => ({
      headerRight: ({ tintColor }) => <HeaderIcons navigation={navigation} color={tintColor} />,
      headerBackTitle: 'Back',
    })}
  >
    <MainStack.Screen name="Tab" options={{ headerShown: false }} component={TabBar} />
    <MainStack.Screen
      name="Notifications"
      component={NotificationScreen}
      options={{ headerRight: null }}
    />
    <MainStack.Screen name="Profile" component={ProfileScreen} options={{ headerRight: null }} />
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
    <MainStack.Screen name="Hour Details" component={HourScreen} />
  </MainStack.Navigator>
);

export default MainStackRoot;
