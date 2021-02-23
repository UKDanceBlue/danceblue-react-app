// Import third-party dependencies
import React from 'react'
import {
  SafeAreaView,
  StyleSheet,
  ScrollView
} from 'react-native'

import Sponsors from '../../components/sponsor/Sponsors'
import HeaderImage from '../../components/countdown/HeaderImage'
import CountdownView from '../../components/countdown/CountdownView'
import Announcements from '../../components/announcement/Announcements'
import Standings from '../../components/Standings/Standings'

// Component for home screen in main navigation
export class HomeScreen extends React.Component {
  render () {
    /* eslint-disable */
    const { navigate } = this.props.navigation
    const countDownEnd = new Date('2021-04-10')
    const secondsToEnd = Math.floor(
      (countDownEnd.getTime() - Date.now()) / 1000
    )
    const eventName = '!! DanceBlue 2021 !!'

    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <SafeAreaView style={styles.container}>
          <HeaderImage />
          <CountdownView name={eventName} time={secondsToEnd} />
          <Announcements />
          <Standings />
          <Sponsors />
        </SafeAreaView>
      </ScrollView>
    )
  }
}

HomeScreen.navigationOptions = {
  title: 'Home'
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    marginTop: 5,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
