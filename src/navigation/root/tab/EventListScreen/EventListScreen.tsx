import firebaseFirestore from "@react-native-firebase/firestore";
import firebaseStorage from "@react-native-firebase/storage";
import { useNavigation } from "@react-navigation/native";
import { DateTime, Interval } from "luxon";
import { ScrollView, Text } from "native-base";
import { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, TouchableOpacity } from "react-native";


import EventRow from "../../../../common/components/EventRow";
import { FirestoreEvent } from "../../../../types/FirebaseTypes";
import { TabNavigatorProps } from "../../../../types/NavigationTypes";


interface EventType extends FirestoreEvent {
  id: string;
  imageUrl: string;
}

const EventListScreen = () => {
  const [ events, setEvents ] = useState<EventType[]>([]);
  const [ today, setToday ] = useState<EventType[]>([]);
  const [ upcoming, setUpcoming ] = useState<EventType[]>([]);
  const navigation = useNavigation<TabNavigatorProps<"Events">["navigation"]>();

  useEffect(() => {
    let componentUnmounted = false;
    const firestoreEvents: EventType[] = [];
    void firebaseFirestore().collection("events").where("endTime", ">", firebaseFirestore.Timestamp.now())
      .get()
      .then(
        async (snapshot) => {
          await Promise.all(snapshot.docs.map(async (document) => {
            const startTime = document.get("startTime");
            const endTime = document.get("endTime");
            firestoreEvents.push({
              id: document.id,
              title: document.get("title"),
              description: document.get("description"),
              imageUrl: await firebaseStorage().ref(document.get("image")?.toString()).getDownloadURL(),
              address: document.get("address")?.toString(),
              startTime: startTime instanceof firebaseFirestore.Timestamp ? startTime : undefined,
              endTime: endTime instanceof firebaseFirestore.Timestamp ? endTime : undefined,
            });
          }));

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
              blurb={`${row.description.substring(0, 100) }...`}
              interval={Interval.fromDateTimes(DateTime.fromMillis(row.startTime?.toMillis() ?? 0), DateTime.fromMillis(row.endTime?.toMillis() ?? 0))}
              imageSource={{ uri: row.imageUrl }}
            />
          </TouchableOpacity>
        ))}
        <Text style={styles.heading}>Upcoming Events</Text>
        {
          upcoming.map((row) => (
            <TouchableOpacity
              style={styles.eventRow}
              onPress={() => navigation.navigate("Event", { id: row.id, name: row.title })}
              key={row.id}
            >
              <EventRow
                key={row.id}
                title={row.title}
                blurb={`${row.description.substring(0, 100) }...`}
                interval={Interval.fromDateTimes(DateTime.fromMillis(row.startTime?.toMillis() ?? 0), DateTime.fromMillis(row.endTime?.toMillis() ?? 0))}
                imageSource={{
                  uri: row.imageUrl,
                  width: 128
                }}
              />
            </TouchableOpacity>
          ))
        }
      </SafeAreaView>
    </ScrollView>
  );
};

EventListScreen.navigationOptions = { title: "Events" };
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

export default EventListScreen;
