import React from "react";
import { View, Image, TouchableHighlight } from 'react-native';
import * as WebBrowser from 'expo-web-browser';

class Card extends React.Component {
    render() {
        return (
            <TouchableHighlight 
                onPress={() => WebBrowser.openBrowserAsync(this.props.sponsorLink)}
                underlayColor='#dddddd'
            > 
                <View 
                    style={{ 
                        borderWidth: 0.1, 
                        borderColor: '#ffffff', 
                        flex: 2, 
                        
                    }}
                > 
                    <Image
                        source={this.props.imageLink}
                        style={{ flex: 1, width: 200, resizeMode: 'contain'}}
                    />
                </View>
            </TouchableHighlight>
        );
    }
}
export default Card;