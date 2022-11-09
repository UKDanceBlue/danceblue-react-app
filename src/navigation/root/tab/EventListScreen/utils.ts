import FirestoreModule, { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { FirestoreEvent } from "@ukdanceblue/db-app-common";
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

export const markEvents = (events: FirestoreEvent[], todayDateString: string, selectedDay: string) => {
  const marked: MarkedDates = {};

  let hasAddedToday = false;
  let hasAddedSelectedDay = false;

  for (const event of events) {
    if (event.interval != null) {
      const eventDate: DateTime = timestampToDateTime(event.interval.start);
      const formattedDate = eventDate.toFormat(dateFormat);

      marked[formattedDate] = {
        marked: true,
        today: formattedDate === todayDateString,
        selected: formattedDate === selectedDay,
      };
      if (formattedDate === todayDateString) {
        hasAddedToday = true;
      }
      if (formattedDate === selectedDay) {
        hasAddedSelectedDay = true;
      }
    }
  }

  // If we didn't add today or selected day already, we need to add them manually
  if (!hasAddedToday) {
    marked[todayDateString] = { today: true };
  }
  if (!hasAddedSelectedDay) {
    marked[selectedDay] = { selected: true };
  }

  return marked;
};

export function getRefreshFunction(setRefreshing: (value: boolean) => void, disableRefresh: MutableRefObject<boolean>, fbFirestore: FirebaseFirestoreTypes.Module, setEvents: (value: FirestoreEvent[]) => void): (earliestTimestamp: DateTime) => Promise<void> {
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
        for (const doc of snapshot.docs) {
          const data = doc.data();
          if (FirestoreEvent.isValidJson(data)) {
            firestoreEvents.push(FirestoreEvent.fromJson(data));
          }
        }

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
