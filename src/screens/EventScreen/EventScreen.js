import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Text } from 'react-native';
import { collection, getDocs, where, query } from 'firebase/firestore';
import EventRow from './EventRow';
import { firebaseFirestore } from '../../firebase/FirebaseApp';

const now = new Date();

/**
 * Component for "Events" screen in main navigation
 * @param {Object} props Properties of the component: navigation, firebase
 *
 * TODO figure out how this works and then:
 *  1. Simplify it
 *  2. Add inline comments
 *  3. Make it a function component if possible
 */
const EventScreen = ({ navigation: { navigate } }) => {
  const [events, setEvents] = useState([]);
  const [today, setToday] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getSnapshot() {
      const firestoreEvents = [];
      const snapshot = await getDocs(
        query(collection(firebaseFirestore, 'events'), where('endTime', '>', now))
      );
      snapshot.forEach((document) => firestoreEvents.push({ id: document.id, ...document.data() }));
      setEvents(firestoreEvents);
      setIsLoading(false);
    }
    getSnapshot();
  }, []);

  /**
   * Splits *events* into *today* and *upcoming* based on the events' start day
   */
  useEffect(() => {
    const todayFromEvents = [];
    const upcomingFromEvents = [];
    events.forEach((event) => {
      const startTime = event.startTime.toDate();
      if (startTime <= now) todayFromEvents.push(event);
      else upcomingFromEvents.push(event);
    });
    setToday(todayFromEvents);
    setUpcoming(upcomingFromEvents);
  }, [events]);

  /**
   * Called by React Native when rendering the screen
   * @returns A JSX formatted Component
   */
  return (
    <ScrollView style={styles.body}>
      <SafeAreaView>
        <Text style={styles.heading}>Today&apos;s Events</Text>
        {today.map((row) => (
          <TouchableOpacity
            style={styles.eventRow}
            onPress={() => navigate('Event', { id: row.id, name: row.title })}
            key={row.id}
          >
            <EventRow
              styles={styles}
              key={row.id}
              id={row.id}
              title={row.title}
              startDate={row.startTime.toDate()}
              endDate={row.endTime.toDate()}
              text={row.text}
              showIfToday
              imageLink={row.image}
            />
          </TouchableOpacity>
        ))}
        <Text style={styles.heading}>Upcoming Events</Text>
        {
          /* jscpd:ignore-start */
          upcoming.map((row) => (
            <TouchableOpacity
              style={styles.eventRow}
              onPress={() => navigate('Event', { id: row.id, name: row.title })}
              key={row.id}
            >
              <EventRow
                styles={styles}
                key={row.id}
                id={row.id}
                title={row.title}
                startDate={row.startTime.toDate()}
                endDate={row.endTime.toDate()}
                text={row.text}
                showIfToday
                imageLink={row.image}
              />
            </TouchableOpacity>
          ))
          /* jscpd:ignore-end */
        }
      </SafeAreaView>
    </ScrollView>
  );
};

EventScreen.navigationOptions = {
  title: 'Events',
};

const styles = StyleSheet.create({
  eventRow: {
    marginTop: 5,
    marginBottom: 5,
  },
  body: {
    padding: 10,
    backgroundColor: 'white',
    flex: 1,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default EventScreen;
