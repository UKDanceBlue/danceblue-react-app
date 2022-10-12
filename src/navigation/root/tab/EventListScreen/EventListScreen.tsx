import firebaseFirestore from "@react-native-firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { DateTime, Interval } from "luxon";
import { Center, Container, Heading, SectionList, Text, useTheme } from "native-base";
import { background } from "native-base/lib/typescript/theme/styled-system";
import React, { useCallback, useEffect, useState } from "react";
import { StatusBar, TouchableOpacity, View } from "react-native";
import { Agenda, Calendar, CalendarList } from "react-native-calendars";
import { MarkedDates } from "react-native-calendars/src/types";

import EventRow from "../../../../common/components/EventRow";
import { useColorModeValue } from "../../../../common/customHooks";
import { log, universalCatch } from "../../../../common/logging";
import { useFirebase } from "../../../../context";
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

  const [ selectedDay, setSelectedDay ] = useState("");

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
   *  Initialize Marked Dates
   */

  const todaysDate = DateTime.now().toFormat("yyyy-MM-dd");

  /* const getMarkedDates = (date: Date) => {
    let markedDates: MarkedDates = {{
      todaysDate: { selected: true },
    }};

    markedDates[date.toDateString] = { selected: true };
    events.forEach((event) => {
      const formattedDate = event.interval?.substring(0, 10);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      markedDates[formattedDate] = {
        ...markedDates[formattedDate],
        marked: true,
      };
    });
  }; */

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
            paddingTop: "8%",
            shadowColor: "black",
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: 0.5,
            shadowRadius: 5
          }}
      >
        <CalendarList
          horizontal = { true }
          pagingEnabled = { true }
          onDayPress = { (day) => {
            // TODO: set calendars selcted day to (day)
            console.log(day);
            console.log(today);
            console.log(events);
          }}
          // TODO: figure out custom style
          markingType = { "custom" }
          markedDates =
            {{
              [todaysDate]:
              {
                customStyles:
                {
                  container: { backgroundColor: "white" },
                  text: {
                    color: "#0032a0",
                    fontWeight: "bold"
                  }
                }
              },
              "2022-09-24":
              {
                customStyles:
                {
                  container: { backgroundColor: "white" },
                  text: {
                    color: "#0032a0",
                    fontWeight: "bold"
                  }
                }
              }
            }}
          theme =
            {{
              calendarBackground: "transparent",
              monthTextColor: "#FFC72C",
              textMonthFontWeight: "900",
              textMonthFontSize: 20,
              textDayFontWeight: "bold",
              dayTextColor: "white",
              textDayFontSize: 20,
              textDayHeaderFontSize: 15,
              todayTextColor: "#FFC72C"
            }}
        >
        </CalendarList>
      </View>
    </>

  );
};

EventListScreen.navigationOptions = { title: "Events" };

export default EventListScreen;
