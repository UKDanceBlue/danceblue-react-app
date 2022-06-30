import { MaterialIcons } from "@expo/vector-icons";
import { DateTime } from "luxon";
import { ActivityIndicator, Image, StyleSheet, View } from "react-native";
import { Text } from "react-native-elements";

import { useFirebaseStorageUrl } from "../../common/CustomHooks";

/**
 * A simple row of *Event*s from *startDate* to *endDate*
 */
const EventRow = ({
  imageLink,
  startDate,
  endDate,
  title,
}: {
  imageLink?: string;
  startDate: DateTime;
  endDate: DateTime;
  title: string;
}) => {
  const [ imageRef, imageRefError ] = useFirebaseStorageUrl(imageLink);

  /**
   * Called to generate a React Native component
   */
  let whenString = "";
  if (startDate.equals(endDate)) {
    whenString = `${startDate.toFormat("L/d/yyyy h:mm a")} - ${endDate.toFormat("h:mm a")}`;
  } else {
    whenString = `${startDate.toFormat("L/d/yyyy h:mm a")} - ${endDate.toFormat("L/d/yyyy h:mm a")}`;
  }
  return (
    <View style={styles.body}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.date}>{whenString}</Text>
      </View>
      <View style={styles.imageContainer}>
        {!imageRef && !imageRefError && <ActivityIndicator size="large" color="blue" />}
        {imageRefError && <MaterialIcons name="image-not-supported" size={36} color="black" />}
        {imageRef && <Image style={styles.image} source={{ uri: imageRef }} />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    borderColor: "#3248a8",
    borderRadius: 10,
    borderWidth: 2,
    flexDirection: "row",
    flex: 1,
    padding: 5,
  },
  date: {
    flex: 1,
    flexGrow: 0,
    flexShrink: 1,
    fontSize: 17,
  },
  image: {
    flex: 1,
    resizeMode: "contain",
  },
  imageContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  textContainer: {
    flex: 4,
    flexGrow: 1,
    flexShrink: 1,
  },
  title: {
    flex: 1,
    flexGrow: 0,
    flexShrink: 1,
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default EventRow;
