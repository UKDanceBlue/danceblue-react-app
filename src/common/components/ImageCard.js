import React from 'react';
import { View, TouchableHighlight, StyleSheet, ActivityIndicator, Image } from 'react-native';
import * as WebBrowser from 'expo-web-browser';

import { withFirebaseHOC } from '../../firebase/FirebaseContext';

/**
 * A card showing a Sponsor's logo that link's to their website
 * @param {Object} props Properties of the component: imageLink, sponsorLink, firebase
 * @class
 */
class SponsorCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      imageRef: '',
      isLoading: true,
    };
  }

  /**
   * Called immediately after a component is mounted. Setting state here will trigger re-rendering.
   */
  componentDidMount() {
    this.props.core
      .getDocumentURL(this.props.imageLink)
      .then((url) => {
        this.setState({ imageRef: url, isLoading: false });
      })
      .catch((error) => console.log(error.message));
  }

  /**
   * Called to generate a React Native component
   * @returns A JSX formatted component
   */
  render() {
    return (
      <TouchableHighlight
        onPress={() => WebBrowser.openBrowserAsync(this.props.sponsorLink)}
        underlayColor="#dddddd"
      >
        <View style={styles.border}>
          {this.state.isLoading && (
            <ActivityIndicator style={styles.image} size="large" color="blue" />
          )}
          {!this.state.isLoading && (
            <Image source={{ uri: this.state.imageRef }} style={styles.image} />
          )}
        </View>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  border: {
    flex: 2,
    padding: 0,
  },
  image: {
    flex: 1,
    width: 200,
    resizeMode: 'contain',
  },
});

export default withFirebaseHOC(SponsorCard);
