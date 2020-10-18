import React from 'react';
import {
    View,
    StyleSheet,
    Text,
} from 'react-native';

import CountDown from 'react-native-countdown-component';

const CountdownView = props => {
    return (
        <View style={styles.shadowsStyling}>
            <View style={styles.container}>
                <Text
                    adjustsFontSizeToFit
                    numberOfLines={1}
                    style={styles.countodwnTitle}
                >{props.name}</Text>
                <CountDown
                    style={styles.countdownStyle}
                    size={30}
                    until={props.time}
                    digitStyle={{ backgroundColor: 'rgba(255,255,255,0.5)' }}
                    digitTxtStyle={{ color: 'white' }}
                    timeLabelStyle={{ color: 'white', fontWeight: 'bold' }}
                    separatorStyle={{ color: '#FFC72C' }}
                    timeToShow={['D', 'H', 'M', 'S']}
                    showSeparator
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: '100%',
        width: "100%",
        backgroundColor: "#0033A0E0",
        justifyContent: "center",
        borderRadius: 15,
        overflow: "hidden",
        alignItems: "center",
    },
    countodwnTitle: {
        fontSize: 34,
        fontWeight: 'bold',
        color: "white",
        alignSelf: "center",
        paddingBottom: 5,
    },
    countdownStyle: {
        width: "90%",
        borderTopColor: "#FFC72C",
        borderTopWidth: 3,
        paddingTop: 5,
    },
    shadowsStyling: {
        width: '95%',
        height: 180,
        marginBottom: 10,
        shadowColor: "gray",
        shadowOpacity: 0.8,
        shadowRadius: 6,
        shadowOffset: {
            height: 0,
            width: 0,
        },
    },
});

export default CountdownView;