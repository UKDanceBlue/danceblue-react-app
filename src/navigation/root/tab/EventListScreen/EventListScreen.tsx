import FirestoreModule from "@react-native-firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { FirestoreEvent } from "@ukdanceblue/db-app-common";
import { noop } from "lodash";
import { DateTime, Interval } from "luxon";
import { Divider, Pressable } from "native-base";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FlatList, ListRenderItem, SafeAreaView } from "react-native";
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
  // Get external references
  const { fbFirestore } = useFirebase();
  const { navigate } = useNavigation();

  // Events
  const [ refreshing, setRefreshing ] = useLoading("event-list-screen-refreshing");
  const [ events, setEvents ] = useState<FirestoreEvent[]>([]);

  // Today
  const todayDate = DateTime.local().set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
  const todayDateString = todayDate.toFormat(dateFormat);
  const todayDateMillis = todayDate.toMillis();
  const todayDateData: DateData = useMemo(() => ({
    dateString: todayDateString,
    day: todayDate.day,
    month: todayDate.month,
    year: todayDate.year,
    timestamp: todayDateMillis
  }), [
    todayDateString, todayDate.day, todayDate.month, todayDate.year, todayDateMillis
  ]);

  // Calendar selection
  const [ selectedMonth, setSelectedMonth ] = useState<DateData>(todayDateData);
  const [ selectedDay, setSelectedDay ] = useState<DateData>(todayDateData);

  // Scroll-to-day functionality
  const eventsListRef = useRef<FlatList<FirestoreEvent> | null>(null);
  const dayIndexes = useRef<Partial<Record<string, number>>>({});
  dayIndexes.current = {};

  useEffect(() => {
    if (dayIndexes.current[selectedDay.dateString]) {
      eventsListRef.current?.scrollToIndex({
        animated: true,
        index: dayIndexes.current[selectedDay.dateString] ?? 0,
      });
    }
  }, [selectedDay]);

  // Earliest date to load (so we don't waste reads on events from 3 years ago)
  const earliestTimestamp = useMemo(() => {
    const defaultEarliest = todayDate.minus({ months: 4 }).toMillis();
    const twoMonthsBeforeSelected = DateTime.fromMillis(selectedMonth.timestamp).minus({ months: 2 }).toMillis();
    return Math.min(defaultEarliest, twoMonthsBeforeSelected);
  }, [ selectedMonth.timestamp, todayDate ]);

  const refresh = useCallback(async () => {
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

  const RenderItem: ListRenderItem<FirestoreEvent> = ({
    item: thisEvent, index
  }: Parameters<ListRenderItem<FirestoreEvent>>[0]) => {
    if (thisEvent.interval != null) {
      const eventDate = timestampToDateTime(thisEvent.interval.start).toFormat(dateFormat);
      if (!((dayIndexes.current[eventDate] ?? NaN) > index)) {
        dayIndexes.current[eventDate] = index;
      }
    }
    return (
      <Pressable
        _pressed={{ opacity: 0.5 }}
        onPress={() => navigate("Event", { event: thisEvent })}
      >
        <EventRow
          title={thisEvent.name}
          blurb={thisEvent.shortDescription}
          imageSource={thisEvent.images?.[0]}
          interval={thisEvent.interval ? Interval.fromDateTimes(timestampToDateTime(thisEvent.interval.start), timestampToDateTime(thisEvent.interval.end)).toISO() : undefined}
        />
      </Pressable>
    );
  };

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
        onMonthChange={(monthDateData) => setSelectedMonth(monthDateData)}
        displayLoadingIndicator={refreshing}
        onDayPress={(dateData) => setSelectedDay(dateData)}
      />
      <Divider height={1} />
      <FlatList
        ref={(list) => eventsListRef.current = list}
        data={eventsByMonth[DateTime.fromObject({
          year: selectedMonth.year,
          month: selectedMonth.month,
        }).toFormat(dateFormatWithoutDay)] ?? []}
        extraData={selectedMonth}
        style = {{ backgroundColor: "white" }}
        renderItem = {RenderItem}
        refreshing={refreshing}
        onRefresh={refresh}
        onScrollToIndexFailed={noop}
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

