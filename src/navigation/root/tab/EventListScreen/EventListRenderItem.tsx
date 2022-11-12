import { DownloadableImage, FirestoreEvent } from "@ukdanceblue/db-app-common";
import { Interval } from "luxon";
import { MutableRefObject, useCallback, useMemo } from "react";
import { ListRenderItem } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import EventRow from "../../../../common/components/EventRow";
import { timestampToDateTime } from "../../../../common/util/dateTools";

import { RNCAL_DATE_FORMAT } from "./constants";

export const EventListRenderItem = ({
  item: thisEvent, index, dayIndexesRef, tryToNavigate, downloadableImage
}:
Parameters<ListRenderItem<FirestoreEvent>>[0] &
{
  dayIndexesRef: MutableRefObject<Partial<Record<string, number>>>;
  tryToNavigate: (event: FirestoreEvent) => void;
  downloadableImage?: DownloadableImage | null;
}) => {
  if (thisEvent.interval != null) {
    const eventDate = timestampToDateTime(thisEvent.interval.start).toFormat(RNCAL_DATE_FORMAT);
    if (!((dayIndexesRef.current[eventDate] ?? NaN) > index)) {
      dayIndexesRef.current[eventDate] = index;
    }
  }

  const onPress = useCallback(() => {
    tryToNavigate(thisEvent);
  }, [ thisEvent, tryToNavigate ]);

  return useMemo(() => (
    <TouchableOpacity
      onPress={onPress}
    >
      <EventRow
        title={thisEvent.name}
        blurb={thisEvent.shortDescription}
        imageSource={downloadableImage}
        interval={thisEvent.interval ? Interval.fromDateTimes(timestampToDateTime(thisEvent.interval.start), timestampToDateTime(thisEvent.interval.end)).toISO() : undefined}
      />
    </TouchableOpacity>
  ), [
    downloadableImage, onPress, thisEvent.interval, thisEvent.name, thisEvent.shortDescription
  ]);
};

