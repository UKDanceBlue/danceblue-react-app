import React from 'react'
import { View, ImageBackground, Image, StyleSheet } from 'react-native'

import { withFirebaseHOC } from '../../../config/Firebase'

import backgroundImg from '../../../assets/home/db20_ribbon.jpg'
import backgroundImgSH from '../../../assets/home/db20_ribbonSH.jpg'
import dbLogo from '../../../assets/home/DB_Primary_Logo-01.png'

/**
 * TODO
 * @param {Object} props Properties of the component: (TODO)
 * @returns A React Native component
 * @author Kenton Carrier
 * @since 1.0.1
 * @class
 */
class HeaderImage extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      scavengerHunt: this.props.scavengerHunt | false
    }
  }

  /**
   * Called immediately after a component is mounted. Setting state here will trigger re-rendering.
   */
  componentDidMount() {
    this.props.firebase.getConfig().then(doc => {
      this.setState({ scavengerHunt: doc.data().scavengerHunt })
    })
  }

  /**
   * Called to generate a React Native component
   * @returns A JSX formatted component
   */
  render() {
    return (
      <View style={styles.container}>
        <ImageBackground source={this.state.scavengerHunt ? backgroundImgSH : backgroundImg} style={styles.background}>
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
