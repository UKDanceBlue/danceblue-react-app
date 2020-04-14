import React from 'react';
import {
    View,
    StyleSheet,
    Text,
} from 'react-native';

import CountDown from 'react-native-countdown-component';

const CountdownView = props => {
    return (
        <View style={styles.container}>
            <Text 
            adjustsFontSizeToFit
            numberOfLines={1}
            style={styles.countodwnTitle}
            >DanceBlue 5K 🏃🏼‍♂</Text>
            <CountDown
                style={styles.countdownStyle}
                size={30}
                until={props.time}
                digitStyle={{backgroundColor: 'rgba(255,255,255,0.5)'}}
                digitTxtStyle={{color: 'white'}}
                timeLabelStyle={{color: 'white', fontWeight: 'bold'}}
                separatorStyle={{color: '#FFC72C'}}
                timeToShow={['D', 'H', 'M', 'S']}
                showSeparator
            />
        </View>
    );
};

const styles = StyleSheet.create({
  container: {
    height: 180,
    width: "98%",
    backgroundColor: "#0033A0E0",
    marginTop: 5,
    justifyContent: "center",
    borderRadius: 20,
    overflow: "hidden",
    alignItems: "center",
  },
  countodwnTitle: {
    fontSize: 34,
    fontWeight:'bold',
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
});

export default CountdownView;