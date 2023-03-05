import { DateTime, Duration, Interval } from "luxon";
import { Text, View } from "native-base";
import { useEffect, useState } from "react";
import { StyleSheet, useWindowDimensions } from "react-native";

import { useThemeColors } from "../../customHooks";
import TimeUnit from "../TimeUnit";

const CountdownView = ({ endTime }: { endTime: number }) => {
  const [ countdownDisplayDuration, setCountdownDisplayDuration ] = useState<Duration>(Duration.fromMillis(0));
  const {
    primary, secondary
  } = useThemeColors();
  const {
    height: screenHeight, width: screenWidth
  } = useWindowDimensions();

  useEffect(() => {
    // 1 second timer
    const timer = setInterval(() => {
      // Get time components
      setCountdownDisplayDuration(
        Interval.fromDateTimes(new Date(), DateTime.fromMillis(endTime)).toDuration().shiftTo("years", "months", "days", "hours", "minutes", "seconds")
      );
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [endTime]);
  
  // console.log(countdownDisplayDuration.toObject());

  return (
    <View style={styles.container}>
      <View style={styles.countdownTimer}>
        {
          // Check that this or any previous unit is nonzero
          Number(!!countdownDisplayDuration.years) > 0 && (
            <View bgColor={`${primary[700]}BD`} marginX={2} minWidth={screenWidth / 5}>
              <TimeUnit unit="years" value={countdownDisplayDuration.years} />
            </View>
          )
        }
        {
          // Check that this or any previous unit is nonzero
          Number(!!countdownDisplayDuration.years) + Number(!!countdownDisplayDuration.months) > 0 && (
            <View bgColor={`${primary[700]}BD`} marginX={2} minWidth={screenWidth / 5}>
              <TimeUnit unit="months" value={countdownDisplayDuration.months} />
            </View>
          )
        }
        {
          // Check that this or any previous unit is nonzero
          Number(!!countdownDisplayDuration.years) +
                Number(!!countdownDisplayDuration.months) +
                Number(!!countdownDisplayDuration.days) >
                0 && (
            <View bgColor={`${primary[700]}BD`} marginX={2} minWidth={screenWidth / 5}>
              <TimeUnit unit="days" value={countdownDisplayDuration.days} />
            </View>
          )
        }
        {
          // Check that this or any previous unit is nonzero
          Number(!!countdownDisplayDuration.years) +
                Number(!!countdownDisplayDuration.months) +
                Number(!!countdownDisplayDuration.days) +
                Number(!!countdownDisplayDuration.hours) >
                0 && (
            <View bgColor={`${primary[700]}BD`} marginX={2} minWidth={screenWidth / 5}>
              <TimeUnit unit="hours" value={countdownDisplayDuration.hours} />
            </View>
          )
        }
        {
          // Check that this or any previous unit is nonzero
          Number(!!countdownDisplayDuration.years) +
                Number(!!countdownDisplayDuration.months) +
                Number(!!countdownDisplayDuration.days) +
                Number(!!countdownDisplayDuration.hours) +
                Number(!!countdownDisplayDuration.minutes) >
                0 && (
            <View bgColor={`${primary[700]}BD`} marginX={2} minWidth={screenWidth / 5}>
              <TimeUnit unit="minutes" value={countdownDisplayDuration.minutes} />
            </View>
          )
        }
        {
          // Check that this or any previous unit is nonzero
          Number(!!countdownDisplayDuration.years) +
                Number(!!countdownDisplayDuration.months) +
                Number(!!countdownDisplayDuration.days) +
                Number(!!countdownDisplayDuration.hours) +
                Number(!!countdownDisplayDuration.minutes) +
                Number(!!countdownDisplayDuration.seconds) >
                0 && (
            <View bgColor={`${primary[700]}BD`} marginX={2} minWidth={screenWidth / 5}>
              <TimeUnit unit="seconds" value={Math.trunc(countdownDisplayDuration.seconds)} />
            </View>
          )
        }
      </View>
    </View>
  );
};

export const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  countdownTimer: {
    flexDirection: "row",
    justifyContent: "center",
  }
});

export default CountdownView;
