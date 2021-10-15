// Import third-party dependencies
import React from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'
import { WebView } from 'react-native-webview'

const width = Dimensions.get('window').width // full width

// Component for profile screen in main navigation
export class StoreScreen extends React.Component {
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
