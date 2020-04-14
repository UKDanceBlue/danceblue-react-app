{/* Carousel implementation for Sponsor showcase */}
import React from "react";
import { Text, View, ScrollView, StyleSheet } from "react-native";
import Card from '../../components/Carousel/card'; 

const Carousel = props => {
        return (
            // <View>
            <ScrollView ScrollEventThrottle= { 16 }>
                <View style={styles.sponsorView}>
                    <Text style={styles.sponsorTitle}>THANK YOU TO OUR SPONSORS</Text>
                    <View style={{ height: 130, marginTop: 20 }}>
                            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                            <Card imageLink={require ('./assets/hyundai.png')} sponsorLink={'https://www.hyundaiusa.com/'}/>
                            <Card imageLink={require ('./assets/aramark.jpg')} sponsorLink={'https://www.aramark.com/'}/>
                            <Card imageLink={require ('./assets/coke.png')} sponsorLink={'https://us.coca-cola.com/'}/>
                            <Card imageLink={require ('./assets/enterprise.jpg')} sponsorLink={'https://www.enterprisecarsales.com/'}/>
                            <Card imageLink={require ('./assets/hub.png')} sponsorLink={'https://www.enterprisecarsales.com/'}/>
                            <Card imageLink={require ('./assets/jersey-mikes.jpg')} sponsorLink={'https://www.jerseymikes.com/'}/>
                            <Card imageLink={require ('./assets/keeneland.png')} sponsorLink={'https://keeneland.com/'}/>
                            <Card imageLink={require ('./assets/pie-five.jpg')} sponsorLink={'https://www.piefivepizza.com/'}/>
                            <Card imageLink={require ('./assets/uk-credit-union.png')} sponsorLink={'https://www.ukfcu.org/'}/>
                            <Card imageLink={require ('./assets/uk-housing.jpg')} sponsorLink={'https://www.uky.edu/housing/'}/>
                            <Card imageLink={require ('./assets/uk-ifc.png')} sponsorLink={'http://www.kentuckyifc.com/'}/>
                        </ScrollView>
                    </View>
                </View>
            </ScrollView>
            // </View>
        );
    };

const styles = StyleSheet.create({
    sponsorView: {
        paddingLeft: 5,
        marginTop: 5,
        paddingTop: 5,
        paddingBottom: 5,
        width: "99%",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        backgroundColor: "white",
        borderRadius: 10,
        overflow: "hidden",
        flex: 1,
    },
    sponsorTitle: { 
        fontSize: 20 , 
        fontWeight: 'bold', 
        borderBottomColor: "#0033A0", 
        borderBottomWidth: 2, 
    }
 });

export default Carousel;