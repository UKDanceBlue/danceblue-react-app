/// <reference types="react" />
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, TouchableHighlight, View, Image } from 'react-native';
import { Text } from 'react-native-elements';
import { format, isSameDay } from 'date-fns';
import openMap from 'react-native-open-maps';
// import * as Calendar from 'expo-calendar';
import { doc, getDoc } from 'firebase/firestore';
import { MaterialIcons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import { globalColors } from '../../theme';
import { firebaseFirestore } from '../../common/FirebaseApp';
import { useFirebaseStorageUrl } from '../../common/CustomHooks';
import { MainStackScreenProps } from '../../types/NavigationTypes';

// const danceBlueCalendarConfig = {
//   title: 'DanceBlue',
//   color: globalColors.dbBlue,
//   entityType: Calendar.EntityTypes.EVENT,
//   source: {
//     isLocalAccount: true,
//     name: 'DanceBlue Mobile',
//   },
//   name: 'dancebluemobile',
//   ownerAccount: 'DanceBlue Mobile',
//   accessLevel: Calendar.CalendarAccessLevel.OWNER,
// };

/**
 * A component for showing a particular calendar event
 * @see {@link https://docs.expo.dev/versions/latest/sdk/calendar/ Expo's Calendar API}
 */
const EventView = () => {
  // const [isOnCalendar, setIsOnCalendar] = useState(false);
  // const [calendarID, setCalendarID] = useState(undefined);
  // const [eventCalendarID, setEventCalendarID] = useState(null);
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  // const [title, setTitle] = useState('');
  const [address, setAddress] = useState('');
  const [imageFirebaseRef, setImageFirebaseRef] = useState('');
  const [imageRef, imageRefError] = useFirebaseStorageUrl(imageFirebaseRef);
  const [description, setDescription] = useState('');
  const route = useRoute<MainStackScreenProps<'Event'>['route']>();

  /**
   * Check if the DanceBlue calendar exist's on the user's device
   */
  // const checkDBCalendar = async () => {
  //   let foundCalendar = false;
  //   const calendars = await Calendar.getCalendarsAsync();
  //   calendars.forEach((calendar) => {
  //     if (calendar.name === 'dancebluemobile') {
  //       setCalendarID(calendar.id);
  //       foundCalendar = true;
  //     }
  //   });
  //   return foundCalendar;
  // };

  useEffect(() => {
    let shouldUpdateState = true;
    getDoc(doc(firebaseFirestore, 'events', route.params.id)).then((document) => {
      if (shouldUpdateState) {
        // setTitle(document.data().title);
        setStartTime(document.data().startTime.toDate());
        setEndTime(document.data().endTime.toDate());
        setAddress(document.data().address);
        setDescription(document.data().description);
        setImageFirebaseRef(document.data().image);
      }
    });
    return () => {
      shouldUpdateState = false;
    };
  }, [route.params.id]);

  /**
   * Check if the event exists on the DanceBlue calendar
   * If it exists then it adds *{isOnCalendar: true}* and *eventCalendarID* to *this.state*
   */
  // useEffect(() => {
  //   if (!isLoading) {
  //     Calendar.requestCalendarPermissionsAsync()
  //       .then(checkDBCalendar)
  //       .then(async (calendarExists) => {
  //         if (calendarExists) {
  //           const events = await Calendar.getEventsAsync(
  //             [calendarID],
  //             startTime.toDate(),
  //             endTime.toDate()
  //           );
  //           events.forEach((event) => {
  //             if (event.title === title) {
  //               setIsOnCalendar(true);
  //               setEventCalendarID(event.id);
  //             }
  //           });
  //         }
  //       });
  //   }
  // }, [calendarID, endTime, startTime, title, isLoading]);

  /**
   * Creates a new calendar on the user's device and adds *calendarID* to *this.state*
   */
  // const createDBCalendar = () =>
  //   Calendar.createCalendarAsync(danceBlueCalendarConfig).then((localId) => setCalendarID(localId));

  /**
   * Add the event to the calendar
   * While the function is running *isAddingToCalendar* will return true
   * If the event is successfully created *{isAddingToCalendar: false, isOnCalendar: true}* and eventCalendarID will be added to this.state
   */
  // const addToCalendar = () => {
  //   Calendar.requestCalendarPermissionsAsync()
  //     .then(checkDBCalendar)
  //     .then(async (calendarExists) => {
  //       if (!calendarExists) {
  //         await createDBCalendar();
  //       }
  //       return Calendar.createEventAsync(calendarID, {
  //         title,
  //         startDate: startTime.toDate(),
  //         endDate: endTime.toDate(),
  //         location: address,
  //       }).then((localId) => {
  //         setEventCalendarID(localId);
  //         setIsOnCalendar(true);
  //       });
  //     });
  // };

  /**
   * Removes an event from the calendar
   * While the function is running *isAddingToCalendar* will return true
   */
  // const removeFromCalendar = async () => {
  //   await Calendar.deleteEventAsync(eventCalendarID);
  //   setIsOnCalendar(false);
  //   setEventCalendarID(null);
  // };

  let whenString = '';
  if (isSameDay(startTime, endTime)) {
    whenString = `${format(startTime, 'M/d/yyyy h:mm a')} - ${format(endTime, 'h:mm a')}`;
  } else {
    whenString = `${format(startTime, 'M/d/yyyy h:mm a')} - ${format(endTime, 'M/d/yyyy h:mm a')}`;
  }
  return (
    <>
      <View style={{ flex: 1, justifyContent: 'flex-start' }}>
        {!imageRef && !imageRefError && <ActivityIndicator size="large" color="blue" />}
        {imageRefError && <MaterialIcons name="image-not-supported" size={36} color="black" />}
        {imageRef && <Image source={{ uri: imageRef }} style={styles.image} />}
        <View style={styles.body}>
          {!!description && <Text style={styles.text}>{description}</Text>}
          {!!address && (
            <>
              <Text style={styles.boldText}>Where?</Text>
              <Text style={styles.text}>{address}</Text>
            </>
          )}
          {!!startTime && (
            <>
              <Text style={styles.boldText}>When?</Text>
              <Text style={styles.text}>{whenString}</Text>
            </>
          )}
          <View style={styles.buttonContainer}>
            {!!address && (
              <TouchableHighlight onPress={() => openMap({ query: address })} style={styles.button}>
                <Text style={styles.buttonText}>Get Directions</Text>
              </TouchableHighlight>
            )}
            {/* {startTime && (
                <TouchableHighlight
                  style={styles.button}
                  onPress={isOnCalendar ? removeFromCalendar : addToCalendar}
                >
                  <Text style={styles.buttonText}>
                    {isOnCalendar ? 'Remove from Calendar' : 'Add to Calendar'}
                  </Text>
                </TouchableHighlight>
              )} */}
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  image: {
    height: 250,
    width: '100%',
  },
  button: {
    backgroundColor: globalColors.dbBlue,
    borderRadius: 5,
    padding: 10,
    width: '45%',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingTop: 10,
  },
  buttonText: {
    color: 'white',
  },
  text: {
    fontSize: 17,
  },
  boldText: {
    fontWeight: 'bold',
    fontSize: 17,
  },
  body: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 15,
  },
});

export default EventView;
