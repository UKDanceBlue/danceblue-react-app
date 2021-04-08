// Import third-party dependencies
import React from 'react'
import {
  SafeAreaView,
  ScrollView
} from 'react-native'

import Carousel from '../../components/Carousel/carousel'
import HeaderImage from '../../components/countdown/HeaderImage'
import CountdownView from '../../components/countdown/CountdownView'
import Standings from '../../components/Standings/Standings'
import ScavengerHunt from '../../components/ScavengerHunt'

import { withFirebaseHOC } from '../../../config/Firebase'

export class ScoreboardScreen extends React.Component {
  render () {
    return (
      <ScrollView showsVerticalScrollIndicator>
        <SafeAreaView style={{ flex: 1 }}>
          <Standings isExpanded />
        </SafeAreaView>
      </ScrollView>
    )
  }
}

// Component for home screen in main navigation
class HomeScreen extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      activeCountdown: true,
      scavengerHunt: false
    }
  }

  componentDidMount() {
    this.props.firebase.getConfig().then(doc => {
      this.setState({ activeCountdown: doc.data().activeCountdown, scavengerHunt: doc.data().scavengerHunt })
    })
    this.props.firebase.checkAuthUser(user => {
      if (user !== null) {
        if (!user.isAnonymous) {
          this.setState({ userID: user.uid })
        }
      }
    })
  }

  render () {
    /* eslint-disable */
    const { navigate } = this.props.navigation

    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <SafeAreaView style={{ flex: 1 }}>
          <HeaderImage />
          {this.state.activeCountdown && (
            <CountdownView />
          )}
          {this.state.scavengerHunt && this.state.userID && (
            <ScavengerHunt userID={this.state.userID} />
          )}
          <Standings navigate={navigate} isExpandable={true} />
          <Carousel />
        </SafeAreaView>
      </ScrollView>
    )
  }
}

HomeScreen.navigationOptions = {
  title: 'Home'
}

export default withFirebaseHOC(HomeScreen)
