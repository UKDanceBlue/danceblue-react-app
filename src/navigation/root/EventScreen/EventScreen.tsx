import { useRoute } from "@react-navigation/native";
import { DateTime } from "luxon";
import { Heading, Image, Text, VStack } from "native-base";

import { RootStackScreenProps } from "../../../types/NavigationTypes";

const EventScreen = () => {
  const {
    params: {
      event: {
        title, description, address, image, interval
      }
    }
  } = useRoute<RootStackScreenProps<"Event">["route"]>();

  let whenString = "";
  if (interval != null) {
    if (interval.start.toMillis() === DateTime.now().startOf("day").toMillis() && interval.end.toMillis() === DateTime.now().endOf("day").toMillis()) {
      // All day today
      whenString = interval.start.toFormat("All Day Today");
    } else if (interval.start.toMillis() === interval.start.startOf("day").toMillis() && interval.end.toMillis() === interval.end.endOf("day").toMillis()) {
      // All day some other day
      if (interval.start.toISODate() === interval.end.toISODate()) {
        // All day on the same day
        whenString = `All Day ${interval.start.toFormat("L/d/yyyy")}`;
      } else {
        // All day on different days
        whenString = interval.start.toFormat(`All Day ${interval.start.toFormat("L/d/yyyy")} - ${interval.end.toFormat("L/d/yyyy")}`);
      }
    } else if (interval.hasSame("day")) {
      whenString = `${interval.start.toFormat("L/d/yyyy h:mm a")} - ${interval.end.toFormat("h:mm a")}`;
    } else {
      whenString = interval.toFormat("L/d/yyyy h:mm a");
    }
  }

  return (<VStack>
    <Image
      source={{ uri: image?.url, width: image?.width, height: image?.width }}
    />
    <Heading>{title}</Heading>
    <Text>{whenString}</Text>
    <Text>{description}</Text>
    <Map
  </VStack>);
};

export default EventScreen;
