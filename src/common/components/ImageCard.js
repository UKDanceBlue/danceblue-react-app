import React from 'react';
import { View, TouchableHighlight, StyleSheet, ActivityIndicator, Image } from 'react-native';
import * as WebBrowser from 'expo-web-browser';

import { MaterialIcons } from '@expo/vector-icons';
import { useFirebaseStorageUrl } from '../CustomHooks';

/**
 * A card showing a Sponsor's logo that link's to their website
 * @param {Object} props Properties of the component: imageLink, sponsorLink, firebase
 */
const SponsorCard = ({ imageLink, sponsorLink }) => {
  const [imageRef, imageRefError] = useFirebaseStorageUrl(imageLink);

  return (
    <TouchableHighlight
      onPress={() => WebBrowser.openBrowserAsync(sponsorLink)}
      underlayColor="#dddddd"
    >
      <View style={styles.border}>
        {!imageRef && !imageRefError && (
          <ActivityIndicator style={styles.image} size="large" color="blue" />
        )}
        {imageRefError && (
          <MaterialIcons name="image-not-supported" size={styles.image.width} color="black" />
        )}
        {imageRef && (
          <Image source={{ uri: imageRef, width: styles.image.width }} style={styles.image} />
        )}
      </View>
    </TouchableHighlight>
  );
};

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

export default SponsorCard;
