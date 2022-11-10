import { FirestoreEvent } from "@ukdanceblue/db-app-common";
import { Column, Divider, Text } from "native-base";
import { useEffect, useRef, useState } from "react";
import { FlatList } from "react-native";
import { Calendar } from "react-native-calendars";
import { DateData, MarkedDates } from "react-native-calendars/src/types";

import { universalCatch } from "../../../../common/logging";

import { EventListRenderItem } from "./EventListRenderItem";

export const EventListPage = ({
  monthString, eventsByMonth, marked, refresh, refreshing, setSelectedDay, selectedDay, tryToNavigate
}: {
  monthString: string;
  eventsByMonth: Partial<Record<string, FirestoreEvent[]>>;
  marked: MarkedDates;
  refresh: () => Promise<void>;
  refreshing: boolean;
  setSelectedDay: (value: DateData) => void;
  selectedDay: DateData;
  tryToNavigate: (event: FirestoreEvent) => void;
}) => {
  // Scroll-to-day functionality
  const eventsListRef = useRef<FlatList<FirestoreEvent> | null>(null);
  const dayIndexes = useRef<Partial<Record<string, number>>>({});
  dayIndexes.current = {};

  const [ refreshingManually, setRefreshingManually ] = useState(false);
  useEffect(() => {
    if (refreshingManually && !refreshing) {
      setRefreshingManually(false);
    }
  }, [ refreshingManually, refreshing ]);

  useEffect(() => {
    if (dayIndexes.current[selectedDay.dateString]) {
      eventsListRef.current?.scrollToIndex({
        animated: true,
        index: dayIndexes.current[selectedDay.dateString] ?? 0,
      });
    }
  }, [selectedDay.dateString]);

  return (
    <Column width="full" height="full">
      <Calendar
        current={monthString}
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
        data={ eventsByMonth[monthString] ?? [] }
        ListEmptyComponent={<Text style={{ textAlign: "center", marginTop: 20 }}>No events this month</Text>}
        initialScrollIndex={dayIndexes.current[selectedDay.dateString] ?? 0}
        extraData={selectedDay}
        style = {{ backgroundColor: "white", width: "100%", height: "49.5%" }}
        renderItem = {({
          item, index, separators
        }) => (<EventListRenderItem
          item={item}
          index={index}
          separators={separators}
          dayIndexesRef={dayIndexes}
          tryToNavigate={tryToNavigate}/>)}
        refreshing={refreshingManually}
        onRefresh={() => {
          setRefreshingManually(true);
          refresh().catch(universalCatch).finally(() => setRefreshingManually(false));
        }}
        onScrollToIndexFailed={console.error}
      />
    </Column>
  );
};
