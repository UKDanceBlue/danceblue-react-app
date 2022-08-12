import { useRoute } from "@react-navigation/native";
import { PermissionStatus, createEventAsync, getCalendarPermissionsAsync, requestCalendarPermissionsAsync } from "expo-calendar";
import { setStringAsync } from "expo-clipboard";
import { openBrowserAsync } from "expo-web-browser";
import { DateTime, Interval } from "luxon";
import { Box, Button, Heading, Image, Pressable, ScrollView, Text, VStack, useTheme } from "native-base";
import { useWindowDimensions } from "react-native";
import openMaps from "react-native-open-maps";
import { WebView } from "react-native-webview";

import { showMessage } from "../../../common/util/AlertUtils";
import { discoverDefaultCalendar } from "../../../common/util/calendar";
import { RootStackScreenProps } from "../../../types/NavigationTypes";

const EventScreen = () => {
  const {
    params: {
      event: {
        title, description, address, image, interval: intervalString, link
      }
    }
  } = useRoute<RootStackScreenProps<"Event">["route"]>();

  const {
    width: screenWidth, height: screenHeight
  } = useWindowDimensions();

  const { colors } = useTheme();

  const interval = intervalString ? Interval.fromISO(intervalString) : undefined;

  let whenString = "";
  let allDay = false;
  if (interval != null) {
    if (interval.start.toMillis() === DateTime.now().startOf("day").toMillis() && interval.end.toMillis() === DateTime.now().endOf("day").toMillis()) {
      // All day today
      whenString = interval.start.toFormat("All Day Today");
      allDay = true;
    } else if (interval.start.toMillis() === interval.start.startOf("day").toMillis() && interval.end.toMillis() === interval.end.endOf("day").toMillis()) {
      // All day some other day
      if (interval.start.toISODate() === interval.end.toISODate()) {
        // All day on the same day
        whenString = `All Day ${interval.start.toFormat("L/d/yyyy")}`;
        allDay = true;
      } else {
        // All day on different days
        whenString = interval.start.toFormat(`All Day ${interval.start.toFormat("L/d/yyyy")} - ${interval.end.toFormat("L/d/yyyy")}`);
        allDay = true;
      }
    } else if (interval.hasSame("day")) {
      whenString = `${interval.start.toFormat("L/d/yyyy h:mm a")} - ${interval.end.toFormat("h:mm a")}`;
    } else {
      whenString = interval.toFormat("L/d/yyyy h:mm a");
    }
  }

  return (
    <VStack h="full">
      <ScrollView>
        {image != null &&
          <Image
            source={{ uri: image.url, width: image.width, height: image.width }}
            alt={title}
            style={{ width: "100%", height: Math.min(image.height, (screenWidth * (image.height / image.width))) }}
            resizeMode="contain"
          />
        }
        <Heading my={1} mx={2} textAlign="center">{title}</Heading>
        {address != null &&
          <Pressable
            onPress={() => {
              setStringAsync(address).then(() => {
                showMessage(undefined, "Address copied to clipboard");
              }).catch(showMessage);
            }}
            _pressed={{ opacity: 0.6 }}
          >
            <Text
              mx={2}
              textAlign="center"
              color="darkBlue.700"
            >
              {address}
            </Text>
          </Pressable>
        }
        <Text textAlign="center" mx={2} mb={2}>{whenString}</Text>

        <Button onPress={() => void (async () => {
          const permissionResponse = (await getCalendarPermissionsAsync());
          let permissionStatus = permissionResponse.status;
          const { canAskAgain } = permissionResponse;

          if (permissionStatus === PermissionStatus.DENIED) {
            showMessage("Go to your device settings to enable calendar access", "Calendar access denied");
          } else if (permissionStatus === PermissionStatus.UNDETERMINED || canAskAgain) {
            permissionStatus = (await requestCalendarPermissionsAsync()).status;
          }

          if (permissionStatus === PermissionStatus.GRANTED) {
            const defaultCalendar = await discoverDefaultCalendar();
            if (defaultCalendar == null) {
              showMessage(undefined, "No calendar found");
            } else {
              createEventAsync(defaultCalendar.id, {
                title,
                allDay,
                notes: description,
                startDate: interval?.start.toJSDate(),
                endDate: interval?.end.toJSDate(),
                location: address
              }).then(() => {
                showMessage(undefined, "Event created");
              }).catch(showMessage);
            }
          }
        })()}>
          Add to my calendar
        </Button>

        <Text mt={2} mx={2}>{description}</Text>
        {link && <Pressable
          _pressed={{ opacity: 0.6 }}
          width="full"
          mx={2}
          mb={2}
          onPress={() => {
            void openBrowserAsync(link.url);
          }}
        >
          <Text
            textAlign="center"
            color="blue.600"
            underline>
            {link.text}
          </Text>
        </Pressable>}

        {address &&
          <Box
            height={screenHeight * .4}
            p={3}
          >
            <Pressable
              _pressed={{ opacity: 0.5 }}
              onPress={(e) => {
                e.preventDefault();
                e.stopPropagation();
                openMaps({
                  query: address,
                  mapType: "standard"
                });
              }}
              width="100%"
              height="100%"
            >
              <WebView
                style={{ width: "100%", height: "100%" }}
                scrollEnabled={false}
                focusable={false}
                pointerEvents="none"
                containerStyle={{ borderRadius: 5, borderWidth: 2, borderColor: colors.secondary[800] }}
                source={{
                  html: `<iframe
                      width="100%"
                      height="98%"
                      frameborder="0" style="border:0"
                      referrerpolicy="no-referrer-when-downgrade"
                      src="https://www.google.com/maps/embed/v1/place?key=AIzaSyDGsPvQP-A9jgYnY5yxl3J9hRYJelsle9w&q=${address}&zoom=17&region=us"
                      >
                    </iframe>`
                }} />
            </Pressable>
          </Box>
        }
      </ScrollView>
    </VStack>
  );
};

export default EventScreen;
