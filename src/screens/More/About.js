// Import third-party dependencies
import React from 'react'
import { View } from 'react-native'
import { WebView } from 'react-native-webview'

/**
 * Component for "About" screen in more navigation
 * 
 * Basically just a webview that goes to {@link https://www.danceblue.org/about/ DanceBlue's website}
 * @param {Object} props Properties of the component: navigation, firebase
 * @author Kenton Carrier
 * @since 1.0.1
 * @class
 */
export class AboutScreen extends React.Component {
  /**
   * Called by React Native when rendering the screen
   * @returns A JSX formatted Component
   * @author Kenton Carrier
   * @since 1.0.1
   */
  render () {
    return (
      <View style={{ flex: 1 }}>
        <WebView source={{ uri: 'http://www.danceblue.org/about/' }} />
      </View>
    )
  }
}
