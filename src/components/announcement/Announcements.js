import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import AnnouncementRow from '../../components/announcement/AnnouncementRow';

const Announcements = () => {
    let announcements = [
        { id: 1, text: 'This is the announcement. It is very long and pointless to do something this long.' },
        { id: 2, text: 'DanceBlue has raised over $15 Million FTK!' }
    ];

    return (
        <View style={styles.shadowsStyling}>
            <View style={styles.announcementView}>
                <View style={styles.announcementTitleView}>
                    <Text style={styles.announcementTitle}>ANNOUNCEMENTS</Text>
                </View>
                {
                    announcements.map((row) =>
                        <AnnouncementRow styles={styles} key={row.id} id={row.id} text={row.text} />
                    )
                }
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
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
    fontSize:16,
  },
  shadowsStyling: {
    width: '95%',
    marginBottom:10,
    shadowColor: "gray",
    shadowOpacity: 0.8,
    shadowRadius: 6,
    shadowOffset: {
      height: 0,
      width: 0,
    },
  },
});

export default Announcements;