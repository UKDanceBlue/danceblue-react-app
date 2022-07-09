import { useRoute } from "@react-navigation/native";
import { DateTime, Interval } from "luxon";
import { Box, Heading, Image, Pressable, Text, VStack } from "native-base";
import openMap from "react-native-open-maps";

import { RootStackScreenProps } from "../../../types/NavigationTypes";

const EventScreen = () => {
  const {
    params: {
      event: {
        title, description, address, image, interval: intervalString
      }
    }
  } = useRoute<RootStackScreenProps<"Event">["route"]>();

  const interval = intervalString ? Interval.fromISO(intervalString) : undefined;

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

  return (
    <VStack safeArea>
      <Image
        source={{ uri: image?.url, width: image?.width, height: image?.width }}
        alt={title}
        style={{ width: "100%", maxHeight: 200 }}
        resizeMode="contain"
      />
      <Heading>{title}</Heading>
      <Text>{whenString}</Text>
      <Text>{description}</Text>
      {address && <Pressable
        onPress={() => openMap({ query: address })}
        _pressed={{ opacity: 0.6 }}>
        <Box
          width={"4/5"}
          height={200}
          borderRadius={10}
          backgroundColor={"#fff"}
          p={3}
          alignSelf={"center"}
        >
          <Text>{address}</Text>
        </Box>
      </Pressable>}
    </VStack>
  );
};

export default EventScreen;
