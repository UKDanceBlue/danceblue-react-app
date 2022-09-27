import firebaseFirestore from "@react-native-firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { DateTime, Interval } from "luxon";
import { Center, Container, Heading, SectionList, Text, useTheme } from "native-base";
import { background } from "native-base/lib/typescript/theme/styled-system";
import React, { useCallback, useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { Agenda, Calendar, CalendarList } from "react-native-calendars";

import { useFirebase } from "../../../../common/FirebaseContext";
import EventRow from "../../../../common/components/EventRow";
import { useColorModeValue } from "../../../../common/customHooks";
import { log, universalCatch } from "../../../../common/logging";
import { ParsedFirestoreEvent, RawFirestoreEvent, parseFirestoreEvent } from "../../../../types/FirestoreEvent";
import { TabNavigatorProps } from "../../../../types/navigationTypes";

const EventListScreen = () => {
  const {
    fbStorage, fbFirestore
  } = useFirebase();
  const { colors } = useTheme();
  const screenBackgroundColor = useColorModeValue(colors.white, colors.gray[900]);

  const [ events, setEvents ] = useState<ParsedFirestoreEvent[]>([]);
  const [ today, setToday ] = useState<ParsedFirestoreEvent[]>([]);
  const [ upcoming, setUpcoming ] = useState<ParsedFirestoreEvent[]>([]);
  const [ refreshing, setRefreshing ] = useState(false);

  const navigation = useNavigation<TabNavigatorProps<"Events">["navigation"]>();

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      log("Loading event list screen from firestore");
      const firestoreEvents: ParsedFirestoreEvent[] = [];
      const snapshot = await fbFirestore.collection("events").where("endTime", ">", firebaseFirestore.Timestamp.now())
        .get();
      await Promise.all(snapshot.docs.map(async (doc) => {
        const data = doc.data() as RawFirestoreEvent;
        firestoreEvents.push(await parseFirestoreEvent(data, fbStorage));
      }));

      log(`Loaded event list screen from firestore: ${ JSON.stringify(firestoreEvents)}`);
      setEvents(firestoreEvents);
    } catch (error) {
      universalCatch(error);
    } finally {
      setRefreshing(false);
    }
  }, [ fbFirestore, fbStorage ]);

  useEffect(() => {
    refresh().catch(universalCatch);
  }, [
    fbFirestore, fbStorage, refresh
  ]);

  /**
   * Splits *events* into *today* and *upcoming* based on the events' start day
   */
  useEffect(() => {
    const todayFromEvents: ParsedFirestoreEvent[] = [];
    const upcomingFromEvents: ParsedFirestoreEvent[] = [];
    events.forEach((event) => {
      if (event.interval != null) {
        if (Interval.fromISO(event.interval).overlaps(Interval.fromDateTimes(DateTime.local().startOf("day"), DateTime.local().endOf("day")))) {
          todayFromEvents.push(event);
        } else {
          upcomingFromEvents.push(event);
        }
      }
    });
    log(`Split events into today and upcoming: ${ JSON.stringify(todayFromEvents)} ${ JSON.stringify(upcomingFromEvents)}`);
    setToday(todayFromEvents);
    setUpcoming(upcomingFromEvents);
  }, [events]);

  /**
   * Called by React Native when rendering the screen
   */
  return (
    <>
      <View
        style =
          {{
            backgroundColor: "#0032a0",
            height: "50%",
            width: "100%",
            paddingTop: "8%"
          }}
      >
        <CalendarList
          horizontal = { true }
          pagingEnabled = { true }
          onDayPress = { (day) => {
            
          }}
          theme =
            {{
              calendarBackground: "#0032a0",
              monthTextColor: "white",
              textMonthFontWeight: "900",
              textMonthFontSize: 20,
              textDayFontWeight: "bold",
              dayTextColor: "white",
              textDayFontSize: 20,
              textDayHeaderFontSize: 15,
              selectedDotColor: "white",
              selectedDayTextColor: "black",
              selectedDayBackgroundColor: "white",

            }}
        >
        </CalendarList>
      </View>
    </>
    
  );
};

EventListScreen.navigationOptions = { title: "Events" };

export default EventListScreen;
