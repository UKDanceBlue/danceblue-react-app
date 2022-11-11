import FirestoreModule, { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { FirebaseStorageTypes } from "@react-native-firebase/storage";
import { DownloadableImage, FirestoreEvent } from "@ukdanceblue/db-app-common";
import { DateTime } from "luxon";
import { MutableRefObject } from "react";
import { DateData } from "react-native-calendars";
import { MarkedDates } from "react-native-calendars/src/types";

import { universalCatch } from "../../../../common/logging";
import { timestampToDateTime } from "../../../../common/util/dateTools";

import { LOADED_MONTHS } from "./constants";

export const dateFormat = "yyyy-MM-dd";
const luxonDateTimeToDateString = (dateTime: DateTime): string => {
  return dateTime.toFormat(dateFormat);
};
const dateFormatWithoutDay = "yyyy-MM";
export const luxonDateTimeToMonthString = (dateTime: DateTime): string => {
  return dateTime.toFormat(dateFormatWithoutDay);
};
// That is why you usually only want to put true constants and function or class definitions there, because they should never change
export const luxonDateTimeToDateData = (dateTime: DateTime): DateData => {
  return {
    dateString: luxonDateTimeToDateString(dateTime),
    day: dateTime.day,
    month: dateTime.month,
    year: dateTime.year,
    timestamp: dateTime.toMillis(),
  };
};
export const dateDataToLuxonDateTime = (dateData: DateData): DateTime => {
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

export const markEvents = (events: FirestoreEvent[], todayDateString: string) => {
  const marked: MarkedDates = {};

  let hasAddedToday = false;

  for (const event of events) {
    if (event.interval != null) {
      const eventDate: DateTime = timestampToDateTime(event.interval.start);
      const formattedDate = eventDate.toFormat(dateFormat);

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

export function getRefreshFunction(setRefreshing: (value: boolean) => void, disableRefresh: MutableRefObject<boolean>, fbFirestore: FirebaseFirestoreTypes.Module, fbStorage: FirebaseStorageTypes.Module, setEvents: (value: FirestoreEvent[]) => void, setDownloadableImages: (value: Partial<Record<string, DownloadableImage>>) => void): (earliestTimestamp: DateTime) => Promise<void> {
  return async (earliestTimestamp: DateTime) => {
    setRefreshing(true);
    disableRefresh.current = true;
    try {
      try {
        const snapshot = await fbFirestore
          .collection("events")
          .where("interval.start", ">=", FirestoreModule.Timestamp.fromMillis(earliestTimestamp.startOf("month").toMillis())) // For example, if earliestTimestamp is 2021-03-01, then we only load events from 2021-03-01 onwards
          .where("interval.start", "<=", FirestoreModule.Timestamp.fromMillis(earliestTimestamp.plus({ months: LOADED_MONTHS - 1 }).endOf("month").toMillis())) // and before 2021-7-01, making the middle of the calendar 2021-05-01
          .orderBy("interval.start", "asc")
          .get();
        const firestoreEvents: FirestoreEvent[] = [];

        const downloadableImagePromises: Promise<[string, DownloadableImage]>[] = [];

        for await (const doc of snapshot.docs) {
          const data = doc.data();
          if (FirestoreEvent.isValidJson(data)) {
            const firestoreEvent = FirestoreEvent.fromJson(data);
            firestoreEvents.push(firestoreEvent);
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
        }

        const downloadableImages: Partial<Record<string, DownloadableImage>> = Object.fromEntries(await Promise.all(downloadableImagePromises));
        setDownloadableImages(downloadableImages);

        setEvents(firestoreEvents);
      } catch (error) {
        universalCatch(error);
      }
    } finally {
      setRefreshing(false);
      disableRefresh.current = false;
    }
  };
}
