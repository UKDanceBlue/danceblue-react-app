import FirestoreModule from "@react-native-firebase/firestore";
import { FirestoreEvent } from "@ukdanceblue/db-app-common";
import { DateTime } from "luxon";
import { Center, Spinner } from "native-base";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SafeAreaView, View } from "react-native";
import { DateData } from "react-native-calendars";
import PagerView from "react-native-pager-view";

import { universalCatch } from "../../../../common/logging";
import { useFirebase } from "../../../../context";

import { EventListPage } from "./EventListPage";
import { dateDataToLuxonDateTime, dateFormat, luxonDateTimeToDateData, luxonDateTimeToMonthString, markEvents, splitEvents } from "./utils";

const EventListScreen = () => {
  // Get external references
  const { fbFirestore } = useFirebase();

  // Events
  const [ refreshing, setRefreshing ] = useState(false);
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
  const pagerRef = useRef<PagerView | null>(null);
  const [ selectedDay, setSelectedDay ] = useState<DateData>({
    dateString: todayDateString.current,
    day: todayDate.current.day,
    month: todayDate.current.month,
    year: todayDate.current.year,
    timestamp: todayDate.current.toMillis(),
  });

  // Earliest date to load (so we don't waste reads on events from 3 years ago)
  const lastEarliestTimestamp = useRef<DateTime>();
  const earliestTimestamp = useMemo(() => {
    const defaultEarliest = todayDate.current.minus({ months: 6 });
    const twoMonthsBeforeSelected = DateTime.fromFormat(selectedMonth.dateString, dateFormat).minus({ months: 4 });
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
      .where("interval.start", "<=", FirestoreModule.Timestamp.fromMillis(earliestTimestamp.plus({ months: 7 }).toMillis()))
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
    for (let i = 0; i < 7; i++) {
      const month = startMonth.plus({ months: i });
      months.push(month);
    }
    return months;
  }, [selectedMonth]);

  const marked = useMemo(() => markEvents(events, todayDateString.current, selectedDay.dateString), [ events, selectedDay.dateString ]);

  /*
   * Called by React Native when rendering the screen
   */
  return (
    <SafeAreaView style={{ display: "flex", flexDirection: "column", height: "100%", width: "100%" }}>
      <PagerView
        onPageSelected={(event) => {
          // 0 is a loading screen
          if (event.nativeEvent.position !== 0 && shownMonths.length > 0) {
            const index = event.nativeEvent.position - 1;
            if (shownMonths[index]) {
              const month = shownMonths[index];
              const monthDateData = luxonDateTimeToDateData(month);
              if (monthDateData.dateString !== selectedMonth.dateString) {
                setSelectedMonth(monthDateData);
              }
            } else {
              const month = shownMonths[Math.floor(shownMonths.length / 2)];
              const monthDateData = luxonDateTimeToDateData(month);
              setSelectedMonth(monthDateData);
            }
          }
        }}
        initialPage={2}
        showPageIndicator
        style={{ height: "100%", width: "100%" }}
        ref={(ref) => {
          pagerRef.current = ref;
        }}
      >
        <View key="left-end-loading" style={{ height: "100%", width: "100%" }} collapsable={false}>
          <Center width="100%" height="100%">
            <Spinner size="lg" />
          </Center>
        </View>
        {shownMonths.map((month) => (
          <View key={luxonDateTimeToMonthString(month)} style={{ height: "100%", width: "100%" }} collapsable={false}>
            <EventListPage
              eventsByMonth={eventsByMonth}
              selectedDay={selectedDay}
              setSelectedDay={setSelectedDay}
              marked={marked}
              refreshing={refreshing}
              refresh={() => refresh(earliestTimestamp)}
              monthString={luxonDateTimeToMonthString(month)}
            />
          </View>
        ))}
        <View key="right-end-loading" style={{ height: "100%", width: "100%" }} collapsable={false}>
          <Center width="100%" height="100%">
            <Spinner size="lg" />
          </Center>
        </View>
      </PagerView>
    </SafeAreaView> );
};

export default EventListScreen;
