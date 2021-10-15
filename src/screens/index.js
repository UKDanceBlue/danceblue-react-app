import React from 'react'
import { StyleSheet, Dimensions, Image } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { BlurView } from 'expo-blur'

import { withFirebaseHOC } from '../../config/Firebase'

import HomeScreen from './Home'
import {ScoreboardScreen } from './Home'
import EventsScreen from './Events'
import { StoreScreen } from './Store'
import MoreScreen from './More'
import Event from '../components/event/Event'

// import ProfileScreen from './More/Profile'
import { FAQScreen } from './More/FAQ'
import { DonateScreen } from './More/Donate'
import { AboutScreen } from './More/About'
import ProfileScreen from './More/Profile'

import { SplashLoginScreen } from './Modals'

const RootStack = createStackNavigator()
const MainStack = createStackNavigator()
const Tabs = createBottomTabNavigator()

function TabsScreen () {
  return (
    <Tabs.Navigator
      screenOptions={
        ({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          const iconMap = new Map([ //Key: Screen   Value: Icon ID
            ['Home'], ['home'],
            ['Events'], ['calendar'],
            ['Store'], ['store'],
            ['More'], ['ellipsis-h'],
            ['Test'], ['ellipsis-h']
          ]);

          // You can return any component that you like here!
          return (
            <Icon
              name={iconMap.get(route.name)}
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
      <MainStack.Screen name='Profile' component={ProfileScreen} />
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

class RootStackScreen extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      userID: null,
      isLoading: true
    }
  }

  componentDidMount() {
    this.props.firebase.checkAuthUser(user => {
      if (user !== null) this.setState({ userID: user.uid, isLoading: false })
      else this.setState({ isLoading: false })
    })
  }

  render() {
    if (this.state.isLoading) return <Image style={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height }} source={require('../../assets/splash2.png')} />
    return (
      <RootStack.Navigator mode='modal'>
        {this.state.userID && (
          <RootStack.Screen name='Main' component={MainStackScreen} options={{ headerShown: false }} />
        )}
        {!this.state.userID && (
          <RootStack.Screen name='SplashLogin' component={SplashLoginScreen} options={{ headerShown: false }} />
        )}
      </RootStack.Navigator>
    )
  }
}

export default withFirebaseHOC(RootStackScreen)
