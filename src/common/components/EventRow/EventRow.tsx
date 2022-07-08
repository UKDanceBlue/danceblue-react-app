import { Interval } from "luxon";
import { Box, Heading, Image, Text, useTheme } from "native-base";
import { ImageSourcePropType, useWindowDimensions } from "react-native";


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
      backgroundColor={colors.gray[300]}
      safeArea>
      {imageSource &&
      <Image
        testID="event-thumbnail"
        source={imageSource}
        alt="Event Thumbnail"
        width={windowWidth / 4}
        height={windowWidth / 4}
        resizeMode="center"/>}
      <Box flexDirection="column" width={(windowWidth / 4 * 2.5)}>
        <Heading testID="event-title">{title}</Heading>
        <Text testID="event-time-interval">{whenString}</Text>
        {blurb && <Text testID="event-blurb">{blurb}</Text>}
      </Box>
    </Box>
  );
};

export default EventRow;
