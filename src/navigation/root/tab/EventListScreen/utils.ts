import { FirestoreEvent } from "@ukdanceblue/db-app-common";
import { DateTime } from "luxon";
import { DateData } from "react-native-calendars";
import { MarkedDates } from "react-native-calendars/src/types";

import { timestampToDateTime } from "../../../../common/util/dateTools";

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
