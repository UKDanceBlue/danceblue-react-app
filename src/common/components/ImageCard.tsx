/// <reference types="react" />
import React from 'react';
import { View, TouchableHighlight, StyleSheet, ActivityIndicator, Image } from 'react-native';
import * as WebBrowser from 'expo-web-browser';

import { MaterialIcons } from '@expo/vector-icons';
import { useCachedFile } from '../CustomHooks';

/**
 * A card showing a Sponsor's logo that link's to their website
 */
const SponsorCard = ({
  imageLink,
  sponsorLink,
  name,
}: {
  imageLink: string | undefined;
  sponsorLink: string | undefined;
  name: string | undefined;
}) => {
  const [imageContent, imageRefError] = useCachedFile(`${name}-logo`, 172800, {
    base64: true,
    downloadUri: imageLink,
  });

  return (
    <TouchableHighlight
      onPress={sponsorLink ? () => WebBrowser.openBrowserAsync(sponsorLink) : undefined}
      underlayColor="#dddddd"
    >
      <View style={styles.border}>
        {!imageContent && !imageRefError && (
          <ActivityIndicator style={styles.image} size="large" color="blue" />
        )}
        {imageRefError && (
          <MaterialIcons name="image-not-supported" size={styles.image.width} color="black" />
        )}
        {imageContent && (
          <Image
            source={{ uri: `data:image;base64,${imageContent}`, width: styles.image.width }}
            style={styles.image}
          />
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
