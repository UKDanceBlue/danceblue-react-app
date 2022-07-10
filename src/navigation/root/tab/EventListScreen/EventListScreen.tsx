import firebaseFirestore from "@react-native-firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { DateTime, Interval } from "luxon";
import { Center, Heading, SectionList, useTheme } from "native-base";
import { useCallback, useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";


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
  const [ refreshing, setRefreshing ] = useState(false);

  const navigation = useNavigation<TabNavigatorProps<"Events">["navigation"]>();

  const refresh = useCallback(() => {
    setRefreshing(true);
    const firestoreEvents: ParsedEvent[] = [];
    void fbFirestore.collection("events").where("endTime", ">", firebaseFirestore.Timestamp.now())
      .get()
      .then(
        async (snapshot) => {
          await Promise.all(snapshot.docs.map(async (doc) => {
            const data = doc.data() as FirestoreEvent;
            firestoreEvents.push(await parseFirestoreEvent(data, fbStorage));
          }));

          setEvents(firestoreEvents);
        }
      )
      .finally(() => setRefreshing(false));
  }, [ fbFirestore, fbStorage ]);

  useEffect(() => {
    refresh();
  }, [
    fbFirestore, fbStorage, refresh
  ]);

  /**
   * Splits *events* into *today* and *upcoming* based on the events' start day
   */
  useEffect(() => {
    const todayFromEvents: ParsedEvent[] = [];
    const upcomingFromEvents: ParsedEvent[] = [];
    events.forEach((event) => {
      if (event.interval != null) {
        if (Interval.fromISO(event.interval).overlaps(Interval.fromDateTimes(DateTime.local().startOf("day"), DateTime.local().endOf("day")))) {
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
    <SectionList
      backgroundColor={screenBackgroundColor}
      height="100%"
      onRefresh={refresh}
      refreshing={refreshing}
      sections={
        [
          {
            title: "Today",
            data: today
          }, {
            title: "Upcoming",
            data: upcoming
          }
        ]
      }
      renderSectionHeader={({
        section: {
          title, data
        }
      }) => data.length > 0 ? (
        <Center
          backgroundColor={screenBackgroundColor}
          borderBottomWidth={"1"}
          borderBottomRadius={"xl"}
          shadow={"1"}>
          <Heading fontSize="xl" my={"2"}>
            {title}
          </Heading>
        </Center>
      ) : <></>}
      renderItem={({ item: row }) => (
        <TouchableOpacity
          onPress={() => navigation.navigate("Event", { event: row })}
        >
          <EventRow
            title={row.title}
            blurb={`${row.description.substring(0, 100) }...`}
            interval={row.interval}
            imageSource={{ uri: row.image?.url, width: row.image?.width, height: row.image?.height }}
          />
        </TouchableOpacity>
      )}
    />
  );
};

EventListScreen.navigationOptions = { title: "Events" };

export default EventListScreen;
