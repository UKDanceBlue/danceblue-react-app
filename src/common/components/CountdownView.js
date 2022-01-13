/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { collection, getDocs, where, query } from 'firebase/firestore';
import moment from 'moment';

import { firebaseFirestore } from '../FirebaseApp';
import { useSelector } from 'react-redux';

/**
 * A label for a unit of time
 * @param {string} props Properties of the component: value, label
 * @returns A React Native component
 */
const TimeUnit = ({ value, label }) => (
  <View style={{ alignItems: 'center', paddingLeft: 7, paddingRight: 7 }}>
    <Text style={styles.countdownText}>{value}</Text>
    <Text style={{ fontSize: 20, color: 'white' }}>{label}</Text>
  </View>
);

const CountdownView = () => {
  const isConfigLoaded = useSelector((state) => state.appConfig.isConfigLoaded);
  const countdownEventTimeStamp = useSelector((state) => state.appConfig.countdown.millis);
  const title = useSelector((state) => state.appConfig.countdown.title);
  const [countdownDisplayTime, setCurrentTime] = useState(new Date());

  useEffect(
    () =>
      // 1 second timer
      setInterval(
        () =>
          setCurrentTime(
            // Create a date object with the difference between now and the countdown stored in firebase
            new Date(Math.abs(countdownEventTimeStamp - new Date().getTime()))
          ),
        1000
      ),
    []
  );

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
            {countdownDisplayTime.getMonth() !== 0 && (
              <>
                <TimeUnit
                  label={countdownDisplayTime.getMonth() === 1 ? 'month' : 'months'}
                  value={countdownDisplayTime.getMonth()}
                />

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
            )}
            {(countdownDisplayTime.getDate() !== 0 && (
              <>
                <TimeUnit
                  label={countdownDisplayTime.getDate() === 1 ? 'day' : 'days'}
                  value={countdownDisplayTime.getDate()}
                />
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
            )) ||
              (countdownDisplayTime.getMonth() !== 0 && (
                <>
                  <TimeUnit
                    label={countdownDisplayTime.getDate() === 1 ? 'day' : 'days'}
                    value={countdownDisplayTime.getDate()}
                  />
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
              ))}
            {(countdownDisplayTime.getHours() !== 0 && (
              <>
                <TimeUnit
                  label={countdownDisplayTime.getHours() === 1 ? 'hour' : 'hours'}
                  value={countdownDisplayTime.getHours()}
                />
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
            )) ||
              ((countdownDisplayTime.getDay() !== 0 || countdownDisplayTime.getMonth() !== 0) && (
                <>
                  <TimeUnit
                    label={countdownDisplayTime.getHours() === 1 ? 'hour' : 'hours'}
                    value={countdownDisplayTime.getHours()}
                  />
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
              ))}
            {(countdownDisplayTime.getMinutes() !== 0 && (
              <>
                <TimeUnit
                  label={countdownDisplayTime.getMinutes() === 1 ? 'min' : 'mins'}
                  value={countdownDisplayTime.getMinutes()}
                />
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
            )) ||
              ((countdownDisplayTime.getHours() !== 0 ||
                countdownDisplayTime.getDay() !== 0 ||
                countdownDisplayTime.getMonth() !== 0) && (
                <>
                  <TimeUnit
                    label={countdownDisplayTime.getMinutes() === 1 ? 'min' : 'mins'}
                    value={countdownDisplayTime.getMinutes()}
                  />
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
              ))}
            {(countdownDisplayTime.getSeconds() !== 0 && (
              <TimeUnit
                label={countdownDisplayTime.getSeconds() === 1 ? 'sec' : 'secs'}
                value={countdownDisplayTime.getSeconds()}
              />
            )) ||
              ((countdownDisplayTime.getMonth() !== 0 ||
                countdownDisplayTime.getHours() !== 0 ||
                countdownDisplayTime.getDay() !== 0 ||
                countdownDisplayTime.getMonth() !== 0) && (
                <TimeUnit
                  label={countdownDisplayTime.getSeconds() === 1 ? 'sec' : 'secs'}
                  value={countdownDisplayTime.getSeconds()}
                />
              ))}
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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
