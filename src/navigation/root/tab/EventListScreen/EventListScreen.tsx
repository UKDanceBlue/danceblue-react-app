// I removed some unnecessary imports up here
import { FirestoreEvent } from "@ukdanceblue/db-app-common";
import { DateTime, Interval } from "luxon";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, ListRenderItem, SafeAreaView, View } from "react-native";
import { CalendarList, DateData } from "react-native-calendars";
import { MarkedDates } from "react-native-calendars/src/types";

import EventRow from "../../../../common/components/EventRow";
import { universalCatch } from "../../../../common/logging";
import { timestampToDateTime } from "../../../../common/util/dateTools";
import { useFirebase, useLoading } from "../../../../context";

// const getCalendarDateString = CalendarUtils.getCalendarDateString as (date?: Parameters<typeof CalendarUtils.getCalendarDateString>[0]) => string | undefined;

// Moved the current date check to inside the component in case someone keeps the app open for a long time or if it doesn't update
// Code the is placed in "module scope" (outside of the component) will run only when the file is imported for the first time
// That is why you usually only want to put true constants and function or class definitions there, because they should never change
const dateFormat = "yyyy-MM-dd";
const dateFormatWithoutDay = "yyyy-MM";

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

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const firestoreEvents: FirestoreEvent[] = [];
      const snapshot = await fbFirestore
        .collection("events")
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
  }, [ fbFirestore, setRefreshing ]);

  useEffect(() => {
    // Only do this on first load
    if (events.length === 0) {
      refresh().catch(universalCatch);
    }
  }, [ events.length, refresh ]);

  const eventsByMonth = useMemo(() => {
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
        // We can use '!.push' because we know that the array exists thanks to the nullish check above
          newEvents[eventDateString]?.push(event);
        }
      });

    return newEvents;
  }, [events]);

  const marked = useMemo(() => {
    const marked: MarkedDates = {};

    let hasAddedToday = false;

    for (const event of events) {
      if (event.interval != null) {
        const eventDate: DateTime = timestampToDateTime(event.interval.start);
        const formattedDate = eventDate.toFormat(dateFormat);

        marked[formattedDate] = {
          marked: true,
          today: formattedDate === todayDateData.dateString,
        };
        if (formattedDate === todayDateData.dateString) {
          hasAddedToday = true;
        }
      }
    }

    // If we didn't add today or selected day already, we need to add them manually
    if (!hasAddedToday) {
      marked[todayDateData.dateString] = { today: true };
    }
    return marked;
  }, [ events, todayDateData.dateString ]);

  const markedAndSelected = useMemo(() => {
    const markedAndSelected = { ...marked };

    markedAndSelected[selectedDay.dateString] = {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      ...(markedAndSelected[selectedDay.dateString] ?? {}),
      selected: true,
    };
    return markedAndSelected;
  }, [ marked, selectedDay ]);

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
      <View style = {{ height: 1, width: "100%", backgroundColor: "gray", paddingBottom: 20 }}/>
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
