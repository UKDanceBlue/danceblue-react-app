// Import third-party dependencies
import React from "react";
import { SafeAreaView, ScrollView } from "react-native";

// Import first-party dependencies
import Standings from "./Standings";

/**
 * Wrapper for a Standings component
 * @param {Object} props Properties of the component: navigation, firebase
 * @author Tag Howard
 * @since 1.0.2
 * @class
 */
export class ScoreboardScreen extends React.Component {
    render() {
        return (
        <ScrollView showsVerticalScrollIndicator>
            <SafeAreaView style={{ flex: 1 }}>
            <Standings isExpanded />
            </SafeAreaView>
        </ScrollView>
        );
    }
}

export default ScoreboardScreen