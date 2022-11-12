import FirestoreModule, { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { FirebaseStorageTypes } from "@react-native-firebase/storage";
import { DownloadableImage, FirestoreEvent } from "@ukdanceblue/db-app-common";
import { DateTime } from "luxon";
import { MutableRefObject } from "react";
import { DateData } from "react-native-calendars";
import { MarkedDates } from "react-native-calendars/src/types";

import { universalCatch } from "../../../../common/logging";
import { timestampToDateTime } from "../../../../common/util/dateTools";

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
  return DateTime.fromObject({
    day: dateData.day,
    month: dateData.month,
    year: dateData.year,
  });
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
    .filter(
      (e): e is (typeof e & { interval: NonNullable<typeof e.interval> }) => e.interval != null
    )
    .forEach((event) => {
      const eventDate: DateTime = timestampToDateTime(event.interval.start);
      const eventMonthDateString = eventDate.toFormat(RNCAL_DATE_FORMAT_NO_DAY);

      if (newEvents[eventMonthDateString] == null) {
        newEvents[eventMonthDateString] = [event];
      } else {
        newEvents[eventMonthDateString]?.push(event);
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
export const markEvents = (events: FirestoreEvent[], todayDateString: string) => {
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

/**
 * Create a refresh function used across the event screen
 */
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
