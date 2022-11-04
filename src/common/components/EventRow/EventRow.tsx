import { DownloadableImage, FirestoreImage } from "@ukdanceblue/db-app-common";
import { DateTime, Interval } from "luxon";
import { Box, Heading, Image, Spinner, Text, useTheme } from "native-base";
import { useEffect, useState } from "react";
import { useWindowDimensions } from "react-native";

import { useFirebase } from "../../../context";
import { useColorModeValue } from "../../customHooks";


/**
 * A simple row of *Event*s from *startDate* to *endDate*
 */
const EventRow = ({
  imageSource,
  title,
  interval: intervalString,
  blurb,
}: {
  imageSource?: FirestoreImage;
  title: string;
  interval?: ReturnType<Interval["toISO"]>;
  blurb?: string;
}) => {
  const { width: windowWidth } = useWindowDimensions();
  const { fbStorage } = useFirebase();
  const { colors } = useTheme();
  const backgroundColor = useColorModeValue(colors.gray[300], colors.gray[600]);

  const [ downloadableImage, setDownloadableImage ] = useState<DownloadableImage>();

  const interval = intervalString ? Interval.fromISO(intervalString) : undefined;

  useEffect(() => {
    if (imageSource) {
      DownloadableImage.fromFirestoreImage(
        imageSource,
        (uri: string) => {
          if (uri.startsWith("gs://")) {
            return fbStorage.refFromURL(uri).getDownloadURL();
          } else {
            return Promise.resolve(uri);
          }
        }
      )
        .then(setDownloadableImage)
        .catch(console.error);
    }
  }, [ fbStorage, imageSource ]);

  /**
   * Called to generate a React Native component
   */
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
    <Box
      flexDirection="row"
      justifyContent={"space-around"}
      alignItems={"center"}
      backgroundColor={backgroundColor}
      m={5}
      p={3}
      pl={2}
      borderRadius={10}
      borderWidth={1}
      shadow={"6"}
    >
      {downloadableImage &&
        <Image
          testID="event-thumbnail"
          source={{
            uri: downloadableImage.url,
            height: downloadableImage.height,
            width: downloadableImage.width,
            cache: "force-cache",
          }}
          alt="Event Thumbnail"
          width={windowWidth / 4}
          height={windowWidth / 4}
          resizeMode="contain"
          flex={2}/>
      }
      {!downloadableImage &&
        <Spinner
          testID="event-thumbnail-spinner"
          accessibilityLabel="Loading event thumbnail"
          color={colors.blue[500]}
          size="lg"
          flex={2}
          width={windowWidth / 4}
          height={windowWidth / 4}
        />
      }
      <Box flexDirection="column" ml={3} flex={5}>
        <Heading testID="event-title" fontSize="xl">{title}</Heading>
        <Text testID="event-time-interval" italic fontSize="2xs">{whenString}</Text>
        {blurb && <Text testID="event-blurb">{blurb}</Text>}
      </Box>
    </Box>
  );
};

export default EventRow;
