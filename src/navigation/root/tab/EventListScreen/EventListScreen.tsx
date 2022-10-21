import firebaseFirestore from "@react-native-firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { format, setMonth } from "date-fns";
import { DateTime, Interval } from "luxon";
import { Container, Text, useTheme } from "native-base";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, SafeAreaView, View } from "react-native";
import { Agenda, AgendaSchedule, CalendarList, CalendarUtils, DateData } from "react-native-calendars";
import { TouchableOpacity } from "react-native-gesture-handler";

import { useColorModeValue } from "../../../../common/customHooks";
import { log, universalCatch } from "../../../../common/logging";
import { useFirebase } from "../../../../context";
import { ParsedFirestoreEvent, RawFirestoreEvent, parseFirestoreEvent } from "../../../../types/FirestoreEvent";
import { TabNavigatorProps } from "../../../../types/navigationTypes";

const TODAY = DateTime.now().toFormat("yyyy-MM-dd");

const EventListScreen = () => {
  const {
    fbStorage, fbFirestore
  } = useFirebase();
  const { colors } = useTheme();
  const screenBackgroundColor = useColorModeValue(colors.white, colors.gray[900]);

  const [ events, setEvents ] = useState<ParsedFirestoreEvent[]>([]);
  const [ agendaSchedule, setAgendaSchedule ] = useState<AgendaSchedule>();
  const [ refreshing, setRefreshing ] = useState(false);

  const [ selectedDay, setSelectedDay ] = useState("");

  const navigation = useNavigation<TabNavigatorProps<"Events">["navigation"]>();

  const [ selected, setSelected ] = useState(TODAY);
  const [ monthEvents, setMonthEvents ] = useState<ParsedFirestoreEvent[]>([]);
  const [ isFirstEventOfDay, setIsFirstEventOfDay ] = useState(true);

  const getDate = (count: number): any => {
    const date = new Date(TODAY);
    const newDate = date.setDate(date.getDate() + count);
    return CalendarUtils.getCalendarDateString(newDate);
  };

  const onDayPress = useCallback((day: DateData) => {
    setSelected(day.dateString);
  }, []);

  const onMonthChange = useCallback((month: DateData) => {
    const newEvents: ParsedFirestoreEvent[] = [];
    const newMonth = new Date(month.dateString);
    events.forEach((event) => {
      if (event.interval != null) {
        const eventDate = DateTime.fromFormat(event.interval.substring(0, 10), "yyyy-MM-dd");
        if ((eventDate.month - 1) === newMonth.getMonth() && eventDate.year === newMonth.getFullYear()) {
          newEvents.push(event);
        }
      }
    });
    setMonthEvents(newEvents);
  }, []);

  const marked = useMemo(() => {
    return {
      [getDate(0)]: {
        dotColor: "red",
        marked: true
      },
      [selected]: {
        selected: true,
        disableTouchEvent: true,
        selectedColor: "orange",
        selectedTextColor: "red"
      }
    };
  }, [selected]);

  // .where("endTime", ">", firebaseFirestore.Timestamp.now())

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      log("Loading event list screen from firestore");
      const firestoreEvents: ParsedFirestoreEvent[] = [];
      const snapshot = await fbFirestore.collection("events")
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
    log(`Split events into today and upcoming: ${ JSON.stringify(todayFromEvents)}/n ${ JSON.stringify(upcomingFromEvents)}`);
    // setToday(todayFromEvents);
    // setUpcoming(upcomingFromEvents);
  }, [events]);

  const displayDayNum = (num: string) => {
    if (isFirstEventOfDay) {
      return num;
    }
  };

  const displayWeekDay = (day: string) => {
    if (isFirstEventOfDay) {
      return day;
    }
  };
  /**
   * Called by React Native when rendering the screen
   */
  return (
    <SafeAreaView style={{ display: "flex", flexDirection: "column", height: "100%", width: "100%" }}>
      <CalendarList
        current={TODAY}
        onDayPress={onDayPress}
        markedDates={marked}
        horizontal
        pagingEnabled
        hideArrows = {false}
        theme = {{ arrowColor: "#0033A0" }}
        onMonthChange={onMonthChange}
      />
      <View style = {{ height: 1, width: "100%", backgroundColor: "gray" }}></View>
      <FlatList
        data={monthEvents}
        style = {{ backgroundColor: "white" }}
        renderItem = { ({ item }) => (
          <View style= {{ flexDirection: "row", flex: 1, height: 80 }}>
            <View style = {{ flexDirection: "row", height: 80, width: 80 }}>
              <View style = {{ width: 78, height: 80, top: 10 }}>
                {/* *** This requires interval member that begins with date format yyyy-MM-dd *** */}
                <Text style = {{ alignSelf: "center", fontSize: 12, color: "#101223" }}> { displayWeekDay(DateTime.fromFormat(item.interval?.substring(0, 10), "yyyy-MM-dd").weekdayShort ) } </Text>
                <Text style = {{ alignSelf: "center", fontSize: 32, color: "#101223", fontWeight: "bold", paddingTop: 10 }}> { displayDayNum(item.interval?.substring(8, 10)) } </Text>
              </View>
              <View style = {{ width: 2, backgroundColor: "#0033A0", alignSelf: "flex-start", height: 70, top: 5 }}/>
            </View>
            <View style = {{ backgroundColor: "#D6DBE6", height: 70, top: 5, borderBottomRightRadius: 10, borderTopRightRadius: 10, width: 320 }}>
              <Text style= {{ fontSize: 16, fontWeight: "bold" }}> {item.title} </Text>
            </View>
          </View>
        )}
      />

    </SafeAreaView> );
};


export default EventListScreen;
