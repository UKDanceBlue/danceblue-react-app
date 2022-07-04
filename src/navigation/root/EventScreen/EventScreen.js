import { MaterialIcons } from "@expo/vector-icons";
import firebaseFirestore from "@react-native-firebase/firestore";
import { useRoute } from "@react-navigation/native";
import { DateTime } from "luxon";
import { Text } from "native-base";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, StyleSheet, TouchableHighlight, View } from "react-native";
import openMap from "react-native-open-maps";
// Import * as Calendar from 'expo-calendar';

import { useFirebaseStorageUrl } from "../../../common/CustomHooks";
import { globalColors } from "../../../theme";

// Const danceBlueCalendarConfig = {
//   Title: 'DanceBlue',
//   Color: globalColors.dbBlue,
//   EntityType: Calendar.EntityTypes.EVENT,
//   Source: {
//     IsLocalAccount: true,
//     Name: 'DanceBlue Mobile',
//   },
//   Name: 'dancebluemobile',
//   OwnerAccount: 'DanceBlue Mobile',
//   AccessLevel: Calendar.CalendarAccessLevel.OWNER,
// };

/**
 * A component for showing a particular calendar event
 * @see {@link https://docs.expo.dev/versions/latest/sdk/calendar/ Expo's Calendar API}
 */
const EventScreen = () => {
  // Const [isOnCalendar, setIsOnCalendar] = useState(false);
  // Const [calendarID, setCalendarID] = useState(undefined);
  // Const [eventCalendarID, setEventCalendarID] = useState(null);
  const [ startTime, setStartTime ] = useState<DateTime>(DateTime.now());
  const [ endTime, setEndTime ] = useState<DateTime>(DateTime.now());
  // Const [title, setTitle] = useState('');
  const [ address, setAddress ] = useState("");
  const [ imageFirebaseRef, setImageFirebaseRef ] = useState("");
  const [ imageRef, imageRefError ] = useFirebaseStorageUrl(imageFirebaseRef);
  const [ description, setDescription ] = useState("");
  const route = useRoute();

  /**
   * Check if the DanceBlue calendar exist's on the user's device
   */
  // Const checkDBCalendar = async () => {
  //   Let foundCalendar = false;
  //   Const calendars = await Calendar.getCalendarsAsync();
  //   Calendars.forEach((calendar) => {
  //     If (calendar.name === 'dancebluemobile') {
  //       SetCalendarID(calendar.id);
  //       FoundCalendar = true;
  //     }
  //   });
  //   Return foundCalendar;
  // };

  useEffect(() => {
    let shouldUpdateState = true;
    firebaseFirestore().doc(`events/${route.params.id}`).get()
      .then((document) => {
        if (shouldUpdateState) {
        // SetTitle(document.data().title);
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
  }, [
    route.params.id, startTime, endTime, setStartTime, setEndTime
  ]);

  /**
   * Check if the event exists on the DanceBlue calendar
   * If it exists then it adds *{isOnCalendar: true}* and *eventCalendarID* to *this.state*
   */
  // UseEffect(() => {
  //   If (!isLoading) {
  //     Calendar.requestCalendarPermissionsAsync()
  //       .then(checkDBCalendar)
  //       .then(async (calendarExists) => {
  //         If (calendarExists) {
  //           Const events = await Calendar.getEventsAsync(
  //             [calendarID],
  //             StartTime.toDate(),
  //             EndTime.toDate()
  //           );
  //           Events.forEach((event) => {
  //             If (event.title === title) {
  //               SetIsOnCalendar(true);
  //               SetEventCalendarID(event.id);
  //             }
  //           });
  //         }
  //       });
  //   }
  // }, [calendarID, endTime, startTime, title, isLoading]);

  /**
   * Creates a new calendar on the user's device and adds *calendarID* to *this.state*
   */
  // Const createDBCalendar = () =>
  //   Calendar.createCalendarAsync(danceBlueCalendarConfig).then((localId) => setCalendarID(localId));

  /**
   * Add the event to the calendar
   * While the function is running *isAddingToCalendar* will return true
   * If the event is successfully created *{isAddingToCalendar: false, isOnCalendar: true}* and eventCalendarID will be added to this.state
   */
  // Const addToCalendar = () => {
  //   Calendar.requestCalendarPermissionsAsync()
  //     .then(checkDBCalendar)
  //     .then(async (calendarExists) => {
  //       If (!calendarExists) {
  //         Await createDBCalendar();
  //       }
  //       Return Calendar.createEventAsync(calendarID, {
  //         Title,
  //         StartDate: startTime.toDate(),
  //         EndDate: endTime.toDate(),
  //         Location: address,
  //       }).then((localId) => {
  //         SetEventCalendarID(localId);
  //         SetIsOnCalendar(true);
  //       });
  //     });
  // };

  /**
   * Removes an event from the calendar
   * While the function is running *isAddingToCalendar* will return true
   */
  // Const removeFromCalendar = async () => {
  //   Await Calendar.deleteEventAsync(eventCalendarID);
  //   SetIsOnCalendar(false);
  //   SetEventCalendarID(null);
  // };

  let whenString = "";
  if (startTime.equals(endTime)) {
    whenString = `${startTime.toFormat("L/d/yyyy h:mm a")} - ${endTime.toFormat("h:mm a")}`;
  } else {
    whenString = `${startTime.toFormat("L/d/yyyy h:mm a")} - ${endTime.toFormat("L/d/yyyy h:mm a")}`;
  }
  return (
    <>
      <View style={{ flex: 1, justifyContent: "flex-start" }}>
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
  body: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 15,
  },
  boldText: {
    fontSize: 17,
    fontWeight: "bold",
  },
  button: {
    alignItems: "center",
    backgroundColor: globalColors.dbBlue,
    borderRadius: 5,
    padding: 10,
    width: "45%",
  },
  buttonContainer: {
    flexDirection: "row",
    paddingTop: 10,
  },
  buttonText: { color: "white" },
  image: {
    height: 250,
    width: "100%",
  },
  text: { fontSize: 17 },
});

export default EventScreen;
