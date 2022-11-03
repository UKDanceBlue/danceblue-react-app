// I removed some unnecessary imports up here
import firestoreBase from "@react-native-firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { FirestoreEvent } from "@ukdanceblue/db-app-common";
import { DateTime } from "luxon";
import { Text } from "native-base";
import { useCallback, useEffect, useRef, useState } from "react";
import { FlatList, SafeAreaView, View } from "react-native";
import { CalendarList, CalendarUtils, DateData } from "react-native-calendars";

import { log, universalCatch } from "../../../../common/logging";
import { timestampToDateTime } from "../../../../common/util/dateTools";
import { useFirebase, useLoading } from "../../../../context";
import { TabNavigatorProps } from "../../../../types/navigationTypes";

// Moved the current date check to inside the component in case someone keeps the app open for a long time or if it doesn't update
// Code the is placed in "module scope" (outside of the component) will run only when the file is imported for the first time
// That is why you usually only want to put true constants and function or class definitions there, because they should never change
const dateFormat = "yyyy-MM-dd";

// This is where I moved the current date check, I set it to startOf("minute") just so it doesn't change super frequently (shouldn't matter though)
const today = DateTime.local().startOf("minute");

const EventListScreen = () => {
  // The useLoading hook is a custom hook defined in the context folder that automatically shows a loading spinner if any of the loading states are true
  // This makes it easy to show a loading spinner when the app is waiting for data from the server or something
  const [ , setRefreshing ] = useLoading("event-list-screen-refreshing");

  const firstLoadNow = useRef(DateTime.local().startOf("minute"));

  const navigation = useNavigation<TabNavigatorProps<"Events">["navigation"]>();

  const {
    fbStorage, fbFirestore
  } = useFirebase();

  const [ events, setEvents ] = useState<FirestoreEvent[]>([]);

  const [ selected, setSelected ] = useState(today.toFormat(dateFormat));
  const [ monthEvents, setMonthEvents ] = useState<FirestoreEvent[]>([]);
  // const [ monthEvents, setMonthEvents ] = useState<({ isFirstOfDay: boolean; event: ParsedFirestoreEvent })[]>([]);
  const [ marked, setMarked ] = useState({});
  const [ sortedMonths, setSortedMonths ] = useState({});

  // I also removed a bunch of hooks you weren't using, some may need to be added back alter but eh

  // Try to use unknown instead of any just to be clear about what you're expecting
  const getDate = useCallback((count: number): unknown => {
    const date = today.toJSDate();
    const newDate = date.setDate(date.getDate() + count);
    return CalendarUtils.getCalendarDateString(newDate);
  }, []);

  const onDayPress = useCallback((day: DateData) => {
    setSelected(day.dateString);
  }, []);

  const onMonthChange = useCallback((month: DateData) => {
    log(`month changed: ${ month.dateString}`);
    const newEvents: FirestoreEvent[] = [];

    // The doesEventHaveInterval is a special kind of function called a type guard
    // Type guards are functions that return a boolean and narrow the type of a variable
    // In this case, it narrows the type of event to ParsedFirestoreEventWithInterval
    // which is just a ParsedFirestoreEvent where we know that the interval property is not undefined
    events.filter((e): e is (typeof e & { interval: NonNullable<typeof e.interval> }) => e.interval != null).forEach((event) => {
      const eventDate: DateTime = timestampToDateTime(event.interval.start);
      if ((eventDate.month - 1) === month.month && eventDate.year === month.year) {
        newEvents.push(event);
      }
    });
    setMonthEvents(newEvents);
  }, [events]);
  //   log("month string = ");
  //   log(month.dateString.substring(0, 7));
  //   const str = month.dateString.substring(0, 7);
  //   if (str in sortedMonths) {
  //     setMonthEvents(sortedMonths[str]);
  //   } else {
  //     setMonthEvents({});
  //   }
  // }, [sortedMonths]);

  const partition = (array: { date: DateTime; event: FirestoreEvent }[], left = 0, right: number = array.length - 1) => {
    const pivot = array[Math.floor((right + left) / 2)];
    let i = left;
    let j = right;

    while (i <= j) {
      while (array[i] < pivot) {
        i++;
      }

      while (array[j] > pivot) {
        j--;
      }

      if (i <= j) {
        [ array[i], array[j] ] = [ array[j], array[i] ];
        i++;
        j--;
      }
    }

    return i;
  };

  const yyyyMMstring = useCallback((date: DateTime) => {
    return date.toString().substring(0, 7);
  }, []);

  const quickSort = useCallback((array: { date: DateTime; event: FirestoreEvent }[], left = 0, right: number = array.length - 1) => {
    let index : number;

    if (array.length > 1) {
      index = partition(array, left, right);

      if (left < index - 1) {
        quickSort(array, left, index - 1);
      }

      if (index < right) {
        quickSort(array, index, right);
      }
    }

    return array;
  }, []);

  const sortEvents = useCallback((events: FirestoreEvent[]) => {
    const sortedObjs: ( { date : DateTime; event: FirestoreEvent })[] = [];
    events.forEach((event) => {
      const date : (DateTime | undefined) = event.interval ? timestampToDateTime(event.interval.start).plus( { month: -1 }) : undefined;
      if (date instanceof DateTime) {
        sortedObjs.push( { date, event } );
      }
    });

    // log("unsorted");
    // sortedObjs.forEach((item) => {
    //   log(`${item.date.toString()} : ${item.event.title}`);
    // });
    quickSort(sortedObjs, 0, sortedObjs.length - 1);
    // log("sorted");
    // sortedObjs.forEach((item) => {
    //   log(`${item.date.toString()} : ${item.event.title}`);
    // });

    const eventsObj: { [monthKey: string] : ( { isFirstOfDay: boolean; event: FirestoreEvent })[] } = {};

    let lastDateAdded: DateTime;


    sortedObjs.forEach((obj) => {
      const monthKey = yyyyMMstring(obj.date);
      log(monthKey);
      // eventsObj[monthKey].push( { isFirstOfDay: (obj.date.day === lastDateAdded.day && obj.date.month === lastDateAdded.month && obj.date.year === lastDateAdded.year), event: obj.event } );
      if (monthKey in eventsObj) {
        eventsObj[monthKey].push( { isFirstOfDay: (obj.date.day === lastDateAdded.day && obj.date.month === lastDateAdded.month && obj.date.year === lastDateAdded.year), event: obj.event } );
      } else {
        let isFirstDay = true;
        if (lastDateAdded instanceof DateTime) {
          isFirstDay = !(obj.date.day === lastDateAdded.day && obj.date.month === lastDateAdded.month && obj.date.year === lastDateAdded.year);
        }
        const newArr: ({ isFirstOfDay: boolean; event: FirestoreEvent })[] = [{ isFirstOfDay: isFirstDay, event: obj.event }];
        eventsObj[monthKey] = newArr;
      }
      lastDateAdded = obj.date;
    });

    setSortedMonths(eventsObj);
    log("sortedMonths =");
    log(eventsObj);
  }, [ quickSort, yyyyMMstring ]);


  // const marked = useMemo(() => {
  //   // TODO: Ok, so here what we need to do is get just the events that are in the current month, and then mark them on the calendar
  //   // I would probably just iterate over monthEvents and then add the event to the marked object
  //   /*
  //   Something like:
  //   const marked = {};
  //   for (const event of monthEvents) {
  //     marked[event.interval.start.toFormat(dateFormat)] = { marked: true };
  //   }
  //   marked[selected] = { selected: true };
  //   marked[now.toFormat(dateFormat)] = { today: true };
  //   return marked;
  //   */
  //   return {
  //     [String(getDate(0))]: {
  //       dotColor: "red",
  //       marked: true
  //     },
  //     [selected]: {
  //       selected: true,
  //       disableTouchEvent: true,
  //       selectedColor: "orange",
  //       selectedTextColor: "red"
  //     }
  //   };
  // }, [ getDate, selected ]);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      log("Loading event list screen from firestore");
      const firestoreEvents: FirestoreEvent[] = [];
      const snapshot = await fbFirestore.collection("events").where("interval.end", ">", firestoreBase.Timestamp.now())
        .get();

      for (const doc of snapshot.docs) {
        const data = doc.data();
        if (FirestoreEvent.isValidJson(data)) {
          firestoreEvents.push(FirestoreEvent.fromJson(data));
        }
      }

      log(`Loaded event list screen from firestore: ${ JSON.stringify(firestoreEvents, null, 2)}`);
      setEvents(firestoreEvents);
      sortEvents(firestoreEvents);
    } catch (error) {
      universalCatch(error);
    } finally {
      setRefreshing(false);
    }
  }, [
    fbFirestore, setRefreshing, sortEvents
  ]);

  useEffect(() => {
    refresh().catch(universalCatch);
  }, [refresh]);

  useEffect(() => {
    onMonthChange({
      dateString: firstLoadNow.current.toFormat(dateFormat),
      month: firstLoadNow.current.month,
      year: firstLoadNow.current.year,
      day: firstLoadNow.current.day,
      timestamp: firstLoadNow.current.toMillis()
    });
  }, [onMonthChange]);

  useEffect(() => {
    const markedDates: Record<string, any> = {};
    for (const event of events) {
      const eventDate = event.interval ? timestampToDateTime(event.interval.start).plus( { month: -1 }) : undefined;
      if (!(eventDate instanceof DateTime)) {
        continue;
      }
      // markedDates[eventDate.toFormat(dateFormat)] = { marked: true, dotColor: "#0033A0" };
      markedDates[eventDate.toFormat(dateFormat)] = { customStyles: { container: { backgroundColor: "#dee8ff" }, text: { color: "black" } } };
    }
    markedDates[today.toFormat(dateFormat)] = { customStyles: { container: { backgroundColor: "#0032A0" }, text: { color: "#FFC72C" } } };
    setMarked(markedDates);
  }, [events]);

  const renderItem = ({ item }: { item: { title: string } }) => (
    <Text> { item.title } </Text>
  );

  /*
   * Called by React Native when rendering the screen
   */
  return (
    <SafeAreaView style={{ display: "flex", flexDirection: "column", height: "100%", width: "100%" }}>
      <CalendarList
        current={today.toFormat(dateFormat)}
        markingType={"custom"}
        markedDates={marked}
        horizontal
        pagingEnabled
        hideArrows = {false}
        theme = {{ arrowColor: "#0032A0", textMonthFontWeight: "bold", textMonthFontSize: 20, textDayFontWeight: "bold", textDayHeaderFontWeight: "500" }}
        onMonthChange={onMonthChange}
      />
      <View style = {{ height: 1, width: "100%", backgroundColor: "gray", paddingBottom: 20 }}/>

      <FlatList
        data={monthEvents.map((event) => ({ title: event.name }))}
        extraData={monthEvents}
        style = {{ backgroundColor: "white" }}
        renderItem = {renderItem}
      />
    </SafeAreaView> );
};

export default EventListScreen;
