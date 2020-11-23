import React from "react";
import { View, Image, TouchableHighlight, StyleSheet } from 'react-native';
import * as WebBrowser from 'expo-web-browser';

class SponsorCard extends React.Component {
    render() {
        return (
            <TouchableHighlight
                onPress={() => WebBrowser.openBrowserAsync(this.props.sponsorLink)}
                underlayColor='#dddddd'
            >
                <View style={styles.border}>
                    <Image source={this.props.imageLink} style={styles.image} />
                </View>
            </TouchableHighlight>
        );
    }
}

const styles = StyleSheet.create({
    border: {
        flex: 2,
        padding: 0
    },
    image: {
        flex: 1,
        width: 200,
        resizeMode: "contain"
    },
});

export default SponsorCard;