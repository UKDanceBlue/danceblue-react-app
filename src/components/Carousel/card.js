import React from "react";
import { View, Image, TouchableHighlight, StyleSheet } from "react-native";
import * as WebBrowser from "expo-web-browser";

import { withFirebaseHOC } from "../../../config/Firebase";

class Card extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      imageRef: ""
    };
  }

  componentDidMount() {
    this.props.firebase
      .getDocumentRef(this.props.imageLink)
      .getDownloadURL()
      .then(url => {
        this.setState({ imageRef: url });
      });
  }

  render() {
    return (
      <TouchableHighlight
        onPress={() => WebBrowser.openBrowserAsync(this.props.sponsorLink)}
        underlayColor="#dddddd"
      >
        <View style={styles.border}>
          <Image source={{ uri: this.state.imageRef }} style={styles.image} />
        </View>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  border: {
    flex: 2,
    padding: 0
  },
  image: {
    flex: 1,
    width: 200,
    resizeMode: "contain"
  }
});

export default withFirebaseHOC(Card);
