// I removed some unnecessary imports up here
import { DateTime, Interval } from "luxon";
import { Text } from "native-base";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, SafeAreaView, View } from "react-native";
import { CalendarList, CalendarUtils, DateData } from "react-native-calendars";

import { log, universalCatch } from "../../../../common/logging";
import { useFirebase, useLoading } from "../../../../context";
import { ParsedFirestoreEvent, ParsedFirestoreEventWithInterval, doesEventHaveInterval, isRawFirestoreEvent, parseFirestoreEvent } from "../../../../types/FirestoreEvent";

// Moved the current date check to inside the component in case someone keeps the app open for a long time or if it doesn't update
// Code the is placed in "module scope" (outside of the component) will run only when the file is imported for the first time
// That is why you usually only want to put true constants and function or class definitions there, because they should never change
const dateFormat = "yyyy-MM-dd";

const EventListScreen = () => {
  // The useLoading hook is a custom hook defined in the context folder that automatically shows a loading spinner if any of the loading states are true
  // This makes it easy to show a loading spinner when the app is waiting for data from the server or something
  const [ , setRefreshing ] = useLoading("event-list-screen-refreshing");

  // This is where I moved the current date check, I set it to startOf("minute") just so it doesn't change super frequently (shouldn't matter though)
  const now = DateTime.local().startOf("minute");

  const {
    fbStorage, fbFirestore
  } = useFirebase();

  const [ events, setEvents ] = useState<ParsedFirestoreEvent[]>([]);

  const [ selected, setSelected ] = useState(now.toFormat(dateFormat));
  const [ monthEvents, setMonthEvents ] = useState<ParsedFirestoreEventWithInterval[]>([]);

  // I also removed a bunch of hooks you weren't using, some may need to be added back alter but eh

  // Try to use unknown instead of any just to be clear about what you're expecting
  const getDate = useCallback((count: number): unknown => {
    const date = now.toJSDate();
    const newDate = date.setDate(date.getDate() + count);
    return CalendarUtils.getCalendarDateString(newDate);
  }, [now]);

  const onDayPress = useCallback((day: DateData) => {
    setSelected(day.dateString);
  }, []);

  const onMonthChange = useCallback((month: DateData) => {
    const newEvents: ParsedFirestoreEventWithInterval[] = [];
    // I didn't change it, but why not use month.month and month.year instead of parsing the date string?
    const newMonth = new Date(month.dateString);
    // The doesEventHaveInterval is a special kind of function called a type guard
    // Type guards are functions that return a boolean and narrow the type of a variable
    // In this case, it narrows the type of event to ParsedFirestoreEventWithInterval
    // which is just a ParsedFirestoreEvent where we know that the interval property is not undefined
    events.filter(doesEventHaveInterval).forEach((event) => {
      const eventDate = event.interval.start;
      if ((eventDate.month - 1) === newMonth.getMonth() && eventDate.year === newMonth.getFullYear()) {
        newEvents.push(event);
      }
    });
    setMonthEvents(newEvents);
  }, [events]);

  const marked = useMemo(() => {
    // TODO: Ok, so here what we need to do is get just the events that are in the current month, and then mark them on the calendar
    // I would probably just iterate over monthEvents and then add the event to the marked object
    /*
    Something like:
    const marked = {};
    for (const event of monthEvents) {
      marked[event.interval.start.toFormat(dateFormat)] = { marked: true };
    }
    marked[selected] = { selected: true };
    marked[now.toFormat(dateFormat)] = { today: true };
    return marked;
    */
    return {
      [String(getDate(0))]: {
        dotColor: "red",
        marked: true
      },
      [selected]: {
        selected: true,
        disableTouchEvent: true,
        selectedColor: "orange",
        selectedTextColor: "red"
      }
    };
  }, [ getDate, selected ]);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      log("Loading event list screen from firestore");
      const firestoreEvents: ParsedFirestoreEvent[] = [];
      const snapshot = await fbFirestore.collection("events")
        .get();
      await Promise.all(snapshot.docs.map(async (doc) => {
        const data = doc.data();
        // This is another one of those type guards, the data we get back from firestore SHOULD be a RawFirestoreEvent
        // But that relies on me not having made any mistakes in the code, and that is not happening, hence the check
        if (isRawFirestoreEvent(data)) {
          firestoreEvents.push(await parseFirestoreEvent(data, fbStorage));
        }
      }));

      log(`Loaded event list screen from firestore: ${ JSON.stringify(firestoreEvents)}`);
      setEvents(firestoreEvents);
    } catch (error) {
      universalCatch(error);
    } finally {
      setRefreshing(false);
    }
  }, [
    fbFirestore, fbStorage, setRefreshing
  ]);

  useEffect(() => {
    refresh().catch(universalCatch);
  }, [
    fbFirestore, fbStorage, refresh
  ]);

  /**
   * Splits *events* into *today* and *upcoming* based on the events' start day
   */
  useEffect(() => {
    // Are you still using this code? If not feel free to delete it.
    const todayFromEvents: ParsedFirestoreEventWithInterval[] = [];
    const upcomingFromEvents: ParsedFirestoreEventWithInterval[] = [];
    events.filter(doesEventHaveInterval).forEach((event) => {
      if (event.interval.overlaps(Interval.fromDateTimes(DateTime.local().startOf("day"), DateTime.local().endOf("day")))) {
        todayFromEvents.push(event);
      } else {
        upcomingFromEvents.push(event);
      }
    });
    log(`Split events into today and upcoming: ${ JSON.stringify(todayFromEvents)}/n ${ JSON.stringify(upcomingFromEvents)}`);
  }, [events]);

  /**
   * Called by React Native when rendering the screen
   */
  return (
    <SafeAreaView style={{ display: "flex", flexDirection: "column", height: "100%", width: "100%" }}>
      <CalendarList
        current={now.toFormat(dateFormat)}
        onDayPress={onDayPress}
        markedDates={marked}
        horizontal
        pagingEnabled
        hideArrows = {false}
        theme = {{ arrowColor: "#0033A0" }}
        onMonthChange={onMonthChange}
      />
      <View style = {{ height: 1, width: "100%", backgroundColor: "gray" }}></View>
      <FlatList
        data={monthEvents}
        style = {{ backgroundColor: "white" }}
        renderItem = { ({ item }) => (
          <View style= {{ flexDirection: "row", flex: 1, height: 80 }}>
            <View style = {{ flexDirection: "row", height: 80, width: 80 }}>
              <View style = {{ width: 78, height: 80, top: 10 }}>
                <Text style = {{ alignSelf: "center", fontSize: 12, color: "#101223" }}> { item.interval.start.weekdayShort } </Text>
                <Text style = {{ alignSelf: "center", fontSize: 32, color: "#101223", fontWeight: "bold", paddingTop: 10 }}> { item.interval.end.day } </Text>
              </View>
              <View style = {{ width: 2, backgroundColor: "#0033A0", alignSelf: "flex-start", height: 70, top: 5 }}/>
            </View>
            <View style = {{ backgroundColor: "#D6DBE6", height: 70, top: 5, borderBottomRightRadius: 10, borderTopRightRadius: 10, width: 320 }}>
              <Text style= {{ fontSize: 16, fontWeight: "bold" }}> {item.title} </Text>
            </View>
          </View>
        )}
      />

    </SafeAreaView> );
};


export default EventListScreen;
