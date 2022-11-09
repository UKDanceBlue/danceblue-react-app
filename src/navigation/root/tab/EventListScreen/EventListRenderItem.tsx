import { useNavigation } from "@react-navigation/native";
import { FirestoreEvent } from "@ukdanceblue/db-app-common";
import { Interval } from "luxon";
import { Pressable } from "native-base";
import { MutableRefObject } from "react";
import { ListRenderItem } from "react-native";
import PagerView from "react-native-pager-view";

import EventRow from "../../../../common/components/EventRow";
import { timestampToDateTime } from "../../../../common/util/dateTools";

import { dateFormat } from "./utils";

export const EventListRenderItem = ({
  item: thisEvent, index, dayIndexesRef, pagerViewRef
}: Parameters<ListRenderItem<FirestoreEvent>>[0] & { dayIndexesRef: MutableRefObject<Partial<Record<string, number>>>; pagerViewRef: MutableRefObject<PagerView | null> }) => {
  const { navigate } = useNavigation();

  if (thisEvent.interval != null) {
    const eventDate = timestampToDateTime(thisEvent.interval.start).toFormat(dateFormat);
    if (!((dayIndexesRef.current[eventDate] ?? NaN) > index)) {
      dayIndexesRef.current[eventDate] = index;
    }
  }
  return (
    <Pressable
      _pressed={{ opacity: 0.5 }}
      onPress={() => {
        pagerViewRef.current?.setScrollEnabled(false);
        navigate("Event", { event: thisEvent });
      }}
      unstable_pressDelay={200}
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

