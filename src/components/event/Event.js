import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Text,
    Image,
    TouchableHighlight
} from 'react-native';
import IconBadge from 'react-native-icon-badge';
import bdubs from "../../../assets/events/BDubs.jpg";

export default class Event extends Component {
    constructor(props){
        super(props)
    }
    render(){
        return (
            <TouchableHighlight
                onPress={ ()=>this.props.onPress }
            >
                <IconBadge
                    MainElement={
                        <View style={styles.eventBox}>
                            <View style={styles.eventImage}>
                                <Image source={bdubs} style={styles.image}/>
                            </View>
                            <View style={styles.eventInfo}>
                                <Text 
                                    adjustsFontSizeToFit
                                    numberOfLines={2}
                                    style={styles.eventTitle}
                                >Buffalo Wild Wings Restaurant Night</Text>
                                <Text style={styles.eventDate}>Monday, January 1, 2020</Text>
                                <Text style={styles.eventDate}>11am-11:30pm</Text>
                            </View>
                        </View>
                    }
                    BadgeElement={
                        <Text style={styles.pointsText}>99</Text>
                    }
                    IconBadgeStyle={styles.icon}
                />
            </TouchableHighlight>
        );
    }
};


const styles = StyleSheet.create({
    eventBox: {
        height:130,
        width:'92%',
        marginBottom:13,
        flexDirection:'row',
        justifyContent: "center",
        alignItems: "center",
        backgroundColor:'white',
        borderRadius:15,
        overflow:'hidden',
    },
    eventImage: {
        flex:7,
        height:'90%',
        width: '100%',
        marginLeft:8,
        marginVertical:12,
        borderRadius:15,
        overflow:'hidden',
    },
    image: {
        flex:1,
        height:null,
        width:null,
        resizeMode:'cover',
    },
    eventInfo: {
        flex:13,
        height:'95%',
        padding:5,
        marginVertical:10,
        justifyContent:'flex-start',
        alignItems:'flex-start',
    },
    eventTitle: {
        flex:2,
        width:'100%',
        height:'100%',
        fontSize:20,
        fontWeight:'bold',
        textDecorationLine:'underline'
    },
    eventDate: {
        flex:1,
        color:'gray'
    },
    icon: {
        top:-10,
        right:-10,
        width: 40,
        height: 40,
        borderRadius:45/2,
        backgroundColor: 'gold',
    },
    pointsText: {
        color:'white',
        fontSize:24,
        fontWeight:'bold',
    },
});