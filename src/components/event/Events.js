import React from 'react';
import { Text, View, StyleSheet } from "react-native";
import EventRow from '../../components/event/EventRow';

const Events = () => {
    let events = [
        {
            id: '1',
            title: "Jimmy John's Restaurant Night",
            startDate: "January 1 11am",
            endDate: "January 1 11:30pm",
            text: 'Support the Chaarg DanceBlue Team and earn one spirit point! We need 3 lines!'
        },
        {
            id: '2',
            title: "Another Event",
            startDate: "January 1 11am",
            endDate: "January 1 11:30pm",
            text: 'Here is another event.'
        },
        {
            id: '3',
            title: "Yet Another",
            startDate: "January 1 11am",
            endDate: "January 1 11:30pm",
            text: 'Here is another event.'
        }
    ];

    return (
        <View style={styles.stephTest}>
            <View style={styles.sectionTitleView}>
                <Text style={styles.sectionTitle}> TODAYS EVENTS </Text>
            </View>
            <View style={styles.sectionTitleView}>
                <Text style={styles.sectionTitle}> COMING UP </Text>
            </View>
            {
                events.map((row) =>
                    <EventRow styles={styles} key={row.id} id={row.id} title={row.title} startDate={row.startDate} endDate={row.endDate} text={row.text} />
                )
            }
        </View>
    );
};

const styles = StyleSheet.create({
    stephTest: {
        width: "100%"
    },
    eventContainer: {
        marginTop: 5,
        marginBottom: 5,
        marginLeft: 10,
        marginRight: 10,
        backgroundColor: "white",
        borderRadius: 15,
        overflow: "hidden"
    },
    container: {
        height: 175,
        width: "95%",
        marginBottom: 10,
        backgroundColor: "white",
        borderRadius: 15,
        overflow: "hidden"
    },
    eventBox: {
        flex: 60,
        width: '100%',
        flexDirection: "row",
    },
    eventImage: {
        flex: 6,
        height: "92%",
        width: "100%",
        alignSelf: "center",
        marginRight: 5,
        borderRadius: 15,
        overflow: "hidden",
    },
    image: {
        flex: 1,
        height: null,
        width: null,
        resizeMode: "cover",
    },
    eventInfo: {
        flex: 13,
        width: "100%",
        paddingVertical: 4,
        paddingLeft: 8,
        paddingRight: 2,
        alignItems: "flex-start",
    },
    eventTitleDateView: {
        flex: 1,
        justifyContent: "flex-start",
    },
    eventTitleView: {
        flex: 3,
        justifyContent: "center",
        alignItems: 'flex-start',
    },
    eventTitle: {
        textAlign: "left",
        fontWeight: "bold",
        fontSize: 30,
    },
    eventDateView: {
        flex: 1,
        justifyContent: "center",
    },
    eventDate: {
        textAlign: "left",
        fontSize: 12,
        color: "gray",
    },
    eventDetailsView: {
        flex: 1,
        justifyContent: 'flex-start',
        paddingTop: 2,
        borderTopWidth: 2,
        borderTopColor: "#0033A0",
    },
    eventDetails: {
        textAlign: "left",
        fontSize: 14,
    },
    buttonView: {
        flex: 20,
        marginTop: -10,
        padding: 5,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    button: {
        width: 140,
    },
    icon: {
        top: -8,
        right: -5,
        width: 40,
        height: 40,
        borderRadius: 45 / 2,
        backgroundColor: "gold",
    },
    pointsText: {
        color: "white",
        fontSize: 24,
        fontWeight: "bold",
    },
    sectionTitle: {
        color: "black",
        fontSize: 24,
        fontWeight: "bold",
    },
    sectionTitleView: {
        marginLeft: 5,
        marginBottom: 13,
        borderBottomColor: "#0033A0",
        borderBottomWidth: 2,
        alignSelf: 'flex-start',
    },
    eventRow: {
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default Events;