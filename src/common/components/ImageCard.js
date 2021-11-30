import React, { useEffect, useState } from 'react';
import { View, TouchableHighlight, StyleSheet, ActivityIndicator, Image } from 'react-native';
import * as WebBrowser from 'expo-web-browser';

import { useCore } from '../../firebase/FirebaseCoreWrappers';

/**
 * A card showing a Sponsor's logo that link's to their website
 * @param {Object} props Properties of the component: imageLink, sponsorLink, firebase
 */
const SponsorCard = ({ imageLink, sponsorLink }) => {
  const [imageRef, setImageRef] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const core = useCore();

  useEffect(() => {
    core
      .getDocumentURL(imageLink)
      .then((url) => {
        setImageRef(url);
        setIsLoading(false);
      })
      .catch((error) => console.log(error.message));
  }, [core, imageLink]);

  return (
    <TouchableHighlight
      onPress={() => WebBrowser.openBrowserAsync(sponsorLink)}
      underlayColor="#dddddd"
    >
      <View style={styles.border}>
        {isLoading && <ActivityIndicator style={styles.image} size="large" color="blue" />}
        {!isLoading && <Image source={{ uri: imageRef }} style={styles.image} />}
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
