import React from 'react'
import { View, ImageBackground, Image, StyleSheet } from 'react-native'

import { withFirebaseHOC } from '../../../config/Firebase'

import backgroundImg from '../../../assets/home/db20_ribbon.jpg'
import dbLogo from '../../../assets/home/DB_Primary_Logo-01.png'

/**
 * A header image container used on the home screen
 * @param {Object} props Properties of the component: firebase
 * @author Kenton Carrier
 * @since 1.0.1
 * @class
 */
class HeaderImage extends React.Component {
  constructor(props) {
    super(props)
  }

  /**
   * Called to generate a React Native component
   * @returns A JSX formatted component
   * @author Kenton Carrier
   * @since 1.0.1
   */
  render() {
    return (
      <View style={styles.container}>
        <ImageBackground source={backgroundImg} style={styles.background}>
          <Image source={dbLogo} style={styles.logo} />
        </ImageBackground>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    height: 280,
    width: '100%',
    justifyContent: 'center',
    alignSelf: 'center',
    overflow: 'hidden'
  },
  background: {
    flex: 3,
    width: '100%',
    height: '100%',
    resizeMode: 'contain'
  },
  logo: {
    flex: 1,
    height: null,
    width: null,
    resizeMode: 'contain',
    backgroundColor: '#FFFFFF99'
  }
})

export default withFirebaseHOC(HeaderImage)
