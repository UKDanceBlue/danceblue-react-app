import { useRoute } from "@react-navigation/native";
import { DateTime, Interval } from "luxon";
import { Heading, Image, Pressable, ScrollView, Text, VStack } from "native-base";
import { useWindowDimensions } from "react-native";
import MapView, { Geojson, PROVIDER_GOOGLE } from "react-native-maps";
import openMap from "react-native-open-maps";

import { RootStackScreenProps } from "../../../types/NavigationTypes";

const EventScreen = () => {
  const {
    params: {
      event: {
        title, description, address, image, interval: intervalString, addressGeoJson
      }
    }
  } = useRoute<RootStackScreenProps<"Event">["route"]>();

  const { width: screenWidth } = useWindowDimensions();

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
    <VStack safeArea h="full">
      <ScrollView>
        {image != null &&
          <Image
            source={{ uri: image.url, width: image.width, height: image.width }}
            alt={title}
            style={{ width: "100%", height: Math.min(image.height, (screenWidth * (image.height / image.width))) }}
            resizeMode="contain"
          />
        }
        <Heading mx={2}>{title}</Heading>
        <Text mx={2}>{whenString}</Text>
        <Text mx={2}>{description}</Text>
        {address && addressGeoJson && <Pressable
          onPress={() => openMap({ query: address })}
          _pressed={{ opacity: 0.6 }}>
          <MapView provider={PROVIDER_GOOGLE} >
            <Geojson
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              geojson={JSON.parse(addressGeoJson)}
              strokeColor="red"
              fillColor="green"
              strokeWidth={2}
            />
          </MapView>
        </Pressable>}
      </ScrollView>
    </VStack>
  );
};

export default EventScreen;
