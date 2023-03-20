import { DateTime, Interval } from "luxon";

export const marathonInterval = Interval.fromDateTimes(
  DateTime.fromObject({ year: 2023, month: 3, day: 19, hour: 20 }),
  DateTime.fromObject({ year: 2023, month: 3, day: 20, hour: 20 })
);

export const marathonHourIntervals = marathonInterval.divideEqually(24);

export const lookupHourByTime = (time: DateTime): number | null => {
  if (!marathonInterval.contains(time)) {
    return null;
  }
  const num = marathonHourIntervals.findIndex((interval) => interval.contains(time));
  if (num === -1) {
    return null;
  } else {
    return num;
  }
};

export const lookupHourIntervalByTime = (time: DateTime): Interval | null => {
  if (!marathonInterval.contains(time)) {
    return null;
  }
  const interval = marathonHourIntervals.find((interval) => interval.contains(time));
  if (!interval) {
    return null;
  } else {
    return interval;
  }
};

