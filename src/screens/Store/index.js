// Import third-party dependencies
import React from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'
import { WebView } from 'react-native-webview'

const width = Dimensions.get('window').width // full width

/**
 * Component for "Store" screen in main navigation
 * 
 * Basically just a webview that goes to {@link https://www.danceblue.org/dancebluetique/ DanceBlue's website}
 * @param {Object} props Properties of the component: navigation, firebase
 * @author Kenton Carrier
 * @since 1.0.1
 * @class
 */
export class StoreScreen extends React.Component {
  /**
   * Called by React Native when rendering the screen
   * @returns A JSX formatted Component
   * @author Kenton Carrier
   * @since 1.0.1
   */
  render () {
    return (
      <View style={styles.viewPortContainer}>
        <WebView
          source={{ uri: 'http://www.danceblue.org/dancebluetique/' }}
          style={styles.webviewContainer}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  viewPortContainer: {
    flex: 1
  },
  webviewContainer: {
    flex: 1,
    width: width,
    borderWidth: 0
  }
})
