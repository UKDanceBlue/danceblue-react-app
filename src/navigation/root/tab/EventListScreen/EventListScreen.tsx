import firebaseFirestore from "@react-native-firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { DateTime, Interval } from "luxon";
import { Center, Heading, SectionList, Text, useTheme } from "native-base";
import { useCallback, useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";

import { useColorModeValue } from "../../../../common/CustomHooks";
import { useFirebase } from "../../../../common/FirebaseApp";
import EventRow from "../../../../common/components/EventRow";
import { log, universalCatch } from "../../../../common/logging";
import { TabNavigatorProps } from "../../../../types/NavigationTypes";
import { ParsedFirestoreEvent, RawFirestoreEvent, parseFirestoreEvent } from "../../../../types/events";

const EventListScreen = () => {
  const {
    fbStorage, fbFirestore
  } = useFirebase();
  const { colors } = useTheme();
  const screenBackgroundColor = useColorModeValue(colors.white, colors.gray[900]);

  const [ events, setEvents ] = useState<ParsedFirestoreEvent[]>([]);
  const [ today, setToday ] = useState<ParsedFirestoreEvent[]>([]);
  const [ upcoming, setUpcoming ] = useState<ParsedFirestoreEvent[]>([]);
  const [ refreshing, setRefreshing ] = useState(false);

  const navigation = useNavigation<TabNavigatorProps<"Events">["navigation"]>();

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      log("Loading event list screen from firestore");
      const firestoreEvents: ParsedFirestoreEvent[] = [];
      const snapshot = await fbFirestore.collection("events").where("endTime", ">", firebaseFirestore.Timestamp.now())
        .get();
      await Promise.all(snapshot.docs.map(async (doc) => {
        const data = doc.data() as RawFirestoreEvent;
        firestoreEvents.push(await parseFirestoreEvent(data, fbStorage));
      }));

      log(`Loaded event list screen from firestore: ${ JSON.stringify(firestoreEvents)}`);
      setEvents(firestoreEvents);
    } catch (error) {
      universalCatch(error);
    } finally {
      setRefreshing(false);
    }
  }, [ fbFirestore, fbStorage ]);

  useEffect(() => {
    refresh().catch(universalCatch);
  }, [
    fbFirestore, fbStorage, refresh
  ]);

  /**
   * Splits *events* into *today* and *upcoming* based on the events' start day
   */
  useEffect(() => {
    const todayFromEvents: ParsedFirestoreEvent[] = [];
    const upcomingFromEvents: ParsedFirestoreEvent[] = [];
    events.forEach((event) => {
      if (event.interval != null) {
        if (Interval.fromISO(event.interval).overlaps(Interval.fromDateTimes(DateTime.local().startOf("day"), DateTime.local().endOf("day")))) {
          todayFromEvents.push(event);
        } else {
          upcomingFromEvents.push(event);
        }
      }
    });
    log(`Split events into today and upcoming: ${ JSON.stringify(todayFromEvents)} ${ JSON.stringify(upcomingFromEvents)}`);
    setToday(todayFromEvents);
    setUpcoming(upcomingFromEvents);
  }, [events]);

  /**
   * Called by React Native when rendering the screen
   */
  return (
    <>
      <SectionList
        backgroundColor={screenBackgroundColor}
        height={!refreshing && events.length === 0 ? 0 : "100%"}
        onRefresh={() => refresh().catch(universalCatch)}
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
              blurb={row.description.length > 99 ? `${row.description.substring(0, 100) }...` : row.description}
              interval={row.interval}
              imageSource={row.image == null ? undefined : { uri: row.image.url, width: row.image.width, height: row.image.height }}
            />
          </TouchableOpacity>
        )}
      />
      {
        !refreshing && events.length === 0 &&
        <Text>No Events</Text>
      }
    </>
  );
};

EventListScreen.navigationOptions = { title: "Events" };

export default EventListScreen;
