import React from "react";
import { View, StyleSheet, Text, ActivityIndicator } from "react-native";

import moment from "moment";

import { withFirebaseHOC } from "../../../config/Firebase";

const TimeUnit = props => {
  return (
    <View style={{ alignItems: "center", paddingLeft: 7, paddingRight: 7, }}>
      <Text style={{ fontWeight: "bold", fontSize: 40, color: "white", backgroundColor:'#FFFFFF77' }}>
        {props.value}
      </Text>
      <Text style={{ fontSize: 20, color: "white" }}>{props.label}</Text>
    </View>
  );
};

class CountdownView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: this.props.title || "",
      finishMessage: "",
      date: 0,
      id: "0",
      months: 0,
      days: 0,
      hours: 0,
      mins: 0,
      secs: 0,
      isLoading: true,
      timerSetup: true
    };

    this.updateTimer = this.updateTimer.bind(this);
  }

  componentDidMount() {
    this.props.firebase.getActiveCountdown().then(snapshot => {
      snapshot.forEach(doc => {
        let countdown = doc.data();
        this.setState({
          title: countdown.title,
          date: moment.duration(moment(countdown.time.toDate()).diff(moment())),
          finishMessage: countdown.finishMessage || "",
          isLoading: false
        });
        this.updateTimer();
      });
    });
  }

  updateTimer() {
    const x = setInterval(() => {
      let { date } = this.state;

      if (date <= 0) {
        clearInterval(x);
      } else {
        date = date.subtract(1, "s");
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
          timerSetup: false
        });
      }
    }, 1000);
  }

  render() {
    const { months, days, hours, mins, secs } = this.state;
    return (
      <View style={styles.container}>
        {this.state.isLoading && (
          <ActivityIndicator color="white" size="large" />
        )}
        {!this.state.isLoading && (
          <>
          <View style={styles.countodwnTitleView}>
              <Text
                adjustsFontSizeToFit
                numberOfLines={1}
                style={styles.countodwnTitle}
              >
                {this.state.title}
              </Text>
            </View>
            {this.state.timerSetup && (
              <ActivityIndicator color="white" size="large" />
            )}
            {!this.state.timerSetup && (
              <View style={{ flexDirection: "row" }}>
                {months != 0 && (
                  <>
                    <TimeUnit
                      label={months == 1 ? "month" : "months"}
                      value={months}
                    />

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
                )}
                {(days != 0 && (
                  <>
                    <TimeUnit
                      label={days == 1 ? "day" : "days"}
                      value={days}
                    />
                    <Text
                      style={{
                        fontWeight: "bold",
                        fontSize: 40,
                        color: "white"
                      }}
                    >
                      :
                    </Text>
                  </>
                )) ||
                  (months != 0 && (
                    <>
                      <TimeUnit
                        label={days == 1 ? "day" : "days"}
                        value={days}
                      />
                      <Text
                        style={{
                          fontWeight: "bold",
                          fontSize: 40,
                          color: "white"
                        }}
                      >
                        :
                      </Text>
                    </>
                  ))}
                {(hours != 0 && (
                  <>
                    <TimeUnit
                      label={hours == 1 ? "hour" : "hours"}
                      value={hours}
                    />
                    <Text
                      style={{
                        fontWeight: "bold",
                        fontSize: 40,
                        color: "white"
                      }}
                    >
                      :
                    </Text>
                  </>
                )) ||
                  ((days != 0 || months != 0) && (
                    <>
                      <TimeUnit
                        label={hours == 1 ? "hour" : "hours"}
                        value={hours}
                      />
                      <Text
                        style={{
                          fontWeight: "bold",
                          fontSize: 40,
                          color: "white"
                        }}
                      >
                        :
                      </Text>
                    </>
                  ))}
                {(mins != 0 && (
                  <>
                    <TimeUnit
                      label={mins == 1 ? "min" : "mins"}
                      value={mins}
                    />
                    <Text
                      style={{
                        fontWeight: "bold",
                        fontSize: 40,
                        color: "white"
                      }}
                    >
                      :
                    </Text>
                  </>
                )) ||
                  ((hours != 0 || days != 0 || months != 0) && (
                    <>
                      <TimeUnit
                        label={mins == 1 ? "min" : "mins"}
                        value={mins}
                      />
                      <Text
                        style={{
                          fontWeight: "bold",
                          fontSize: 40,
                          color: "white"
                        }}
                      >
                        :
                      </Text>
                    </>
                  ))}
                {(secs != 0 && (
                  <TimeUnit label={secs == 1 ? "sec" : "secs"} value={secs} />
                )) ||
                  (mins != 0 ||
                    hours != 0 ||
                    days != 0 ||
                    (months != 0 && (
                      <TimeUnit
                        label={secs == 1 ? "sec" : "secs"}
                        value={secs}
                      />
                    )))}
              </View>
            )}
            <Text
              style={{ fontWeight: "bold", fontSize: 40, color: "white" }}
            >
              {months == 0 &&
                days == 0 &&
                hours == 0 &&
                mins == 0 &&
                secs == 0 &&
                `${this.state.finishMessage}`}
            </Text>
          </>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 150,
    width: "98%",
    backgroundColor: "#0033A0E0",
    justifyContent: "center",
    overflow: "hidden",
    alignSelf:'center',
    alignItems: "center",
    borderRadius:15,
    marginBottom:5,
    borderWidth:1,
    borderColor:'gold'
  },
  countodwnTitleView: {
    width:'95%',
    borderBottomColor:'white',
    borderBottomWidth:2,
    marginBottom:5,
  },
  countodwnTitle: {
    fontSize: 34,
    fontWeight: "bold",
    color: "white",
    alignSelf: "center",
    paddingBottom: 5,
    paddingTop: 10,
  },
  countdownStyle: {
    width: "75%",
    borderTopColor: "#FFC72C",
    borderTopWidth: 3,
    paddingTop: 5
  },
});

export default withFirebaseHOC(CountdownView);
