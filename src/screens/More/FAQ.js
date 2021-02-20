// Import third-party dependencies
import React from 'react'
import { View } from 'react-native'
import { WebView } from 'react-native-webview'

// Component for profile screen in main navigation
export class FAQScreen extends React.Component {
  render () {
    return (
      <View style={{ flex: 1 }}>
        <WebView source={{ uri: 'http://www.danceblue.org/frequently-asked-questions/' }} />
      </View>
    )
  }
}
