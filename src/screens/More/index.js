// Import third-party dependencies
import React from 'react'
import {
  View,
  ImageBackground,
  TouchableHighlight,
  Text,
  SafeAreaView
} from 'react-native'

import { styles } from '../../styles'

const profileButtonImage = require('./Profile_Button.jpg')
const donateButtonImage = require('./Donate_Button.jpg')
const faqsButtonImage = require('./FAQs_Button.jpg')
const aboutButtonImage = require('./About_Button.jpg')

// Component for "more" screen in main navigation
export class MoreScreen extends React.Component {
  render () {
    const { navigate } = this.props.navigation
    return (
      <>
        <SafeAreaView style={{ flex: 1 }}>
          <TouchableHighlight
            style={styles.button}
          >
            <ImageBackground
              source={profileButtonImage}
              style={styles.img}
              imageStyle={{ borderRadius: 10 }}
            >
              <View style={styles.view}>
                <Text style={styles.text}>
                  {'Profile\nComing Soon!'}
                </Text>
              </View>
            </ImageBackground>
          </TouchableHighlight>
          <TouchableHighlight
            onPress={() => {
              navigate('About')
            }}
            style={styles.button}
          >
            <ImageBackground
              source={aboutButtonImage}
              style={styles.img}
              imageStyle={{ borderRadius: 10 }}
            >
              <View style={styles.view}>
                <Text style={styles.text}>
                  About Us
                </Text>
              </View>
            </ImageBackground>
          </TouchableHighlight>
          <TouchableHighlight
            onPress={() => {
              navigate('Donate')
            }}
            style={styles.button}
          >
            <ImageBackground
              source={donateButtonImage}
              style={styles.img}
              imageStyle={{ borderRadius: 10 }}
            >
              <View style={styles.view}>
                <Text style={styles.text}>
                  Donate
                </Text>
              </View>
            </ImageBackground>
          </TouchableHighlight>
          <TouchableHighlight
            onPress={() => {
              navigate('FAQ')
            }}
            style={styles.button}
          >
            <ImageBackground
              source={faqsButtonImage}
              style={styles.img}
              imageStyle={{ borderRadius: 10 }}
            >
              <View style={styles.view}>
                <Text style={styles.text}>
                  FAQs
                </Text>
              </View>
            </ImageBackground>
          </TouchableHighlight>
        </SafeAreaView>
      </>
    )
  }
}

MoreScreen.navigationOptions = {
  title: 'More'
}
