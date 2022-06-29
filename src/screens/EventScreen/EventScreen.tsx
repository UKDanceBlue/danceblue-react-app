import firebaseFirestore, { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";


import { FirestoreEvent } from "../../types/FirebaseTypes";
import { TabScreenProps } from "../../types/NavigationTypes";

import EventRow from "./EventRow";

interface EventType extends FirestoreEvent {
  id: string;
}

/**
 * Component for "Events" screen in main navigation
 *
 * TODO figure out how this works and then:
 *  1. Simplify it
 *  2. Add inline comments
 *  3. Make it a function component if possible
 */
const EventScreen = () => {
  const [ events, setEvents ] = useState<EventType[]>([]);
  const [ today, setToday ] = useState<EventType[]>([]);
  const [ upcoming, setUpcoming ] = useState<EventType[]>([]);
  const navigation = useNavigation<TabScreenProps<"Events">["navigation"]>();

  useEffect(() => {
    let componentUnmounted = false;
    const firestoreEvents: EventType[] = [];
    void firebaseFirestore().collection("events").where("endTime", ">", "now")
      .get()
      .then(
        (snapshot) => {
          snapshot.forEach((document) => {
            const startTime = document.get("startTime");
            const endTime = document.get("endTime");
            return firestoreEvents.push({
              id: document.id,
              title: document.get("title"),
              description: document.get("description"),
              image: document.get("image")?.toString(),
              address: document.get("address")?.toString(),
              startTime: startTime instanceof FirebaseFirestoreTypes.Timestamp ? startTime : undefined,
              endTime: endTime instanceof FirebaseFirestoreTypes.Timestamp ? endTime : undefined,
            });
          });

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
      if (event.startTime != null) {
        const startTime = event.startTime.toMillis();
        if (startTime <= DateTime.now().toMillis()) {
          todayFromEvents.push(event);
        } else {
          upcomingFromEvents.push(event);
        }
      }
    });
    setToday(todayFromEvents);
    setUpcoming(upcomingFromEvents);
  }, [events]);

  /**
   * Called by React Native when rendering the screen
   */
  return (
    <ScrollView style={styles.body}>
      <SafeAreaView>
        <Text style={styles.heading}>Today&apos;s Events</Text>
        {today.map((row) => (
          <TouchableOpacity
            style={styles.eventRow}
            onPress={() => navigation.navigate("Event", { id: row.id, name: row.title })}
            key={row.id}
          >
            <EventRow
              key={row.id}
              title={row.title}
              startDate={DateTime.fromMillis(row.startTime?.toMillis() ?? 0)}
              endDate={DateTime.fromMillis(row.endTime?.toMillis() ?? 0)}
              imageLink={row.image}
            />
          </TouchableOpacity>
        ))}
        <Text style={styles.heading}>Upcoming Events</Text>
        {
          /* Jscpd:ignore-start */
          upcoming.map((row) => (
            <TouchableOpacity
              style={styles.eventRow}
              onPress={() => navigation.navigate("Event", { id: row.id, name: row.title })}
              key={row.id}
            >
              <EventRow
                key={row.id}
                title={row.title}
                startDate={DateTime.fromMillis(row.startTime?.toMillis() ?? 0)}
                endDate={DateTime.fromMillis(row.endTime?.toMillis() ?? 0)}
                imageLink={row.image}
              />
            </TouchableOpacity>
          ))
          /* Jscpd:ignore-end */
        }
      </SafeAreaView>
    </ScrollView>
  );
};

EventScreen.navigationOptions = { title: "Events" };

const styles = StyleSheet.create({
  body: {
    backgroundColor: "white",
    flex: 1,
    padding: 10,
  },
  eventRow: {
    marginBottom: 5,
    marginTop: 5,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default EventScreen;
