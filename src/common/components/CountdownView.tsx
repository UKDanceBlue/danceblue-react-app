import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Text } from 'react-native-elements';
import { intervalToDuration } from 'date-fns';

import { useAppSelector } from '../CustomHooks';
import TimeUnit from './TimeUnit';

const CountdownView = () => {
  const isConfigLoaded = false; //useAppSelector((state) => state.appConfig.isConfigLoaded);
  const countdownConfig = { millis: 1 }; //useAppSelector((state) => state.appConfig.countdown);
  const title = ''; // useAppSelector((state) => state.appConfig.countdown.title);
  const [countdownDisplayDuration, setCountdownDisplayDuration] = useState<Duration>({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // 1 second timer
    const timer = setInterval(() => {
      // Get time components
      setCountdownDisplayDuration(
        intervalToDuration({ start: new Date(), end: new Date(countdownConfig.millis) })
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
              +!!countdownDisplayDuration.years > 0 && (
                <>
                  <TimeUnit unit="years" value={countdownDisplayDuration.years} />

                  <Text
                    style={{
                      fontWeight: 'bold',
                      fontSize: 40,
                      color: 'white',
                    }}
                  >
                    :
                  </Text>
                </>
              )
            }
            {
              // Check that this or any previous unit is nonzero
              +!!countdownDisplayDuration.years + +!!countdownDisplayDuration.months > 0 && (
                <>
                  <TimeUnit unit="months" value={countdownDisplayDuration.months} />

                  <Text
                    style={{
                      fontWeight: 'bold',
                      fontSize: 40,
                      color: 'white',
                    }}
                  >
                    :
                  </Text>
                </>
              )
            }
            {
              // Check that this or any previous unit is nonzero
              +!!countdownDisplayDuration.years +
                +!!countdownDisplayDuration.months +
                +!!countdownDisplayDuration.days >
                0 && (
                <>
                  <TimeUnit unit="days" value={countdownDisplayDuration.days} />

                  <Text
                    style={{
                      fontWeight: 'bold',
                      fontSize: 40,
                      color: 'white',
                    }}
                  >
                    :
                  </Text>
                </>
              )
            }
            {
              // Check that this or any previous unit is nonzero
              +!!countdownDisplayDuration.years +
                +!!countdownDisplayDuration.months +
                +!!countdownDisplayDuration.days +
                +!!countdownDisplayDuration.hours >
                0 && (
                <>
                  <TimeUnit unit="hours" value={countdownDisplayDuration.hours} />

                  <Text
                    style={{
                      fontWeight: 'bold',
                      fontSize: 40,
                      color: 'white',
                    }}
                  >
                    :
                  </Text>
                </>
              )
            }
            {
              // Check that this or any previous unit is nonzero
              +!!countdownDisplayDuration.years +
                +!!countdownDisplayDuration.months +
                +!!countdownDisplayDuration.days +
                +!!countdownDisplayDuration.hours +
                +!!countdownDisplayDuration.minutes >
                0 && (
                <>
                  <TimeUnit unit="minutes" value={countdownDisplayDuration.minutes} />

                  <Text
                    style={{
                      fontWeight: 'bold',
                      fontSize: 40,
                      color: 'white',
                    }}
                  >
                    :
                  </Text>
                </>
              )
            }
            {
              // Check that this or any previous unit is nonzero
              +!!countdownDisplayDuration.years +
                +!!countdownDisplayDuration.months +
                +!!countdownDisplayDuration.days +
                +!!countdownDisplayDuration.hours +
                +!!countdownDisplayDuration.minutes +
                +!!countdownDisplayDuration.seconds >
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
    backgroundColor: '#0033A0E0',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countdownTitleView: {
    width: '95%',
    borderBottomColor: 'white',
    borderBottomWidth: 2,
    alignItems: 'center',
  },
  countdownText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
  },
  countdownTimer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export default CountdownView;
