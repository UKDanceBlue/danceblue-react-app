import { useRoute } from "@react-navigation/native";
import { setStringAsync } from "expo-clipboard";
import { DateTime, Interval } from "luxon";
import { Box, Heading, Image, Pressable, ScrollView, Text, VStack } from "native-base";
import { useWindowDimensions } from "react-native";
import { WebView } from "react-native-webview";

import { showMessage } from "../../../common/util/AlertUtils";
import { RootStackScreenProps } from "../../../types/NavigationTypes";

const EventScreen = () => {
  const {
    params: {
      event: {
        title, description, address, image, interval: intervalString
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
        {address != null &&
          <Pressable
            onPress={() => {
              setStringAsync(address).then(() => {
                showMessage(undefined, "Address copied to clipboard");
              }).catch(showMessage);
            }}
            _pressed={{ opacity: 0.6 }}
          >
            <Text mx={2} color="blue.900">{address}</Text>
          </Pressable>
        }
        <Text mx={2}>{whenString}</Text>
        <Text mx={2}>{description}</Text>
        {address &&
          <Box
            width="100%"
            height="40%"
            p={3}
          >
            <WebView
              style={{ width: "100%", height: "100%" }}
              scrollEnabled={false}
              source={{
                html: `<iframe
                      width="100%"
                      height="100%"
                      frameborder="0" style="border:0"
                      referrerpolicy="no-referrer-when-downgrade"
                      src="https://www.google.com/maps/embed/v1/place?key=AIzaSyDGsPvQP-A9jgYnY5yxl3J9hRYJelsle9w&q=${address}&zoom=17&region=us"
                      >
                    </iframe>`
              }} />
          </Box>
        }
      </ScrollView>
    </VStack>
  );
};

export default EventScreen;
