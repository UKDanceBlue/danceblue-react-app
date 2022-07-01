import { DateTime, Duration, Interval } from "luxon";
import { Text } from "native-base";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

import TimeUnit from "./TimeUnit";

const CountdownView = ({
  title, endTime
}: { title: string; endTime: number }) => {
  const [ countdownDisplayDuration, setCountdownDisplayDuration ] = useState<Duration>(Duration.fromMillis(0));

  useEffect(() => {
    // 1 second timer
    const timer = setInterval(() => {
      // Get time components
      setCountdownDisplayDuration(
        Interval.fromDateTimes(new Date(), DateTime.fromMillis(endTime)).toDuration()
      );
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [endTime]);

  return (
    <View style={styles.container}>
      <View style={styles.countdownTitleView}>
        <Text adjustsFontSizeToFit numberOfLines={1}>
          {title}
        </Text>
      </View>
      <View style={styles.countdownTimer}>
        {
          // Check that this or any previous unit is nonzero
          Number(!!countdownDisplayDuration.years) > 0 && (
            <>
              <TimeUnit unit="years" value={countdownDisplayDuration.years} />

              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 40,
                  color: "white",
                }}
              >
                    :
              </Text>
            </>
          )
        }
        {
          // Check that this or any previous unit is nonzero
          Number(!!countdownDisplayDuration.years) + Number(!!countdownDisplayDuration.months) > 0 && (
            <>
              <TimeUnit unit="months" value={countdownDisplayDuration.months} />

              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 40,
                  color: "white",
                }}
              >
                    :
              </Text>
            </>
          )
        }
        {
          // Check that this or any previous unit is nonzero
          Number(!!countdownDisplayDuration.years) +
                Number(!!countdownDisplayDuration.months) +
                Number(!!countdownDisplayDuration.days) >
                0 && (
            <>
              <TimeUnit unit="days" value={countdownDisplayDuration.days} />

              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 40,
                  color: "white",
                }}
              >
                    :
              </Text>
            </>
          )
        }
        {
          // Check that this or any previous unit is nonzero
          Number(!!countdownDisplayDuration.years) +
                Number(!!countdownDisplayDuration.months) +
                Number(!!countdownDisplayDuration.days) +
                Number(!!countdownDisplayDuration.hours) >
                0 && (
            <>
              <TimeUnit unit="hours" value={countdownDisplayDuration.hours} />

              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 40,
                  color: "white",
                }}
              >
                    :
              </Text>
            </>
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
            <>
              <TimeUnit unit="minutes" value={countdownDisplayDuration.minutes} />

              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 40,
                  color: "white",
                }}
              >
                    :
              </Text>
            </>
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
            <>
              <TimeUnit unit="seconds" value={countdownDisplayDuration.seconds} />
            </>
          )
        }
      </View>
    </View>
  );
};

export const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#0033A0E0",
    flex: 1,
    justifyContent: "center",
  },
  countdownTimer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  countdownTitleView: {
    alignItems: "center",
    borderBottomColor: "white",
    borderBottomWidth: 2,
    width: "95%",
  },
});

export default CountdownView;
