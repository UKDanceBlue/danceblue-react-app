import { DownloadableImage, FirestoreEvent } from "@ukdanceblue/db-app-common";
import { Column, Divider, Text } from "native-base";
import { useEffect, useRef, useState } from "react";
import { FlatList } from "react-native";
import { DateData, MarkedDates } from "react-native-calendars/src/types";

import { universalCatch } from "../../../../common/logging";

import Calendar from "./Calendar";
import { EventListRenderItem } from "./EventListRenderItem";

export const EventListPage = ({
  monthString, eventsByMonth, marked, refresh, refreshing, tryToNavigate, downloadableImages
}: {
  monthString: string;
  eventsByMonth: Partial<Record<string, FirestoreEvent[]>>;
  marked: MarkedDates;
  refresh: () => Promise<void>;
  refreshing: boolean;
  tryToNavigate: (event: FirestoreEvent) => void;
  downloadableImages:Partial<Record<string, DownloadableImage>>;
}) => {
  const [ selectedDay, setSelectedDay ] = useState<DateData>();
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
    const index = selectedDay?.dateString ? dayIndexes.current[selectedDay.dateString] : undefined;
    if (index === 0) {
      // Not sure why, but scrollToIndex doesn't work if the index is 0
      eventsListRef.current?.scrollToOffset({ offset: 0, animated: true });
    } else if (index != null) {
      eventsListRef.current?.scrollToIndex({
        animated: true,
        index,
      });
    }
  }, [selectedDay?.dateString]);

  const markedWithSelected = { ...marked };
  if (selectedDay?.dateString) {
    markedWithSelected[selectedDay.dateString] = {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      ...(markedWithSelected[selectedDay.dateString] ?? {}),
      selected: true,
    };
  }

  return (
    <Column width="full" height="full">
      <Calendar
        current={monthString}
        markedDates={markedWithSelected}
        hideExtraDays
        hideArrows
        theme={{ arrowColor: "#0032A0", textMonthFontWeight: "bold", textMonthFontSize: 20, textDayFontWeight: "bold", textDayHeaderFontWeight: "500" }}
        displayLoadingIndicator={refreshing}
        onDayPress={setSelectedDay}
        style={{ width: "100%" }}
        disableAllTouchEventsForDisabledDays
      />
      <Divider height={"1"} backgroundColor="blue.400" />
      <FlatList
        ref={(list) => eventsListRef.current = list}
        data={ eventsByMonth[monthString] ?? [] }
        ListEmptyComponent={<Text style={{ textAlign: "center", marginTop: 20 }}>No events this month</Text>}
        initialScrollIndex={selectedDay?.dateString ? (dayIndexes.current[selectedDay.dateString] ?? 0) : 0}
        extraData={selectedDay}
        style = {{ backgroundColor: "white", width: "100%" }}
        renderItem = {({
          item, index
        }) => (<EventListRenderItem
          item={item}
          index={index}
          dayIndexesRef={dayIndexes}
          tryToNavigate={tryToNavigate}
          downloadableImage={item.images?.[0] ? downloadableImages[item.images[0].uri] : undefined}
        />)}
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
