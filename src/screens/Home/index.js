// Import third-party dependencies
import React from "react";
import { SafeAreaView, StyleSheet, View, ScrollView, Text, StatusBar } from "react-native";
import { Header } from 'react-native-elements';

import Carousel from '../../components/Carousel/carousel';
import HeaderImage from '../../components/countdown/HeaderImage';
import CountdownView from '../../components/countdown/CountdownView';
import Announcements from '../../components/announcement/Announcements';
import Standings from '../../components/Standings/Standings';

// Component for home screen in main navigation
export class HomeScreen extends React.Component {
    static navigationOptions = {
        title: "Home"
    };

    render() {
        const { navigate } = this.props.navigation;
        const countDownEnd = new Date("2020-12-31T23:59:59");
        const secondsToEnd = Math.floor((countDownEnd - Date.now()) / 1000);
        const eventName = 'DanceBlue 5K 🏃🏼‍♂';

        return (
            <ScrollView showsVerticalScrollIndicator={false}>
                <SafeAreaView style={styles.container}>
                    <HeaderImage />
                    <CountdownView name={eventName} time={secondsToEnd} />
                    <Announcements />
                    <Standings />
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
        marginTop: 5,
        justifyContent: "center",
        alignItems: "center",
    },
});
