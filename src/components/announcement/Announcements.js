import React from 'react';
import {
    View,
    StyleSheet,
    Text,
} from 'react-native';

const Announcements = (props) => {
    return (
        <View style={styles.announcementView}>
          <View style={styles.announcementTitleView}>
            <Text style={styles.announcementTitle}> ANNOUNCEMENTS </Text>
          </View>
          <View style={styles.announcementRow}>
            <View style={styles.bulletView}>
              <Text style={styles.bulletStyle}>{'\u2022' + " "}</Text>
            </View>
            <View style={styles.bulletTextView}>
              <Text style={styles.announcementText}>This is the announcement. It is very long and pointless to do something this long.</Text>
            </View>
          </View>
          <View style={styles.announcementRow}>
            <View style={styles.bulletView}>
              <Text style={styles.bulletStyle}>{'\u2022' + " "}</Text>
            </View>
            <View style={styles.bulletTextView}>
              <Text style={styles.announcementText}>DanceBlue has raised over $15 Million FTK!</Text>
            </View>
          </View>
        </View>
    );
};

const styles = StyleSheet.create({
  announcementView: {
    paddingLeft: 5,
    marginTop: 5,
    paddingTop: 5,
    paddingBottom: 5,
    width: "98%",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    backgroundColor: "white",
    borderRadius: 10,
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
  }
});

export default Announcements;