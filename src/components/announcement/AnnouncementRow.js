import React from 'react';
import { View, Text } from 'react-native';

const AnnouncementRow = (props) => {
    const styles = props.styles;
    return (
        <View key={props.id} style={styles.announcementRow}>
            <View style={styles.bulletView}>
                <Text style={styles.bulletStyle}>{'\u2022' + " "}</Text>
            </View>
            <View style={styles.bulletTextView}>
                <Text style={styles.announcementText}>{props.text}</Text>
            </View>
        </View>
    );
};

export default AnnouncementRow;