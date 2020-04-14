// Import third-party dependencies
import React from "react";
import { SafeAreaView, StyleSheet, View, ScrollView, Text } from "react-native";

import Carousel from '../../components/Carousel/carousel' 
import HeaderImage from '../../components/countdown/HeaderImage';
import CountdownView from '../../components/countdown/CountdownView';
import Announcements from '../../components/announcement/Announcements';

// Component for home screen in main navigation
export class HomeScreen extends React.Component {
  static navigationOptions = {
    title: "Home"
  };

  render() {
    const { navigate } = this.props.navigation;
    
    return (
      <ScrollView>
        <SafeAreaView style={styles.container}>
          <HeaderImage />
          <CountdownView time={60}/>
          <Announcements />
          <Carousel />
        </SafeAreaView>
      </ScrollView>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "darkgray",
  },
});
