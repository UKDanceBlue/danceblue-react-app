import { useFocusEffect } from "@react-navigation/native";
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
import { LOADED_MONTHS, LOADED_MONTHS_BEFORE_AFTER } from "./constants";
import { dateFormat, getRefreshFunction, luxonDateTimeToMonthString, markEvents, splitEvents } from "./utils";

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
  /*
  Assuming LOADED_MONTHS is 5:
  0 - Static loading screen
  1,2,3,4,5, - Calendar pages
  6 - Static loading screen
  */
  const [ selectedMonth, setSelectedMonth ] = useState<DateTime>(todayDate.current);
  const monthDates = useMemo(() => {
    const monthDates = [];
    for (let i = -LOADED_MONTHS_BEFORE_AFTER; i <= LOADED_MONTHS_BEFORE_AFTER; i++) {
      monthDates.push(selectedMonth.plus({ month: i }));
    }
    return monthDates;
  }, [selectedMonth]);
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
    const newEarliestTimestamp = selectedMonth.minus({ months: LOADED_MONTHS_BEFORE_AFTER }); // For example, if selectedMonth is 2021-05-01, then twoMonthsBeforeSelected is 2021-03-01
    if (lastEarliestTimestamp.current == null || !newEarliestTimestamp.equals(lastEarliestTimestamp.current)) {
      lastEarliestTimestamp.current = newEarliestTimestamp;
      return newEarliestTimestamp;
    } else {
      return lastEarliestTimestamp.current;
    }
  }, [selectedMonth]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const refresh = useCallback(getRefreshFunction(setRefreshing, disableRefresh, fbFirestore, setEvents), [
    fbFirestore, setRefreshing, setEvents
  ]);

  useEffect(() => {
    if (!disableRefresh.current) {
      refresh(earliestTimestamp).catch(universalCatch);
    }
  }, [ earliestTimestamp, refresh ]);

  const eventsByMonth = useMemo(() => splitEvents(events), [events]);

  const marked = useMemo(() => markEvents(events, todayDateString.current, selectedDay.dateString), [ events, selectedDay.dateString ]);

  // Re-enable horizontal scrolling when we go to this page after it was disabled when navigating
  useFocusEffect(
    useCallback(() => {
      pagerRef.current?.setScrollEnabled(true);
    }, [])
  );

  /*
   * Called by React Native when rendering the screen
   */
  return (
    <SafeAreaView style={{ display: "flex", flexDirection: "column", height: "100%", width: "100%" }}>
      <PagerView
        onPageSelected={(event) => {
          // 0 is a loading screen
          const index = event.nativeEvent.position;
          if (monthDates[index]) {
            if (index > 0 && index < LOADED_MONTHS - 1) {
              const month = monthDates[index];
              if (!(month.startOf("month").equals(selectedMonth.startOf("month")))) {
                setSelectedMonth(month);
              }
            }
          } else {
            const month = monthDates[Math.floor(monthDates.length / 2)];
            if (month as typeof monthDates[number] | undefined) {
              setSelectedMonth(month);
            }
          }
        }}
        initialPage={2}
        // showPageIndicator
        style={{ height: "100%", width: "100%" }}
        ref={(ref) => {
          pagerRef.current = ref;
        }}
        onMoveShouldSetResponderCapture={() => true}
        onStartShouldSetResponder={() => true}
      >
        {monthDates.map(
          (month, index) => (
            (index > 0 && index < LOADED_MONTHS - 1)
              ? (
                <View key={luxonDateTimeToMonthString(month)} style={{ height: "100%", width: "100%" }} collapsable={false}>
                  <EventListPage
                    eventsByMonth={eventsByMonth}
                    selectedDay={selectedDay}
                    setSelectedDay={setSelectedDay}
                    marked={marked}
                    refreshing={refreshing}
                    refresh={() => refresh(earliestTimestamp)}
                    monthString={luxonDateTimeToMonthString(month)}
                    pagerViewRef={pagerRef}
                  />
                </View>
              )
              : (
                <View key={luxonDateTimeToMonthString(month)} style={{ height: "100%", width: "100%" }} collapsable={false}>
                  <Center width="100%" height="100%">
                    <Spinner size="lg" />
                  </Center>
                </View>
              )
          )
        )}
      </PagerView>
    </SafeAreaView> );
};

export default EventListScreen;
