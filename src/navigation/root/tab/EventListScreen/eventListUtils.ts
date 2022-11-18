import FirestoreModule, { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { DownloadableImage, FirestoreEvent, FirestoreEventJson } from "@ukdanceblue/db-app-common";
import { MaybeWithFirestoreMetadata } from "@ukdanceblue/db-app-common/dist/firestore/internal";
import { DateTime } from "luxon";
import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { DateData } from "react-native-calendars";
import { MarkedDates } from "react-native-calendars/src/types";

import { universalCatch } from "../../../../common/logging";
import { timestampToDateTime } from "../../../../common/util/dateTools";
import { useFirebase } from "../../../../context";

import { LOADED_MONTHS, RNCAL_DATE_FORMAT, RNCAL_DATE_FORMAT_NO_DAY } from "./constants";

/**
 * Converts a luxon DateTime to a string in the format used by react-native-calendars
 *
 * @param dateTime The DateTime to convert
 * @returns dateTime.toFormat(RNCAL_DATE_FORMAT)
 */
export const luxonDateTimeToDateString = (dateTime: DateTime): string => {
  return dateTime.toFormat(RNCAL_DATE_FORMAT);
};

/**
 * Converts a luxon DateTime to a month string in the format used by react-native-calendars
 *
 * @param dateTime The DateTime to convert
 * @returns dateTime.toFormat(RNCAL_DATE_FORMAT_NO_DAY)
 */
export const luxonDateTimeToMonthString = (dateTime: DateTime): string => {
  return dateTime.toFormat(RNCAL_DATE_FORMAT_NO_DAY);
};

/**
 * Converts a luxon DateTime to a react-native-calendars date object
 *
 * Constructed using the day, month, and year components of DateTime, the DateTime.toMillis() method, and luxonDateTimeToDateString
 *
 * @param dateTime The DateTime to convert
 * @returns A date object corresponding to dateTime
 */
export const luxonDateTimeToDateData = (dateTime: DateTime): DateData => {
  return {
    dateString: luxonDateTimeToDateString(dateTime),
    day: dateTime.day,
    month: dateTime.month,
    year: dateTime.year,
    timestamp: dateTime.toMillis(),
  };
};

/**
 * Converts a react-native-calendars date object to a luxon DateTime
 *
 * Constructed using only the day, month, and year components of dateData
 *
 * @param dateData The date object to convert
 * @returns A DateTime corresponding to dateData
 */
export const dateDataToLuxonDateTime = (dateData: DateData): DateTime => {
  return DateTime.fromMillis(dateData.timestamp);
};

/**
 * Splits a list of events into an object keyed by month string
 *
 * @param events The events to split
 * @returns An object keyed by month string, with the values being the events in that month
 */
export const splitEvents = (events: FirestoreEvent[]) => {
  const newEvents: Partial<Record<string, FirestoreEvent[]>> = {};

  events
    .forEach((event) => {
      if (event.interval != null) {
        const eventDate: DateTime = timestampToDateTime(event.interval.start);
        const eventMonthDateString = eventDate.toFormat(RNCAL_DATE_FORMAT_NO_DAY);

        if (newEvents[eventMonthDateString] == null) {
          newEvents[eventMonthDateString] = [event];
        } else {
          newEvents[eventMonthDateString]?.push(event);
        }
      }
    });

  return newEvents;
};

/**
 * Gets the events for the given month and produces a MarkedDates object for react-native-calendars
 *
 * @param events The full list of events
 * @param todayDateString The date string for today
 * @returns A MarkedDates object for react-native-calendars
 */
export const markEvents = (events: FirestoreEvent[]) => {
  const todayDateString = getTodayDateString();

  const marked: MarkedDates = {};

  let hasAddedToday = false;

  for (const event of events) {
    if (event.interval != null) {
      const eventDate: DateTime = timestampToDateTime(event.interval.start);
      const formattedDate = eventDate.toFormat(RNCAL_DATE_FORMAT);

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

export type UseEventsStateInternalReducerPayloads = {
  action: "reset";
  payload?: never;
} | {
  action: "setEvents";
  payload: FirestoreEvent[];
}
// | {
//   action: "setEvent";
//   payload: FirestoreEvent;
// }
| {
  action: "addEvent";
  payload: FirestoreEvent;
} | {
  action: "addEvents";
  payload: FirestoreEvent[];
} | {
  action: "removeEvent";
  payload: string;
};

export const useEventsStateInternal = () => useReducer(
  (
    prevState: Partial<Record<string, FirestoreEvent>>,
    {
      action, payload
    }: UseEventsStateInternalReducerPayloads
  ): Partial<Record<string, FirestoreEvent>> => {
    try {
      switch (action) {
      case "reset":
        return {};
      case "setEvents":{
        return Object.fromEntries(payload.map((event) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          const documentId = event.documentMetadata?.documentId as string | undefined;
          if (documentId) {
            return ([ documentId, event ]);
          } else {
            throw new Error("Event has no document metadata");
          }
        })) as Partial<Record<string, FirestoreEvent>>;
      }
      case "addEvent":{
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const documentId = payload.documentMetadata?.documentId as string | undefined;
        if (documentId) {
          if (prevState[documentId] == null) {
            return {
              ...prevState,
              [documentId]: payload,
            };
          } else {
            return prevState;
          }
        } else {
          throw new Error("Event has no document metadata");
        }
      }
      // case "setEvent":{
      //   // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      //   const documentId = payload.documentMetadata?.documentId as string | undefined;
      //   if (documentId) {
      //     return {
      //       ...prevState,
      //       [documentId]: payload,
      //     };
      //   } else {
      //     throw new Error("Event has no document metadata");
      //   }
      // }
      case "addEvents":{
        return {
          ...prevState,
          ...Object.fromEntries(payload.map((event) => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            const documentId = event.documentMetadata?.documentId;
            if (documentId) {
              return ([ documentId, event ]);
            } else {
              throw new Error("Event has no document metadata");
            }
          }))
        } as Partial<Record<string, FirestoreEvent>>;
      }
      case "removeEvent":{
        const newState = { ...prevState };
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete newState[payload];
        return newState;}
      default:
        throw new Error("Invalid action");
      }
    } catch (e) {
      console.error(e);
      return prevState;
    }
  }
  , {}
);

export const getToday = () => DateTime.local().set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
export const getTodayDateString = () => luxonDateTimeToDateString(getToday());

export const useEvents = ({ earliestTimestamp }: {
  earliestTimestamp: DateTime;
}): [markedDates: MarkedDates, eventsByMonth: Partial<Record<string, FirestoreEvent[]>>, downloadableImages: Partial<Record<string, DownloadableImage>>, refreshing: boolean, refresh: () => Promise<void>] => {
  const lastEarliestTimestamp = useRef<DateTime | null>(null);

  const {
    fbFirestore, fbStorage
  } = useFirebase();
  const [ refreshing, setRefreshing ] = useState(false);
  const disableRefresh = useRef(false);
  const [ downloadableImages, setDownloadableImages ] = useState<Partial<Record<string, DownloadableImage>>>({});

  const [ events, updateEvents ] = useEventsStateInternal();

  const refresh = useCallback(async (earliestTimestamp: DateTime) => {
    setRefreshing(true);
    disableRefresh.current = true;
    const snapshot = await fbFirestore
      .collection<MaybeWithFirestoreMetadata<FirestoreEventJson>>("events")
      .where(new FirestoreModule.FieldPath("interval", "start"), ">=", FirestoreModule.Timestamp.fromMillis(earliestTimestamp.startOf("month").toMillis())) // For example, if earliestTimestamp is 2021-03-01, then we only load events from 2021-03-01 onwards
      .where(new FirestoreModule.FieldPath("interval", "start"), "<=", FirestoreModule.Timestamp.fromMillis(earliestTimestamp.plus({ months: LOADED_MONTHS - 1 }).endOf("month").toMillis())) // and before 2021-7-01, making the middle of the calendar 2021-05-01
      .orderBy(new FirestoreModule.FieldPath("interval", "start"), "asc")
      .get();

    const downloadableImagePromises: Promise<[string, DownloadableImage]>[] = [];

    const eventsToSet = [];

    for await (const doc of snapshot.docs) {
      let firestoreEvent: FirestoreEvent;
      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        firestoreEvent = (FirestoreEvent.fromSnapshot as (snapshot: FirebaseFirestoreTypes.DocumentSnapshot<MaybeWithFirestoreMetadata<FirestoreEventJson>>) => FirestoreEvent)(doc);
      } catch (e) {
        console.error(e);
        continue;
      }
      eventsToSet.push(firestoreEvent);
      if (firestoreEvent.images != null) {
        for (const image of firestoreEvent.images) {
          downloadableImagePromises.push(Promise.all([
            image.uri, DownloadableImage.fromFirestoreImage(image, (uri: string) => {
              if (uri.startsWith("gs://")) {
                return fbStorage.refFromURL(uri).getDownloadURL();
              } else {
                return Promise.resolve(uri);
              }
            })
          ]));
        }
      }
    }

    updateEvents({
      action: "setEvents",
      payload: eventsToSet
    });

    const downloadableImages: Partial<Record<string, DownloadableImage>> = Object.fromEntries(await Promise.all(downloadableImagePromises));
    setDownloadableImages(downloadableImages);
  }, [
    fbFirestore, fbStorage, updateEvents
  ]);

  useEffect(() => {
    if (
      !disableRefresh.current &&
      (
        (lastEarliestTimestamp.current == null) ||
        Math.abs(earliestTimestamp.diff(lastEarliestTimestamp.current, "months").get("months")) >= 2.5
      )) {
      (refresh)(earliestTimestamp)
        .catch(universalCatch)
        .finally(() => {
          setRefreshing(false);
          disableRefresh.current = false;
          lastEarliestTimestamp.current = earliestTimestamp;
        });
    }
  }, [ earliestTimestamp, refresh ]);

  const eventsByMonth = useMemo(() => splitEvents(Object.values(events) as NonNullable<typeof events[string]>[]), [events]);

  const marked = useMemo(() => markEvents((Object.values(events) as NonNullable<typeof events[string]>[])), [events]);

  return [
    marked,
    eventsByMonth,
    downloadableImages,
    refreshing,
    useCallback(
      () => refresh(earliestTimestamp)
        .catch(universalCatch)
        .finally(() => {
          setRefreshing(false);
          disableRefresh.current = false;
          lastEarliestTimestamp.current = earliestTimestamp;
        }),
      [ earliestTimestamp, refresh ]
    )
  ];
};
