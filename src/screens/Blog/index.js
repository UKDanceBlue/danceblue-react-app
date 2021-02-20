// Import third-party dependencies
import React from 'react'
import { Text, View, StyleSheet, Dimensions } from 'react-native'
import { WebView } from 'react-native-webview'

const width = Dimensions.get('window').width // full width
const height = Dimensions.get('window').height // full height

// Component for profile screen in main navigation
export class BlogScreen extends React.Component {
  render () {
    return (
      <View style={styles.viewPortContainer}>
        <WebView
          source={{ uri: 'https://www.danceblue.org/blog/' }}
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
