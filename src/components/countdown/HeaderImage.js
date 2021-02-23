import React from 'react'
import { View, ImageBackground, Image, StyleSheet } from 'react-native'
import backgroundImg from '../../../assets/home/db20_ribbon.jpg'
import dbLogo from '../../../assets/home/DB_Primary_Logo-01.png'

const HeaderImage = props => {
  return (
    <View style={styles.shadowsStyling}>
      <View style={styles.container}>
        <ImageBackground source={backgroundImg} style={styles.background}>
          <Image source={dbLogo} style={styles.logo} />
        </ImageBackground>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 15,
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
  },
  shadowsStyling: {
    width: '95%',
    height: 280,
    marginBottom: 10,
    shadowColor: 'gray',
    shadowOpacity: 0.5,
    shadowRadius: 6,
    shadowOffset: {
      height: 0,
      width: 0
    }
  }
})

export default HeaderImage
