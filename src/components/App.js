// Import third-party dependencies
import { registerRootComponent } from 'expo'
import React from 'react'
import { StatusBar, LogBox } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'

// Import Firebase Context Provider
import Firebase, { FirebaseProvider } from '../../config/Firebase'
import { RootStackScreen } from '../screens'

// Fix firestore error - can be removed if issue is resolved in package
import { decode, encode } from 'base-64'
if (!global.btoa) {
  global.btoa = encode
}
if (!global.atob) {
  global.atob = decode
}

LogBox.ignoreLogs(['Setting a timer'])

// Create container for app with navigations
const App = () => {
  return (
    <FirebaseProvider value={Firebase}>
      <StatusBar />
      <NavigationContainer>
        <RootStackScreen />
      </NavigationContainer>
    </FirebaseProvider>
  )
}

export default registerRootComponent(App)
