import { FirestoreEvent } from "@ukdanceblue/db-app-common";
import { Interval } from "luxon";
import { MutableRefObject } from "react";
import { ListRenderItem, TouchableOpacity } from "react-native";

import EventRow from "../../../../common/components/EventRow";
import { timestampToDateTime } from "../../../../common/util/dateTools";

import { dateFormat } from "./utils";

export const EventListRenderItem = ({
  item: thisEvent, index, dayIndexesRef, tryToNavigate
}: Parameters<ListRenderItem<FirestoreEvent>>[0] & { dayIndexesRef: MutableRefObject<Partial<Record<string, number>>>; tryToNavigate: (event: FirestoreEvent) => void }) => {
  if (thisEvent.interval != null) {
    const eventDate = timestampToDateTime(thisEvent.interval.start).toFormat(dateFormat);
    if (!((dayIndexesRef.current[eventDate] ?? NaN) > index)) {
      dayIndexesRef.current[eventDate] = index;
    }
  }
  return (
    <TouchableOpacity
      onPress={() => {
        tryToNavigate(thisEvent);
      }}
    >
      <EventRow
        title={thisEvent.name}
        blurb={thisEvent.shortDescription}
        imageSource={thisEvent.images?.[0]}
        interval={thisEvent.interval ? Interval.fromDateTimes(timestampToDateTime(thisEvent.interval.start), timestampToDateTime(thisEvent.interval.end)).toISO() : undefined}
      />
    </TouchableOpacity>
  );
};

