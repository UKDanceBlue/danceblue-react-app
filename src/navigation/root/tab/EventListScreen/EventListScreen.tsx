import firebaseFirestore from "@react-native-firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { FirestoreEvent } from "@ukdanceblue/db-app-common";
import { DateTime, Interval } from "luxon";
import { Center, Heading, SectionList, Text, useTheme } from "native-base";
import { useCallback, useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";

import EventRow from "../../../../common/components/EventRow";
import { useColorModeValue } from "../../../../common/customHooks";
import { firestoreIntervalToLuxon } from "../../../../common/firestoreUtils";
import { log, universalCatch } from "../../../../common/logging";
import { useFirebase } from "../../../../context";
import { TabNavigatorProps } from "../../../../types/navigationTypes";

const EventListScreen = () => {
  const {
    fbStorage, fbFirestore
  } = useFirebase();
  const { colors } = useTheme();
  const screenBackgroundColor = useColorModeValue(colors.white, colors.gray[900]);

  const [ events, setEvents ] = useState<FirestoreEvent[]>([]);
  const [ today, setToday ] = useState<FirestoreEvent[]>([]);
  const [ upcoming, setUpcoming ] = useState<FirestoreEvent[]>([]);
  const [ refreshing, setRefreshing ] = useState(false);

  const navigation = useNavigation<TabNavigatorProps<"Events">["navigation"]>();

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      log("Loading event list screen from firestore");
      const firestoreEvents: FirestoreEvent[] = [];
      const snapshot = await fbFirestore.collection("events").where("endTime", ">", firebaseFirestore.Timestamp.now())
        .get();

      for (const doc of snapshot.docs) {
        const data = doc.data();
        if (FirestoreEvent.isValidJson(data)) {
          firestoreEvents.push(FirestoreEvent.fromJson(data));
        }
      }

      log(`Loaded event list screen from firestore: ${ JSON.stringify(firestoreEvents)}`);
      setEvents(firestoreEvents);
    } catch (error) {
      universalCatch(error);
    } finally {
      setRefreshing(false);
    }
  }, [fbFirestore]);

  useEffect(() => {
    refresh().catch(universalCatch);
  }, [
    fbFirestore, fbStorage, refresh
  ]);

  /**
   * Splits *events* into *today* and *upcoming* based on the events' start day
   */
  useEffect(() => {
    const todayFromEvents: FirestoreEvent[] = [];
    const upcomingFromEvents: FirestoreEvent[] = [];
    events.forEach((event) => {
      if (event.interval != null) {
        if (firestoreIntervalToLuxon(event.interval).overlaps(Interval.fromDateTimes(DateTime.local().startOf("day"), DateTime.local().endOf("day")))) {
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
              title={row.name}
              blurb={row.shortDescription ? row.shortDescription : (row.description.length > 99 ? `${row.description.substring(0, 100) }...` : row.description)}
              interval={row.interval ? firestoreIntervalToLuxon(row.interval).toISO() : undefined}
              imageSource={row.images == null ? undefined : row.images[0]}
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
