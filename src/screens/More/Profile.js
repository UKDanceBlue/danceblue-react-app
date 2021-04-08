// Import third-party dependencies
import React from 'react'
import { View, StyleSheet, Image, ActivityIndicator } from 'react-native'
import { Text, Button } from 'react-native-elements'

import SignUpForm from '../../components/SignUpForm'
import LoginForm from '../../components/LoginForm'

import Badges from '../../components/Badges'

import avatar from '../../../assets/avatar.png'

import { withFirebaseHOC } from '../../../config/Firebase'

// Component for profile screen in main navigation
class ProfileScreen extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      loggedIn: false,
      user: undefined,
      formShown: 'login',
      isLoading: true
    }

    this.handleSignOut = this.handleSignOut.bind(this)
  }

  componentDidMount () {
    this.props.firebase.checkAuthUser(user => {
      if (!user.isAnonymous) {
        let userID = user.uid
        this.props.firebase.getUser(userID).then(doc => {
          let userData = doc.data()
          this.setState({ loggedIn: true, user: {id: user.uid, ...userData}, isLoading: false })
        })
      }
    })
  }

  handleSignOut () {
    this.props.firebase.signOut().then(() => {
      this.setState({ loggedIn: false, user: undefined })
    })
  }

  render () {
    /* eslint-disable */
    const { navigate } = this.props.navigation

    return (
      <View style={styles.container}>
        <>
          {this.state.isLoading && (
            <ActivityIndicator style={styles.image} size='large' color='blue' />
          )}
          {!this.state.isLoading && (
            <>
              {this.state.loggedIn && (
                <>
                  <View style={styles.header}>
                    <Image style={styles.avatar} source={avatar} />
                    <View style={styles.headerText}>
                      <Text h4>{this.state.user.name}</Text>
                    </View>
                  </View>
                  <View style={styles.badges}>
                    <View style={styles.sectionTitleView}>
                      <Text style={styles.sectionTitle}>Badges</Text>
                    </View>
                    <Badges userID={this.state.user.id} />
                  </View>
                  <View style={styles.footer}>
                    <Button title='Signout' onPress={this.handleSignOut} type='clear' />
                  </View>
                </>
              )}
              {!this.state.loggedIn && (
                <>
                  {this.state.formShown === 'signup' ? (
                    <>
                      <Text h2 style={{ textAlign: 'center' }}>
                        Sign Up
                      </Text>
                      <SignUpForm />
                    </>
                  ) : (
                    <>
                      <Text h2 style={{ textAlign: 'center' }}>
                        Login
                      </Text>
                      <LoginForm />
                    </>
                  )}
                </>
              )}
            </>
          )}
        </>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  headerText: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badges: {
    flex: 5,
  },
  avatar: {
    flex: 1,
    height: 100,
    width: 100,
    resizeMode: 'contain',
    paddingLeft: 50
  },
  footer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  sectionTitleView: {
    borderBottomColor: '#0033A0',
    borderBottomWidth: 1,
    textAlign: 'center'
  },
  container: {
    overflow: 'hidden',
    padding: 10,
    flex: 1
  },
})

export default withFirebaseHOC(ProfileScreen)
