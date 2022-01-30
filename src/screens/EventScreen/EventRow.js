import React from 'react';
import { Text, Image, ActivityIndicator, StyleSheet, View } from 'react-native';
import { format, isSameDay } from 'date-fns';
import { MaterialIcons } from '@expo/vector-icons';
import { useFirebaseStorageUrl } from '../../common/CustomHooks';

/**
 * A simple row of *Event*s from *startDate* to *endDate*
 * @param {Object} props Properties of the component: imageLink, startDate, endDate, title, firebase
 */
const EventRow = ({ imageLink, startDate, endDate, title }) => {
  const [imageRef, imageRefError] = useFirebaseStorageUrl(imageLink);

  /**
   * Called to generate a React Native component
   * @returns A JSX formatted component
   */
  let whenString = '';
  if (isSameDay(startDate, endDate)) {
    whenString = `${format(startDate, 'M/d/yyyy h:mm a')} - ${format(endDate, 'h:mm a')}`;
  } else {
    whenString = `${format(startDate, 'M/d/yyyy h:mm a')} - ${format(endDate, 'M/d/yyyy h:mm a')}`;
  }
  return (
    <View style={styles.body}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.date}>{whenString}</Text>
      </View>
      <View style={styles.imageContainer}>
        {!imageRef && !imageRefError && <ActivityIndicator size="large" color="blue" />}
        {imageRefError && <MaterialIcons name="image-not-supported" size={36} color="black" />}
        {imageRef && <Image style={styles.image} source={{ uri: imageRef }} />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    flexDirection: 'row',
    padding: 5,
    borderRadius: 10,
    flex: 1,
    borderWidth: 2,
    borderColor: '#3248a8',
  },
  date: {
    fontSize: 17,
    flex: 1,
    flexGrow: 0,
    flexShrink: 1,
  },
  image: {
    flex: 1,
    resizeMode: 'contain',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  textContainer: {
    flex: 4,
    flexGrow: 1,
    flexShrink: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    flexGrow: 0,
    flexShrink: 1,
  },
});

export default EventRow;
