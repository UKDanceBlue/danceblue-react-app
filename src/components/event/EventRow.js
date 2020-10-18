import React, { Component } from "react";
import {
    View,
    StyleSheet,
    Text,
    Image,
} from "react-native";
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import bdubs from "../../../assets/events/BDubs.jpg";

const EventRow = (props) => {
    const styles = props.styles;
    return (
        <View key={props.id} style={styles.eventContainer}>
            <View style={styles.eventBox}>
                <View style={styles.eventInfo}>
                    <View style={styles.eventTitleDateView}>
                        <View style={styles.eventTitleView}>
                            <Text
                                style={styles.eventTitle}
                                adjustsFontSizeToFit
                                numberOfLines={2}
                            >
                                {props.title}
                            </Text>
                        </View>
                        <View style={styles.eventDateView}>
                            <Text style={styles.eventDate}>
                                {props.startDate} - {props.endDate}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.eventDetailsView}>
                        <Text
                            style={styles.eventDetails}
                            adjustsFontSizeToFit
                            numberOfLines={3}
                        >
                            {props.text}
                        </Text>
                    </View>
                </View>
                <View style={styles.eventImage}>
                    <Image source={bdubs} style={styles.image} />
                </View>
            </View>
            <View style={styles.buttonView}>
                <Button
                    style={styles.button}
                    type='outline'
                    raised={true}
                    icon={
                        <Icon
                            name="car"
                            size={15}
                            color="#0033A0"
                        />
                    }
                />
                <Button
                    style={styles.button}
                    type='outline'
                    raised={true}
                    icon={
                        <Icon
                            name="calendar"
                            size={15}
                            color="#0033A0"
                        />
                    }
                />
            </View>
        </View>
    );
};

export default EventRow;