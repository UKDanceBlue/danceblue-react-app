import { Interval } from "luxon";
import { Box, Heading, Image, Text, useTheme } from "native-base";
import { ImageSourcePropType, useWindowDimensions } from "react-native";

import { useColorModeValue } from "../../CustomHooks";


/**
 * A simple row of *Event*s from *startDate* to *endDate*
 */
const EventRow = ({
  imageSource,
  title,
  interval,
  blurb,
}: {
  imageSource?: ImageSourcePropType;
  title: string;
  interval: Interval;
  blurb?: string;
}) => {
  const { width: windowWidth } = useWindowDimensions();
  const { colors } = useTheme();
  const backgroundColor = useColorModeValue(colors.gray[300], colors.gray[600]);

  /**
   * Called to generate a React Native component
   */
  let whenString = "";
  if (interval.hasSame("day")) {
    whenString = `${interval.start.toFormat("L/d/yyyy h:mm a")} - ${interval.end.toFormat("h:mm a")}`;
  } else {
    whenString = interval.toFormat("L/d/yyyy h:mm a");
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
      {imageSource &&
        <Image
          testID="event-thumbnail"
          source={imageSource}
          alt="Event Thumbnail"
          width={windowWidth / 4}
          height={windowWidth / 4}
          resizeMode="contain"
          flex={2}/>
      }
      <Box flexDirection="column" ml={imageSource ? 3 : 0} flex={5}>
        <Heading testID="event-title" fontSize="xl">{title}</Heading>
        <Text testID="event-time-interval" italic fontSize="2xs">{whenString}</Text>
        {blurb && <Text testID="event-blurb">{blurb}</Text>}
      </Box>
    </Box>
  );
};

export default EventRow;
