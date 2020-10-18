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

export default class Event extends Component {
    constructor(props) {



        super(props);
    }
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.eventBox}>
                    <View style={styles.eventInfo}>
                        <View style={styles.eventTitleDateView}>
                            <View style={styles.eventTitleView}>
                                <Text
                                    style={styles.eventTitle}
                                    adjustsFontSizeToFit
                                    numberOfLines={2}
                                >Jimmy John&apos;s Restaurant Night</Text>
                            </View>
                            <View style={styles.eventDateView}>
                                <Text style={styles.eventDate}>
                                    January 1 {"\u2022"} 11am-11:30pm
                  </Text>
                            </View>
                        </View>
                        <View style={styles.eventDetailsView}>
                            <Text
                                style={styles.eventDetails}
                                adjustsFontSizeToFit
                                numberOfLines={3}
                            >Support the Chaarg DanceBlue Team and earn one spirit point! We need 3 lines!
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
    }
}

const styles = StyleSheet.create({
  container: {
    height:175,
    width: "95%",
    marginBottom:10,
    backgroundColor: "white",
    borderRadius: 15,
    overflow: "hidden",
  },
  eventBox: {
    flex:60,
    width:'100%',
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
    paddingLeft:8,
    paddingRight:2,
    alignItems: "flex-start",
  },
  eventTitleDateView: {
    flex: 1,
    justifyContent: "flex-start",
  },
  eventTitleView: {
    flex: 3,
    justifyContent: "center",
    alignItems:'flex-start',
  },
  eventTitle: {
    textAlign: "left",
    fontWeight: "bold",
    fontSize:30,
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
    justifyContent:'flex-start',
    paddingTop:2,
    borderTopWidth: 2,
    borderTopColor: "#0033A0",
  },
  eventDetails: {
    textAlign: "left",
    fontSize:14,
  },
  buttonView: {
    flex:20,
    marginTop:-10,
    padding:5,
    flexDirection:'row',
    justifyContent:'space-evenly',
    alignItems:'center',
  },
  button: {
    width:140,
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
});
