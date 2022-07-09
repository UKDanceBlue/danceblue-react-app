import firebaseFirestore from "@react-native-firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { DateTime, Interval } from "luxon";
import { Divider, Heading, ScrollView, useTheme } from "native-base";
import { useEffect, useState } from "react";
import { SafeAreaView, TouchableOpacity } from "react-native";


import { useColorModeValue } from "../../../../common/CustomHooks";
import { useFirebase } from "../../../../common/FirebaseApp";
import EventRow from "../../../../common/components/EventRow";
import { FirestoreEvent, ParsedEvent, parseFirestoreEvent } from "../../../../common/firestore/events";
import { TabNavigatorProps } from "../../../../types/NavigationTypes";

const EventListScreen = () => {
  const {
    fbStorage, fbFirestore
  } = useFirebase();
  const { colors } = useTheme();
  const screenBackgroundColor = useColorModeValue(colors.white, colors.gray[900]);

  const [ events, setEvents ] = useState<ParsedEvent[]>([]);
  const [ today, setToday ] = useState<ParsedEvent[]>([]);
  const [ upcoming, setUpcoming ] = useState<ParsedEvent[]>([]);
  const navigation = useNavigation<TabNavigatorProps<"Events">["navigation"]>();

  useEffect(() => {
    let componentUnmounted = false;
    const firestoreEvents: ParsedEvent[] = [];
    void fbFirestore.collection("events").where("endTime", ">", firebaseFirestore.Timestamp.now())
      .get()
      .then(
        async (snapshot) => {
          await Promise.all(snapshot.docs.map(async (doc) => {
            const data = doc.data() as FirestoreEvent;
            firestoreEvents.push(await parseFirestoreEvent(data, fbStorage));
          }));

          if (!componentUnmounted) {
            setEvents(firestoreEvents);
          }
        }
      );
    return () => {
      componentUnmounted = true;
    };
  }, [ fbFirestore, fbStorage ]);

  /**
   * Splits *events* into *today* and *upcoming* based on the events' start day
   */
  useEffect(() => {
    const todayFromEvents: ParsedEvent[] = [];
    const upcomingFromEvents: ParsedEvent[] = [];
    events.forEach((event) => {
      if (event.interval != null) {
        if (event.interval.overlaps(Interval.fromDateTimes(DateTime.local().startOf("day"), DateTime.local().endOf("day")))) {
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
    <ScrollView backgroundColor={screenBackgroundColor}>
      <SafeAreaView>
        {
          today.length >= 1 &&
          <>
            <Heading fontSize="3xl" m="1">
            Today&apos;s Events
            </Heading>
            <Divider/>
          </>
        }
        {today.map((row, index) => (
          <TouchableOpacity
            onPress={() => navigation.navigate("Event", { event: row })}
            key={index}
          >
            <EventRow
              key={index}
              title={row.title}
              blurb={`${row.description.substring(0, 100) }...`}
              interval={row.interval}
              imageSource={{ uri: row.image?.url, width: row.image?.width, height: row.image?.height }}
            />
          </TouchableOpacity>
        ))}
        {
          upcoming.length >= 1 &&
          <>
            <Heading fontSize="3xl" m="1">
            Upcoming Events
            </Heading>
            <Divider/>
          </>
        }
        {
          upcoming.map((row, index) => (
            <TouchableOpacity
              onPress={() => navigation.navigate("Event", { event: row })}
              key={index}
            >
              <EventRow
                key={index}
                title={row.title}
                blurb={`${row.description.substring(0, 100) }...`}
                interval={row.interval}
                imageSource={{ uri: row.image?.url, width: row.image?.width, height: row.image?.height }}
              />
            </TouchableOpacity>
          ))
        }
      </SafeAreaView>
    </ScrollView>
  );
};

EventListScreen.navigationOptions = { title: "Events" };

export default EventListScreen;
