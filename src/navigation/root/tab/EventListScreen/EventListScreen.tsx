import FirestoreModule from "@react-native-firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { FirestoreEvent } from "@ukdanceblue/db-app-common";
import { noop } from "lodash";
import { DateTime, Interval } from "luxon";
import { Column, Divider, Pressable, Text } from "native-base";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FlatList, ListRenderItem, SafeAreaView, View, useWindowDimensions } from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import { MarkedDates } from "react-native-calendars/src/types";
import PagerView from "react-native-pager-view";

import EventRow from "../../../../common/components/EventRow";
import { universalCatch } from "../../../../common/logging";
import { timestampToDateTime } from "../../../../common/util/dateTools";
import { useFirebase, useLoading } from "../../../../context";

const dateFormat = "yyyy-MM-dd";
const luxonDateTimeToDateString = (dateTime: DateTime): string => {
  return dateTime.toFormat(dateFormat);
};
const dateFormatWithoutDay = "yyyy-MM";
const luxonDateTimeToMonthString = (dateTime: DateTime): string => {
  return dateTime.toFormat(dateFormatWithoutDay);
};

// That is why you usually only want to put true constants and function or class definitions there, because they should never change
const luxonDateTimeToDateData = (dateTime: DateTime): DateData => {
  return {
    dateString: luxonDateTimeToDateString(dateTime),
    day: dateTime.day,
    month: dateTime.month,
    year: dateTime.year,
    timestamp: dateTime.toMillis(),
  };
};
const dateDataToLuxonDateTime = (dateData: DateData): DateTime => {
  return DateTime.fromObject({
    day: dateData.day,
    month: dateData.month,
    year: dateData.year,
  });
};

export const splitEvents = (events: FirestoreEvent[]) => {
  const newEvents: Partial<Record<string, FirestoreEvent[]>> = {};

  events
    .filter(
      (e): e is (typeof e & { interval: NonNullable<typeof e.interval> }) => e.interval != null
    )
    .forEach((event) => {
      const eventDate: DateTime = timestampToDateTime(event.interval.start);
      const eventMonthDateString = eventDate.toFormat(dateFormatWithoutDay);

      if (newEvents[eventMonthDateString] == null) {
        newEvents[eventMonthDateString] = [event];
      } else {
        newEvents[eventMonthDateString]?.push(event);
      }
    });

  return newEvents;
};

export const markEvents = (events: FirestoreEvent[], todayDateString: string, selectedDay: string) => {
  const marked: MarkedDates = {};

  let hasAddedToday = false;
  let hasAddedSelectedDay = false;

  for (const event of events) {
    if (event.interval != null) {
      const eventDate: DateTime = timestampToDateTime(event.interval.start);
      const formattedDate = eventDate.toFormat(dateFormat);

      marked[formattedDate] = {
        marked: true,
        today: formattedDate === todayDateString,
        selected: formattedDate === selectedDay,
      };
      if (formattedDate === todayDateString) {
        hasAddedToday = true;
      }
      if (formattedDate === selectedDay) {
        hasAddedSelectedDay = true;
      }
    }
  }

  // If we didn't add today or selected day already, we need to add them manually
  if (!hasAddedToday) {
    marked[todayDateString] = { today: true };
  }
  if (!hasAddedSelectedDay) {
    marked[selectedDay] = { selected: true };
  }

  return marked;
};

const EventListScreen = () => {
  // Get external references
  const { fbFirestore } = useFirebase();
  const { navigate } = useNavigation();
  const { width: screenWidth } = useWindowDimensions();

  // Events
  const [ refreshing, setRefreshing ] = useLoading("event-list-screen-refreshing");
  const disableRefresh = useRef(false);
  const [ events, setEvents ] = useState<FirestoreEvent[]>([]);

  // Today
  const todayDate = useRef(DateTime.local().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }));
  todayDate.current = DateTime.local().set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
  const todayDateString = useRef(todayDate.current.toFormat(dateFormat));
  todayDateString.current = todayDate.current.toFormat(dateFormat);

  // Calendar selection
  const [ selectedMonth, setSelectedMonth ] = useState<DateData>({
    dateString: todayDateString.current,
    day: todayDate.current.day,
    month: todayDate.current.month,
    year: todayDate.current.year,
    timestamp: todayDate.current.toMillis(),
  });
  const [ selectedDay, setSelectedDay ] = useState<DateData>({
    dateString: todayDateString.current,
    day: todayDate.current.day,
    month: todayDate.current.month,
    year: todayDate.current.year,
    timestamp: todayDate.current.toMillis(),
  });

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
  }, [selectedDay.dateString]);

  // Earliest date to load (so we don't waste reads on events from 3 years ago)
  const lastEarliestTimestamp = useRef<DateTime>();
  const earliestTimestamp = useMemo(() => {
    const defaultEarliest = todayDate.current.minus({ months: 4 });
    const twoMonthsBeforeSelected = DateTime.fromFormat(selectedMonth.dateString, dateFormat).minus({ months: 2 });
    const newEarliestTimestamp = DateTime.min(defaultEarliest, twoMonthsBeforeSelected);
    if (lastEarliestTimestamp.current == null || !newEarliestTimestamp.equals(lastEarliestTimestamp.current)) {
      lastEarliestTimestamp.current = newEarliestTimestamp;
      return newEarliestTimestamp;
    } else {
      return lastEarliestTimestamp.current;
    }
  }, [selectedMonth.dateString]);

  const refresh = useCallback( (earliestTimestamp: DateTime) => {
    setRefreshing(true);
    disableRefresh.current = true;
    const firestoreEvents: FirestoreEvent[] = [];
    return fbFirestore
      .collection("events")
      .where("interval.start", ">=", FirestoreModule.Timestamp.fromMillis(earliestTimestamp.toMillis()))
      .where("interval.start", "<=", FirestoreModule.Timestamp.fromMillis(earliestTimestamp.plus({ months: 5 }).toMillis()))
      .orderBy("interval.start", "asc")
      .get()
      .then((snapshot) => {
        for (const doc of snapshot.docs) {
          const data = doc.data();
          if (FirestoreEvent.isValidJson(data)) {
            firestoreEvents.push(FirestoreEvent.fromJson(data));
          }
        }

        setEvents(firestoreEvents);
      })
      .catch((error) => {
        universalCatch(error);
      })
      .finally(() => {
        setRefreshing(false);
        disableRefresh.current = false;
      });
  }, [ fbFirestore, setRefreshing ]);

  useEffect(() => {
    if (!disableRefresh.current) {
      refresh(earliestTimestamp).catch(universalCatch);
    }
  }, [ earliestTimestamp, refresh ]);

  const eventsByMonth = useMemo(() => splitEvents(events), [events]);

  // We need to get the five months surrounding the selected month
  const shownMonths = useMemo(() => {
    const months: DateTime[] = [];
    const startMonth = dateDataToLuxonDateTime(selectedMonth).minus({ months: 2 });
    for (let i = 0; i < 5; i++) {
      const month = startMonth.plus({ months: i });
      months.push(month);
    }
    return months;
  }, [selectedMonth]);

  const marked = useMemo(() => markEvents(events, todayDateString.current, selectedDay.dateString), [ events, selectedDay.dateString ]);

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

  console.log(shownMonths);

  /*
   * Called by React Native when rendering the screen
   */
  return (
    <SafeAreaView style={{ display: "flex", flexDirection: "column", height: "100%", width: "100%" }}>
      <PagerView
        onPageSelected={(event) => {
          const month = shownMonths[event.nativeEvent.position];
          const monthDateData = luxonDateTimeToDateData(month);
          if (monthDateData.dateString !== selectedMonth.dateString) {
            setSelectedMonth(monthDateData);
          }
        }}
        initialPage={2}
        showPageIndicator
        style={{ height: "100%", width: "100%" }}
      >
        {shownMonths.map((month) => (
          <View key={luxonDateTimeToMonthString(month)} style={{ height: "100%", width: "100%" }} collapsable={false}>
            <Column width={screenWidth} height="full">
              <Calendar
                current={month.toFormat(dateFormat)}
                markedDates={marked}
                pagingEnabled={false}
                hideArrows
                theme={{ arrowColor: "#0032A0", textMonthFontWeight: "bold", textMonthFontSize: 20, textDayFontWeight: "bold", textDayHeaderFontWeight: "500" }}
                displayLoadingIndicator={refreshing}
                onDayPress={(dateData) => setSelectedDay(dateData)}
                style={{ width: "100%", height: "49.5%" }}
              />
              <Divider height={"1%"} />
              <FlatList
                ref={(list) => eventsListRef.current = list}
                data={ eventsByMonth[luxonDateTimeToMonthString(month)] ??
                [
                  new FirestoreEvent("title", "", "", {
                    start: FirestoreModule.Timestamp.fromMillis(0),
                    end: FirestoreModule.Timestamp.fromMillis(100000000)
                  })
                ]}
                ListEmptyComponent={<Text style={{ textAlign: "center", marginTop: 20 }}>No events this month</Text>}
                initialScrollIndex={dayIndexes.current[selectedDay.dateString] ?? 0}
                extraData={selectedDay}
                style = {{ backgroundColor: "white", width: "100%", height: "49.5%" }}
                renderItem = {RenderItem}
                refreshing={refreshing}
                onRefresh={() => refresh(earliestTimestamp).catch(universalCatch)}
                onScrollToIndexFailed={noop}
              />
            </Column>
          </View>
        ))}
      </PagerView>
    </SafeAreaView> );
};

export default EventListScreen;
