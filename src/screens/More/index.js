// Import third-party dependencies
import React from 'react';
import { View, ImageBackground, TouchableHighlight, Text, SafeAreaView } from 'react-native';

import { styles } from '../../styles';

const profileButtonImage = require('../../../assets/more/Profile_Button.jpg');
const donateButtonImage = require('../../../assets/more/Donate_Button.jpg');
const faqsButtonImage = require('../../../assets/more/FAQs_Button.jpg');
const aboutButtonImage = require('../../../assets/more/About_Button.jpg');

/**
 * Component for "More" screen in main navigation
 * @param {Object} props Properties of the component: navigation, firebase
 * @class
 * @deprecated I want to at least redesign this, but ideally this whole screen will be gone
 */
class MoreScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  /**
   * Called immediately after a component is mounted. Setting state here will trigger re-rendering.
   */
  componentDidMount() {}

  /**
   * Called by React Native when rendering the screen
   * @returns A JSX formatted Component
   */
  render() {
    const { navigate } = this.props.navigation;
    return (
      <>
        <SafeAreaView style={{ flex: 1 }}>
          <TouchableHighlight
            style={styles.button}
            onPress={() => {
              navigate('Profile');
            }}
          >
            <ImageBackground
              source={profileButtonImage}
              style={styles.img}
              imageStyle={{ borderRadius: 10 }}
            >
              <View style={styles.view}>
                <Text style={styles.text}>Profile</Text>
              </View>
            </ImageBackground>
          </TouchableHighlight>
          <TouchableHighlight
            onPress={() => {
              navigate('About');
            }}
            style={styles.button}
          >
            <ImageBackground
              source={aboutButtonImage}
              style={styles.img}
              imageStyle={{ borderRadius: 10 }}
            >
              <View style={styles.view}>
                <Text style={styles.text}>About Us</Text>
              </View>
            </ImageBackground>
          </TouchableHighlight>
          <TouchableHighlight
            onPress={() => {
              navigate('Donate');
            }}
            style={styles.button}
          >
            <ImageBackground
              source={donateButtonImage}
              style={styles.img}
              imageStyle={{ borderRadius: 10 }}
            >
              <View style={styles.view}>
                <Text style={styles.text}>Donate</Text>
              </View>
            </ImageBackground>
          </TouchableHighlight>
          <TouchableHighlight
            onPress={() => {
              navigate('FAQ');
            }}
            style={styles.button}
          >
            <ImageBackground
              source={faqsButtonImage}
              style={styles.img}
              imageStyle={{ borderRadius: 10 }}
            >
              <View style={styles.view}>
                <Text style={styles.text}>FAQs</Text>
              </View>
            </ImageBackground>
          </TouchableHighlight>
        </SafeAreaView>
      </>
    );
  }
}

MoreScreen.navigationOptions = {
  title: 'More',
};

export default MoreScreen;
