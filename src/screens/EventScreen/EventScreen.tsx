import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Text } from 'react-native';
import { collection, getDocs, where, query } from 'firebase/firestore';
import EventRow from './EventRow';
import { firebaseFirestore } from '../../common/FirebaseApp';
import { FirestoreEvent } from '../../types/FirebaseTypes';

const now = new Date();
interface EventType extends FirestoreEvent {
  id: string;
}

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
  const [events, setEvents] = useState<EventType[]>([]);
  const [today, setToday] = useState<EventType[]>([]);
  const [upcoming, setUpcoming] = useState<EventType[]>([]);

  useEffect(() => {
    let componentUnmounted = false;
    const firestoreEvents: EventType[] = [];
    getDocs(query(collection(firebaseFirestore, 'events'), where('endTime', '>', now))).then(
      (snapshot) => {
        snapshot.forEach((document) =>
          firestoreEvents.push({
            id: document.id,
            title: document.get('title'),
            description: document.get('description'),
            image: document.get('image'),
            address: document.get('address'),
            startTime: document.get('startTime'),
            endTime: document.get('endTime'),
          })
        );

        if (!componentUnmounted) {
          setEvents(firestoreEvents);
        }
      }
    );
    return () => {
      componentUnmounted = true;
    };
  }, []);

  /**
   * Splits *events* into *today* and *upcoming* based on the events' start day
   */
  useEffect(() => {
    const todayFromEvents: EventType[] = [];
    const upcomingFromEvents: EventType[] = [];
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
