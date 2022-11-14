import { useNavigation } from "@react-navigation/native";
import { DateTime } from "luxon";
import { Center, Spinner } from "native-base";
import { useMemo, useRef, useState } from "react";
import { SafeAreaView, View } from "react-native";
import { NativeViewGestureHandler } from "react-native-gesture-handler";
import PagerView from "react-native-pager-view";

import { EventListPage } from "./EventListPage";
import { LOADED_MONTHS, LOADED_MONTHS_BEFORE_AFTER } from "./constants";
import { luxonDateTimeToDateString, luxonDateTimeToMonthString, useEvents } from "./eventListUtils";

const EventListScreen = () => {
  // Today
  const todayDate = useRef(DateTime.local().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }));
  todayDate.current = DateTime.local().set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
  const todayDateString = useRef(luxonDateTimeToDateString(todayDate.current));
  todayDateString.current = luxonDateTimeToDateString(todayDate.current);

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

  // Navigation
  const { navigate } = useNavigation();

  const [
    markedDates,
    eventsByMonth,
    downloadableImages,
    refreshing,
    refresh,
  ] = useEvents({ earliestTimestamp, todayDateString });

  /*
   * Called by React Native when rendering the screen
   */
  return (
    <SafeAreaView style={{ display: "flex", flexDirection: "column", height: "100%", width: "100%" }}>
      <NativeViewGestureHandler
        disallowInterruption>
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
        >
          {monthDates.map(
            (month, index) => (
              (index > 0 && index < LOADED_MONTHS - 1)
                ? (
                  <View key={luxonDateTimeToMonthString(month)} style={{ height: "100%", width: "100%" }} collapsable={false}>
                    <EventListPage
                      eventsByMonth={eventsByMonth}
                      marked={markedDates}
                      refreshing={refreshing}
                      refresh={() => refresh()}
                      monthString={luxonDateTimeToMonthString(month)}
                      tryToNavigate={(eventToNavigateTo) => navigate("Event", { event: eventToNavigateTo })}
                      downloadableImages={downloadableImages}
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
      </NativeViewGestureHandler>
    </SafeAreaView> );
};

export default EventListScreen;
