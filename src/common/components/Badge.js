import React from 'react';
import { View, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { Text } from 'react-native-elements';
import { MaterialIcons } from '@expo/vector-icons';
import { useFirebaseStorageUrl } from '../CustomHooks.ts';

/**
 * A badge icon for use with profiles
 */
const Badge = ({ imageURL, name }) => {
  const [imageRef, imageRefError] = useFirebaseStorageUrl(imageURL);

  return (
    <View style={styles.container}>
      {!imageRef && !imageRefError && <ActivityIndicator size="large" color="blue" />}
      {imageRefError && (
        <MaterialIcons name="image-not-supported" size={styles.icon.width} color="black" />
      )}
      {imageRef && (
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
