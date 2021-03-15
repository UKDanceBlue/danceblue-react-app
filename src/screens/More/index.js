// Import third-party dependencies
import React from 'react'
import {
  View,
  ImageBackground,
  TouchableHighlight,
  Text,
  SafeAreaView
} from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'

import ProfileScreen from './Profile'
import { FAQScreen } from './FAQ'
import { DonateScreen } from './Donate'
import { ContactScreen } from './Contact'

import { styles } from '../../styles'

const Stack = createStackNavigator()

const profileButtonImage = require('./Profile_Button.jpg')
const donateButtonImage = require('./Donate_Button.jpg')
const faqsButtonImage = require('./FAQs_Button.jpg')
const contactButtonImage = require('./Contact_Button.jpg')

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
                  {`Profile\nComing Soon!`}
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
          <TouchableHighlight
            onPress={() => {
              navigate('Contact')
            }}
            style={styles.button}
          >
            <ImageBackground
              source={contactButtonImage}
              style={styles.img}
              imageStyle={{ borderRadius: 10 }}
            >
              <View style={styles.view}>
                <Text style={styles.text}>
                  Contact
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
