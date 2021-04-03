import React from 'react'
import { StyleSheet } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { BlurView } from 'expo-blur'

import { HomeScreen, ScoreboardScreen } from './Home'
import EventsScreen from './Events'
import { StoreScreen } from './Store'
import { MoreScreen } from './More'
import Event from '../components/event/Event'

// import ProfileScreen from './More/Profile'
import { FAQScreen } from './More/FAQ'
import { DonateScreen } from './More/Donate'
import { AboutScreen } from './More/About'

const RootStack = createStackNavigator()
const MainStack = createStackNavigator()
const Tabs = createBottomTabNavigator()

function TabsScreen () {
  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName

          if (route.name === 'Home') {
            iconName = 'home'
          } else if (route.name === 'Events') {
            iconName = 'calendar'
          } else if (route.name === 'Store') {
            iconName = 'store'
          } else if (route.name === 'More') {
            iconName = 'ellipsis-h'
          }

          // You can return any component that you like here!
          return (
            <Icon
              name={iconName}
              size={size}
              color={color}
              style={{ textAlignVertical: 'center' }}
            />
          )
        }
      })}
      tabBarOptions={{
        activeTintColor: 'white',
        activeBackgroundColor: '#3248a8'
      }}
    >
      <Tabs.Screen name='Home' component={HomeScreen} />
      <Tabs.Screen name='Events' component={EventsScreen} />
      <Tabs.Screen name='Store' component={StoreScreen} />
      <Tabs.Screen name='More' component={MoreScreen} />
    </Tabs.Navigator>
  )
}

function MainStackScreen () {
  return (
    <MainStack.Navigator>
      <MainStack.Screen name='Tab' component={TabsScreen} options={{ headerShown: false }} />
      <MainStack.Screen name='FAQ' component={FAQScreen} />
      <MainStack.Screen name='Donate' component={DonateScreen} />
      <MainStack.Screen name='About' component={AboutScreen} />
      <MainStack.Screen name='Scoreboard' component={ScoreboardScreen} />
      <MainStack.Screen
        name='Event' component={Event} options={({ route }) => ({
          title: route.params.name,
          headerTransparent: true,
          headerMode: 'screen',
          headerBackground: () => (
            <BlurView tint='light' intensity={100} style={StyleSheet.absoluteFill} />
          )
        })}
      />
    </MainStack.Navigator>
  )
}

export function RootStackScreen () {
  return (
    <RootStack.Navigator mode='modal'>
      <RootStack.Screen name='Main' component={MainStackScreen} options={{ headerShown: false }} />
    </RootStack.Navigator>
  )
}
