// Import third-party dependencies
import React from "react";
import { Text, View, StyleSheet, ScrollView, SafeAreaView } from "react-native";
import Events from '../../components/event/Events';


// Component for events screen in main navigation
export class EventsScreen extends React.Component {
    static navigationOptions = {
        title: "Events"
    };
    render() {
        return (
            <ScrollView showsVerticalScrollIndicator={false}>
                <SafeAreaView style={styles.container}>
                    <Events />
                </SafeAreaView>
            </ScrollView>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5
    }
});
