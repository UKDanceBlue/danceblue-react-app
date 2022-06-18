import { Duration, Interval } from "luxon";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Text } from "react-native-elements";

import { useAppSelector } from "../CustomHooks";

import TimeUnit from "./TimeUnit";

const CountdownView = () => {
  const isConfigLoaded = false; // UseAppSelector((state) => state.appConfig.isConfigLoaded);
  const countdownConfig = { millis: 1 }; // UseAppSelector((state) => state.appConfig.countdown);
  const title = ""; // UseAppSelector((state) => state.appConfig.countdown.title);
  const [
    countdownDisplayDuration, setCountdownDisplayDuration
  ] = useState<Duration>(Duration.fromMillis(0));

  useEffect(() => {
    // 1 second timer
    const timer = setInterval(() => {
      // Get time components
      setCountdownDisplayDuration(
        Interval.fromDateTimes(new Date(), new Date(countdownConfig.millis)).toDuration()
      );
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [countdownConfig.millis]);

  return (
    <View style={styles.container}>
      {!isConfigLoaded && <ActivityIndicator color="white" size="large" />}
      {isConfigLoaded && (
        <>
          <View style={styles.countdownTitleView}>
            <Text adjustsFontSizeToFit numberOfLines={1} style={styles.countdownText}>
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
        </>
      )}
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
