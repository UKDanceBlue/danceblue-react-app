import { MaterialIcons } from "@expo/vector-icons";
import { Text } from "native-base";
import { ActivityIndicator, Image, StyleSheet, View } from "react-native";

import { useFirebaseStorageUrl } from "../CustomHooks";

/**
 * A badge icon for use with profiles
 */
const Badge = ({
  imageURL, name
}: {
  imageURL: string;
  name: string;
}) => {
  const [ imageRef, imageRefError ] = useFirebaseStorageUrl(imageURL);

  return (
    <View style={styles.container}>
      {!imageRef && !imageRefError && <ActivityIndicator size="large" color="blue" />}
      {imageRefError && (
        <MaterialIcons name="image-not-supported" size={styles.icon.width} color="black" />
      )}
      {imageRef && (
        <>
          <Image style={styles.icon} source={{ uri: imageRef }} />
          <Text>{name}</Text>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  icon: {
    height: 50,
    width: 50,
  },
});

export default Badge;
