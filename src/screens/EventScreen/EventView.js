// Import third-party dependencies
import React, { Component } from 'react';
import { Text, ActivityIndicator, StyleSheet, TouchableHighlight, View, Image } from 'react-native';
import openMap from 'react-native-open-maps';
import * as Calendar from 'expo-calendar';
import moment from 'moment';

// Import first-party dependencies
import { withFirebaseHOC } from '../../firebase/FirebaseContext';

const danceBlueCalendarConfig = {
  title: 'DanceBlue',
  color: '#0033A0',
  enitityType: Calendar.EntityTypes.EVENT,
  source: {
    isLocalAccount: true,
    name: 'DanceBlue Mobile',
  },
  name: 'dancebluemobile',
  ownerAccount: 'DanceBlue Mobile',
  accessLevel: Calendar.CalendarAccessLevel.OWNER,
};

/**
 * A component for showing a particular calendar event
 * @param {Object} props Properties of the component: route, firebase
 * @see {@link https://docs.expo.dev/versions/latest/sdk/calendar/ Expo's Calendar API}
 * @author Kenton Carrier
 * @since 1.0.1
 * @class
 */
class EventView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      id: props.route.params.id,
      isOnCalendar: false,
      isAddingToCalendar: false,
    };

    this.checkCalendarPermissions = this.checkCalendarPermissions.bind(this);
    this.checkDBCalendar = this.checkDBCalendar.bind(this);
    this.addToCalendar = this.addToCalendar.bind(this);
    this.createDBCalendar = this.createDBCalendar.bind(this);
    this.checkEventExists = this.checkEventExists.bind(this);
    this.removeFromCalendar = this.removeFromCalendar.bind(this);
  }

  /**
   * Called immediately after a component is mounted. Setting state here will trigger re-rendering.
   * @author Kenton Carrier
   * @since 1.0.1
   */
  componentDidMount() {
    this.props.firebase
      .getEvent(this.state.id)
      .then((doc) => {
        this.setState({ isLoading: false, ...doc.data() });
        this.props.core
          .getDocumentURL(doc.data().image)
          .then((url) => {
            this.setState({ imageRef: url });
          })
          .catch((error) => console.log(error.message));
      })
      .then(this.checkCalendarPermissions)
      .then(this.checkEventExists);
  }

  /**
   * Check if the user has given permission for calender access
   * If they have not then Expo will request them
   * @returns A promise containing a permission response
   * @author Kenton Carrier
   * @since 1.0.1
   */
  checkCalendarPermissions() {
    return Calendar.requestCalendarPermissionsAsync();
  }

  /**
   * Check if the DanceBlue calendar exist's on the user's device
   * @returns true if the calendar exists, false if not
   * @author Kenton Carrier
   * @since 1.0.1
   */
  checkDBCalendar() {
    let foundCalendar = false;
    return Calendar.getCalendarsAsync().then((calendars) => {
      calendars.forEach((calendar) => {
        if (calendar.name === 'dancebluemobile') {
          this.setState({ calendarID: calendar.id });
          foundCalendar = true;
        }
      });
      return foundCalendar;
    });
  }

  /**
   * Creates a new calendar on the user's device and adds *calendarID* to *this.state*
   * @returns A Promise for the completion of which ever callback is executed.
   * @author Kenton Carrier
   * @since 1.0.1
   */
  createDBCalendar() {
    return Calendar.createCalendarAsync(danceBlueCalendarConfig).then((id) =>
      this.setState({ calendarID: id })
    );
  }

  /**
   * Check if the event exists on the DanceBlue calendar
   * If it exisits then it adds *{isOnCalendar: true}* and *eventCalendarID* to *this.state*
   * @author Kenton Carrier
   * @since 1.0.1
   */
  checkEventExists() {
    this.checkCalendarPermissions()
      .then(this.checkDBCalendar)
      .then(async (calendarExists) => {
        if (calendarExists) {
          return Calendar.getEventsAsync(
            [this.state.calendarID],
            this.state.startTime.toDate(),
            this.state.endTime.toDate()
          ).then((events) => {
            events.forEach((event) => {
              if (event.title === this.state.title)
                this.setState({ isOnCalendar: true, eventCalendarID: event.id });
            });
          });
        }
      });
  }

  /**
   * Add the event to the calendar
   * While the function is running *this.state.isAddingToCalendar* will return true
   * If the event is successfully created *{isAddingToCalendar: false, isOnCalendar: true}* and eventCalendarID will be added to this.state
   * @author Kenton Carrier
   * @since 1.0.1
   */
  addToCalendar() {
    this.setState({ isAddingToCalendar: true });
    this.checkCalendarPermissions()
      .then(this.checkDBCalendar)
      .then(async (calendarExists) => {
        if (!calendarExists) {
          await this.createDBCalendar();
        }
        return Calendar.createEventAsync(this.state.calendarID, {
          title: this.state.title,
          startDate: this.state.startTime.toDate(),
          endDate: this.state.endTime.toDate(),
          location: this.state.address,
        }).then((id) =>
          this.setState({ isAddingToCalendar: false, isOnCalendar: true, eventCalendarID: id })
        );
      });
  }

  /**
   * Removes an event from the calendar
   * While the function is running *this.state.isAddingToCalendar* will return true
   * @returns A Promise for the completion of which ever callback is executed.
   * @author Kenton Carrier
   * @since 1.0.1
   */
  removeFromCalendar() {
    this.setState({ isAddingToCalendar: true });
    return Calendar.deleteEventAsync(this.state.eventCalendarID).then(() =>
      this.setState({ isAddingToCalendar: false, isOnCalendar: false, eventCalendarID: null })
    );
  }

  render() {
    const startDate = this.state.startTime ? moment(this.state.startTime.toDate()) : moment();
    const endDate = this.state.endTime ? moment(this.state.endTime.toDate()) : moment();
    let whenString = '';
    if (startDate.isSame(endDate, 'day')) {
      whenString = `${startDate.format('M/D/YYYY h:mm a')} - ${endDate.format('h:mm a')}`;
    } else {
      whenString = `${startDate.format('M/D/YYYY h:mm a')} - ${endDate.format('M/D/YYYY h:mm a')}`;
    }
    return (
      <>
        {this.state.isLoading && (
          <ActivityIndicator style={styles.image} size="large" color="blue" />
        )}
        {!this.state.isLoading && (
          <View style={{ flex: 1, justifyContent: 'flex-start' }}>
            <Image source={{ uri: this.state.imageRef }} style={styles.image} />
            <View style={styles.body}>
              {this.state.description && <Text style={styles.text}>{this.state.description}</Text>}
              {this.state.address && (
                <>
                  <Text style={styles.boldText}>Where?</Text>
                  <Text style={styles.text}>{this.state.address}</Text>
                </>
              )}
              {this.state.startTime && (
                <>
                  <Text style={styles.boldText}>When?</Text>
                  <Text style={styles.text}>{whenString}</Text>
                </>
              )}
              <View style={styles.buttonContainer}>
                {this.state.address && (
                  <TouchableHighlight
                    onPress={() => openMap({ query: this.state.address })}
                    style={styles.button}
                  >
                    <Text style={styles.buttonText}>Get Directions</Text>
                  </TouchableHighlight>
                )}
                {this.state.startTime && (
                  <TouchableHighlight
                    style={styles.button}
                    onPress={() => {
                      this.state.isOnCalendar ? this.removeFromCalendar() : this.addToCalendar();
                    }}
                  >
                    <Text style={styles.buttonText}>
                      {this.state.isOnCalendar ? 'Remove Event' : 'Add to Calendar'}
                    </Text>
                  </TouchableHighlight>
                )}
              </View>
            </View>
          </View>
        )}
      </>
    );
  }
}

const styles = StyleSheet.create({
  image: {
    height: 250,
    width: '100%',
  },
  button: {
    backgroundColor: '#0033A0E0',
    borderRadius: 5,
    padding: 10,
    width: '45%',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 10,
  },
  buttonText: {
    color: 'white',
  },
  text: {
    fontSize: 17,
  },
  boldText: {
    fontWeight: 'bold',
    fontSize: 17,
  },
  body: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 15,
  },
});

export default withFirebaseHOC(EventView);
