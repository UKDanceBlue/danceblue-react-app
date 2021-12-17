import React, { useEffect, useState } from 'react';
import { Text, ActivityIndicator, StyleSheet, TouchableHighlight, View, Image } from 'react-native';
import openMap from 'react-native-open-maps';
import * as Calendar from 'expo-calendar';
import moment from 'moment';
import { doc, getDoc } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';
import { globalColors } from '../../theme';
import { handleFirebaeError } from '../../common/AlertUtils';
import { firebaseFirestore, firebaseStorage } from '../../firebase/FirebaseApp';

const danceBlueCalendarConfig = {
  title: 'DanceBlue',
  color: globalColors.dbBlue,
  enitityType: Calendar.EntityTypes.EVENT,
  source: {
    isLocalAccount: true,
    name: 'DanceBlue Mobile',
  },
  name: 'dancebluemobile',
  ownerAccount: 'DanceBlue Mobile',
  accessLevel: Calendar.CalendarAccessLevel.OWNER,
};

/**
 * A component for showing a particular calendar event
 * @see {@link https://docs.expo.dev/versions/latest/sdk/calendar/ Expo's Calendar API}
 */
const EventView = ({ route: { params } }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isOnCalendar, setIsOnCalendar] = useState(false);
  const [calendarID, setCalendarID] = useState(undefined);
  const [eventCalendarID, setEventCalendarID] = useState(null);
  const [startTime, setStartTime] = useState(moment());
  const [endTime, setEndTime] = useState(moment());
  const [title, setTitle] = useState('');
  const [address, setAddress] = useState('');
  const [imageRef, setImageRef] = useState('');
  const [description, setDescription] = useState('');

  /**
   * Check if the DanceBlue calendar exist's on the user's device
   * @returns true if the calendar exists, false if not
   */
  const checkDBCalendar = async () => {
    let foundCalendar = false;
    const calendars = await Calendar.getCalendarsAsync();
    calendars.forEach((calendar) => {
      if (calendar.name === 'dancebluemobile') {
        setCalendarID(calendar.id);
        foundCalendar = true;
      }
    });
    return foundCalendar;
  };

  useEffect(() => {
    setIsLoading(true);
    async function getDocument() {
      const document = await getDoc(doc(firebaseFirestore, 'events', params.id));
      const { eventTitle, eventStartTime, eventEndTime, eventAddress, eventDescription } =
        document.data();
      setTitle(eventTitle);
      setStartTime(eventStartTime);
      setEndTime(eventEndTime);
      setAddress(eventAddress);
      setDescription(eventDescription);
      getDownloadURL(ref(firebaseStorage, document.data().image))
        .then(setImageRef)
        .catch(handleFirebaeError);
      setIsLoading(false);
    }
    getDocument();
  }, [params.id]);

  /**
   * Check if the event exists on the DanceBlue calendar
   * If it exisits then it adds *{isOnCalendar: true}* and *eventCalendarID* to *this.state*
   */
  useEffect(() => {
    if (!isLoading) {
      Calendar.requestCalendarPermissionsAsync()
        .then(checkDBCalendar)
        .then(async (calendarExists) => {
          if (calendarExists) {
            const events = await Calendar.getEventsAsync(
              [calendarID],
              startTime.toDate(),
              endTime.toDate()
            );
            events.forEach((event) => {
              if (event.title === title) {
                setIsOnCalendar(true);
                setEventCalendarID(event.id);
              }
            });
          }
        });
    }
  }, [calendarID, endTime, startTime, title, isLoading]);

  /**
   * Creates a new calendar on the user's device and adds *calendarID* to *this.state*
   * @returns A Promise for the completion of which ever callback is executed.
   */
  const createDBCalendar = () =>
    Calendar.createCalendarAsync(danceBlueCalendarConfig).then((localId) => setCalendarID(localId));

  /**
   * Add the event to the calendar
   * While the function is running *isAddingToCalendar* will return true
   * If the event is successfully created *{isAddingToCalendar: false, isOnCalendar: true}* and eventCalendarID will be added to this.state
   */
  const addToCalendar = () => {
    Calendar.requestCalendarPermissionsAsync()
      .then(checkDBCalendar)
      .then(async (calendarExists) => {
        if (!calendarExists) {
          await createDBCalendar();
        }
        return Calendar.createEventAsync(calendarID, {
          title,
          startDate: startTime.toDate(),
          endDate: endTime.toDate(),
          location: address,
        }).then((localId) => {
          setEventCalendarID(localId);
          setIsOnCalendar(true);
        });
      });
  };

  /**
   * Removes an event from the calendar
   * While the function is running *isAddingToCalendar* will return true
   * @returns A Promise for the completion of which ever callback is executed.
   */
  const removeFromCalendar = async () => {
    await Calendar.deleteEventAsync(eventCalendarID);
    setIsOnCalendar(false);
    setEventCalendarID(null);
  };

  let whenString = '';
  if (startTime.isSame(endTime, 'day')) {
    whenString = `${startTime.format('M/D/YYYY h:mm a')} - ${endTime.format('h:mm a')}`;
  } else {
    whenString = `${startTime.format('M/D/YYYY h:mm a')} - ${endTime.format('M/D/YYYY h:mm a')}`;
  }
  return (
    <>
      {isLoading && <ActivityIndicator style={styles.image} size="large" color="blue" />}
      {!isLoading && (
        <View style={{ flex: 1, justifyContent: 'flex-start' }}>
          <Image source={{ uri: imageRef }} style={styles.image} />
          <View style={styles.body}>
            {description && <Text style={styles.text}>{description}</Text>}
            {address && (
              <>
                <Text style={styles.boldText}>Where?</Text>
                <Text style={styles.text}>{address}</Text>
              </>
            )}
            {startTime && (
              <>
                <Text style={styles.boldText}>When?</Text>
                <Text style={styles.text}>{whenString}</Text>
              </>
            )}
            <View style={styles.buttonContainer}>
              {address && (
                <TouchableHighlight
                  onPress={() => openMap({ query: address })}
                  style={styles.button}
                >
                  <Text style={styles.buttonText}>Get Directions</Text>
                </TouchableHighlight>
              )}
              {startTime && (
                <TouchableHighlight
                  style={styles.button}
                  onPress={isOnCalendar ? removeFromCalendar : addToCalendar}
                >
                  <Text style={styles.buttonText}>
                    {isOnCalendar ? 'Remove from Calendar' : 'Add to Calendar'}
                  </Text>
                </TouchableHighlight>
              )}
            </View>
          </View>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  image: {
    height: 250,
    width: '100%',
  },
  button: {
    backgroundColor: '#0033A0E0',
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
