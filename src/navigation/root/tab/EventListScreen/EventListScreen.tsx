import FirestoreModule from "@react-native-firebase/firestore";
import { FirestoreEvent } from "@ukdanceblue/db-app-common";
import { DateTime, Interval } from "luxon";
import { Divider } from "native-base";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, ListRenderItem, SafeAreaView, View } from "react-native";
import { CalendarList, DateData } from "react-native-calendars";
import { MarkedDates } from "react-native-calendars/src/types";

import EventRow from "../../../../common/components/EventRow";
import { universalCatch } from "../../../../common/logging";
import { timestampToDateTime } from "../../../../common/util/dateTools";
import { useFirebase, useLoading } from "../../../../context";

// That is why you usually only want to put true constants and function or class definitions there, because they should never change
const dateFormat = "yyyy-MM-dd";
const dateFormatWithoutDay = "yyyy-MM";

export const splitEvents = (events: FirestoreEvent[]) => {
  const newEvents: Partial<Record<string, FirestoreEvent[]>> = {};

  events
    .filter(
      (e): e is (typeof e & { interval: NonNullable<typeof e.interval> }) => e.interval != null
    )
    .forEach((event) => {
      const eventDate: DateTime = timestampToDateTime(event.interval.start);
      const eventDateString = eventDate.toFormat(dateFormatWithoutDay);

      if (newEvents[eventDateString] == null) {
        newEvents[eventDateString] = [event];
      } else {
        newEvents[eventDateString]?.push(event);
      }
    });

  return newEvents;
};

export const markEvents = (events: FirestoreEvent[], todayDateString: string) => {
  const marked: MarkedDates = {};

  let hasAddedToday = false;

  for (const event of events) {
    if (event.interval != null) {
      const eventDate: DateTime = timestampToDateTime(event.interval.start);
      const formattedDate = eventDate.toFormat(dateFormat);

      marked[formattedDate] = {
        marked: true,
        today: formattedDate === todayDateString,
      };
      if (formattedDate === todayDateString) {
        hasAddedToday = true;
      }
    }
  }

  // If we didn't add today or selected day already, we need to add them manually
  if (!hasAddedToday) {
    marked[todayDateString] = { today: true };
  }
  return marked;
};

const EventListScreen = () => {
  // Get a reference to the Firebase database
  const { fbFirestore } = useFirebase();

  // Events
  const [ refreshing, setRefreshing ] = useLoading("event-list-screen-refreshing");
  const [ events, setEvents ] = useState<FirestoreEvent[]>([]);

  // Today
  const todayDateTime = DateTime.local().startOf("minute");
  const todayDateTimeString = todayDateTime.toFormat(dateFormat);
  const todayDateTimeMillis = todayDateTime.toMillis();
  const todayDateData: DateData = useMemo(() => ({
    dateString: todayDateTimeString,
    day: todayDateTime.day,
    month: todayDateTime.month,
    year: todayDateTime.year,
    timestamp: todayDateTimeMillis
  }), [
    todayDateTimeString, todayDateTime.day, todayDateTime.month, todayDateTime.year, todayDateTimeMillis
  ]);

  // Calendar selection
  const [ selectedMonth, setSelectedMonth ] = useState<DateData>(todayDateData);
  const [ selectedDay, setSelectedDay ] = useState<DateData>(todayDateData);

  // Earliest date to load (so we don't waste reads on events from 3 years ago)
  const earliestTimestamp = useMemo(() => {
    const defaultEarliest = todayDateTime.minus({ months: 4 }).toMillis();
    const twoMonthsBeforeSelected = DateTime.fromMillis(selectedMonth.timestamp).minus({ months: 2 }).toMillis();
    return Math.min(defaultEarliest, twoMonthsBeforeSelected);
  }, [ selectedMonth.timestamp, todayDateTime ]);

  const refresh = useCallback(async () => {
    console.log("Refreshing events");
    setRefreshing(true);
    try {
      const firestoreEvents: FirestoreEvent[] = [];
      const snapshot = await fbFirestore
        .collection("events")
        .where("interval.start", ">=", FirestoreModule.Timestamp.fromMillis(earliestTimestamp))
        .orderBy("interval.start", "asc")
        .get();

      for (const doc of snapshot.docs) {
        const data = doc.data();
        if (FirestoreEvent.isValidJson(data)) {
          firestoreEvents.push(FirestoreEvent.fromJson(data));
        }
      }

      setEvents(firestoreEvents);
    } catch (error) {
      universalCatch(error);
    } finally {
      setRefreshing(false);
    }
  }, [
    earliestTimestamp, fbFirestore, setRefreshing
  ]);

  useEffect(() => {
    // This will run when refresh changes (WHICH IT DOES) when the selected month gets close to the earliest date we load be default
    refresh().catch(universalCatch);
  }, [refresh]);

  const eventsByMonth = useMemo(() => splitEvents(events), [events]);

  const marked = useMemo(() => markEvents(events, todayDateData.dateString), [ events, todayDateData.dateString ]);
  const markedAndSelected = useMemo(() => addSelectedToMarkedDates(marked, selectedDay), [ marked, selectedDay ]);

  const renderItem: ListRenderItem<FirestoreEvent> = ({ item: thisEvent }) => (
    <EventRow
      title={thisEvent.name}
      blurb={thisEvent.shortDescription}
      imageSource={thisEvent.images?.[0]}
      interval={thisEvent.interval ? Interval.fromDateTimes(timestampToDateTime(thisEvent.interval.start), timestampToDateTime(thisEvent.interval.end)).toISO() : undefined}
    />
  );

  /*
   * Called by React Native when rendering the screen
   */
  return (
    <SafeAreaView style={{ display: "flex", flexDirection: "column", height: "100%", width: "100%" }}>
      <CalendarList
        current={todayDateData.dateString}
        markedDates={markedAndSelected}
        horizontal
        pagingEnabled
        hideArrows={false}
        theme={{ arrowColor: "#0032A0", textMonthFontWeight: "bold", textMonthFontSize: 20, textDayFontWeight: "bold", textDayHeaderFontWeight: "500" }}
        onMonthChange={setSelectedMonth}
        displayLoadingIndicator={refreshing}
        onDayPress={setSelectedDay}
      />
      <Divider height={1} />
      <FlatList
        data={eventsByMonth[DateTime.fromObject({
          year: selectedMonth.year,
          month: selectedMonth.month,
        }).toFormat(dateFormatWithoutDay)] ?? []}
        style = {{ backgroundColor: "white" }}
        renderItem = {renderItem}
        refreshing={refreshing}
        onRefresh={refresh}
      />
    </SafeAreaView> );
};

export default EventListScreen;
function addSelectedToMarkedDates(marked: MarkedDates, selectedDay: DateData) {
  const markedAndSelected = { ...marked };

  markedAndSelected[selectedDay.dateString] = {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    ...(markedAndSelected[selectedDay.dateString] ?? {}),
    selected: true,
  };
  return markedAndSelected;
}

