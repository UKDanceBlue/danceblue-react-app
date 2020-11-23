import React from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';

import { withFirebaseHOC } from "../../../config/Firebase";

import AnnouncementRow from '../../components/announcement/AnnouncementRow';

class Announcements extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            announcements: [],
            isLoading: true
        };
    }

    componentDidMount() {
        let announcements = [];
        this.props.firebase.getAnnouncements().then(snapshot => {
            snapshot.forEach(doc =>
                announcements.push({ id: doc.id, ...doc.data() })
            );
            this.setState({ announcements: announcements, isLoading: false });
        });
    }

    render() {
        let bullets = this.state.announcements.map(announcement => (
            <AnnouncementRow styles={styles} key={announcement.id} id={announcement.id} text={announcement.body} />
        ));
        return (
            <View style={styles.container}>
                <View style={styles.announcementView}>
                    <View style={styles.announcementTitleView}>
                        <Text style={styles.announcementTitle}> ANNOUNCEMENTS </Text>
                    </View>
                    {!this.state.isLoading && bullets}
                </View>
                {
                    this.state.isLoading && (
                        <ActivityIndicator
                            size="large"
                            color="blue"
                            style={styles.activityIndicatorStyle}
                        />
                    )
                }
            </View>
        );
    }
};

const styles = StyleSheet.create({
    activityIndicatorStyle: {
        alignItems: "center",
        justifyContent: "center",
        padding: 20
    },
    announcementView: {
        paddingLeft: 5,
        paddingTop: 5,
        paddingBottom: 5,
        width: "100%",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        backgroundColor: "white",
        borderRadius: 15,
        overflow: "hidden",
    },
    announcementTitle: {
        color: "black",
        fontSize: 20,
        fontWeight: "bold",
    },
    announcementTitleView: {
        borderBottomColor: "#0033A0",
        borderBottomWidth: 2,
    },
    announcementRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        flexWrap: "wrap",
        paddingTop: 5,
        paddingRight: 5,
        paddingLeft: 5,
    },
    bulletView: {
        width: 15,
        fontSize: 20,
        alignSelf: "flex-start",
    },
    bulletTextView: {
        flex: 1,
    },
    bulletStyle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#0033A0",
    },
    announcementText: {
        fontSize: 16,
    },
    shadowsStyling: {
        width: '95%',
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

export default withFirebaseHOC(Announcements);