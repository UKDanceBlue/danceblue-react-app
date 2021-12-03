import React, { useEffect, useState } from 'react';
import { Text, View, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { ref, getDownloadURL } from 'firebase/storage';
import { firebaseStorage } from '../../firebase/FirebaseApp';
import { handleFirebaeError } from '../AlertUtils';

/**
 * A badge icon for use with profiles
 * @param {string} imageURL Badge url to fetch from firebase storage
 * @param {string} name Name of the badge
 */
const Badge = ({ imageURL, name }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [imageRef, setImageRef] = useState('');

  // Run on mount
  useEffect(() => {
    getDownloadURL(ref(firebaseStorage, imageURL))
      .then((url) => {
        setIsLoading(false);
        setImageRef(url);
      })
      .catch(handleFirebaeError);
  }, [imageURL]);

  return (
    <View style={styles.container}>
      {isLoading && <ActivityIndicator style={styles.image} size="large" color="blue" />}
      {!isLoading && (
        <>
          <Image style={styles.icon} source={{ uri: imageRef }} />
          <Text>{name}</Text>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 50,
    height: 50,
  },
});

export default Badge;
