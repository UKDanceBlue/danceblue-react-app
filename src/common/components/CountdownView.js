import React from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';

import moment from 'moment';

import { withFirebaseHOC } from '../../firebase/FirebaseContext';

/**
 * A label for a unit of time
 * @param {Object} props Properties of the component: value, label
 * @returns A React Native component
 * @class
 */
const TimeUnit = (props) => (
  <View style={{ alignItems: 'center', paddingLeft: 7, paddingRight: 7 }}>
    <Text style={styles.countdownText}>{props.value}</Text>
    <Text style={{ fontSize: 20, color: 'white' }}>{props.label}</Text>
  </View>
);

/**
 * A component to show a countdown loaded form firebase
 * Loads the active countdown from firebase (if applicably) and then counts down by the second until the end of that countodwn
 * @param {Object} props Properties of the component: title, firebase
 * @class
 */
class CountdownView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: this.props.title || '',
      finishMessage: '',
      date: 0,
      id: '0',
      months: 0,
      days: 0,
      hours: 0,
      mins: 0,
      secs: 0,
      isLoading: true,
      timerSetup: true,
    };

    this.updateTimer = this.updateTimer.bind(this);
  }

  /**
   * Called immediately after a component is mounted. Setting state here will trigger re-rendering.
   */
  componentDidMount() {
    this.props.firebase.getActiveCountdown().then((snapshot) => {
      snapshot.forEach((doc) => {
        const countdown = doc.data();
        this.setState({
          title: countdown.title,
          date: moment.duration(moment(countdown.time.toDate()).diff(moment())),
          finishMessage: countdown.finishMessage || '',
          isLoading: false,
        });
        this.updateTimer();
      });
    });
  }

  /**
   * Every 1 second subtract 1 second from the timer (stored in CountdownView.state) until it is less than or equal to 0,  then stop
   */
  updateTimer() {
    const x = setInterval(() => {
      let { date } = this.state;

      if (date <= 0) {
        clearInterval(x);
      } else {
        date = date.subtract(1, 's');
        const months = date.months();
        const days = date.days();
        const hours = date.hours();
        const mins = date.minutes();
        const secs = date.seconds();

        this.setState({
          months,
          days,
          hours,
          mins,
          secs,
          date,
          timerSetup: false,
        });
      }
    }, 1000);
  }

  /**
   * Called to generate a React Native component
   * @returns A JSX formatted component
   */
  render() {
    const { months, days, hours, mins, secs } = this.state;
    return (
      <View style={styles.container}>
        {this.state.isLoading && <ActivityIndicator color="white" size="large" />}
        {!this.state.isLoading && (
          <>
            <View style={styles.countdownTitleView}>
              <Text adjustsFontSizeToFit numberOfLines={1} style={styles.countdownText}>
                {this.state.title}
              </Text>
            </View>
            {this.state.timerSetup && <ActivityIndicator color="white" size="large" />}
            {!this.state.timerSetup && (
              /* jscpd:ignore-start */
              <View style={styles.countdownTimer}>
                {months !== 0 && (
                  <>
                    <TimeUnit label={months === 1 ? 'month' : 'months'} value={months} />

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
                {(days !== 0 && (
                  <>
                    <TimeUnit label={days === 1 ? 'day' : 'days'} value={days} />
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
                  (months !== 0 && (
                    <>
                      <TimeUnit label={days === 1 ? 'day' : 'days'} value={days} />
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
                {(hours !== 0 && (
                  <>
                    <TimeUnit label={hours === 1 ? 'hour' : 'hours'} value={hours} />
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
                  ((days !== 0 || months !== 0) && (
                    <>
                      <TimeUnit label={hours === 1 ? 'hour' : 'hours'} value={hours} />
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
                {(mins !== 0 && (
                  <>
                    <TimeUnit label={mins === 1 ? 'min' : 'mins'} value={mins} />
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
                  ((hours !== 0 || days !== 0 || months !== 0) && (
                    <>
                      <TimeUnit label={mins === 1 ? 'min' : 'mins'} value={mins} />
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
                {(secs !== 0 && <TimeUnit label={secs === 1 ? 'sec' : 'secs'} value={secs} />) ||
                  ((mins !== 0 || hours !== 0 || days !== 0 || months !== 0) && (
                    /* eslint-disable */
                    <TimeUnit label={secs === 1 ? 'sec' : 'secs'} value={secs} />
                  ))}
              </View>
              /* jscpd:ignore-end */
            )}
            {months === 0 && days === 0 && hours === 0 && mins === 0 && secs === 0 && (
              <Text style={styles.coundownText}>{this.state.finishMessage}</Text>
            )}
          </>
        )}
      </View>
    );
  }
}

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

export default withFirebaseHOC(CountdownView);
