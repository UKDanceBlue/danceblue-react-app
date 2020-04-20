import React from 'react';
import {
    View,
    StyleSheet,
    Text,
    Image,
} from 'react-native';

const EventDetails = ({ navigation, route }) => {
    const { test } = this.route.params;
    return (
        <View>
            <Text>{test}</Text>
        </View>
    );
};


const styles = StyleSheet.create({

});

export default EventDetails;