import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Icon from 'react-native-vector-icons/FontAwesome5'

import { HomeScreen } from './Home'
import { EventsScreen } from './Events'
import { BlogScreen } from './Blog'
import { MoreScreen } from './More'

// import ProfileScreen from './More/Profile'
import { FAQScreen } from './More/FAQ'
import { DonateScreen } from './More/Donate'
import { ContactScreen } from './More/Contact'

import Standings from '../components/Standings/Standings'

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
          } else if (route.name === 'Blog') {
            iconName = 'blog'
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
      <Tabs.Screen name='Blog' component={BlogScreen} />
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
      <MainStack.Screen name='Contact' component={ContactScreen} />
      <MainStack.Screen name='Scoreboard' component={Standings} />
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
