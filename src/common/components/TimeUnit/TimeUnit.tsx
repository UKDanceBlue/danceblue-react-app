import { View } from "react-native";
import { Text } from "react-native-elements";

/**
 * A label for a unit of time
 */

const TimeUnit = ({
  value,
  unit,
}: {
  value: number | undefined;
  unit: "seconds" | "minutes" | "hours" | "days" | "months" | "years";
}) => (
  <View style={{ alignItems: "center", paddingLeft: 7, paddingRight: 7 }}>
    <Text style={{
      color: "white",
      fontSize: 40,
      fontWeight: "bold",
    }}>{value}</Text>
    <Text style={{ fontSize: 20, color: "white" }}>
      {(value || 0) < 2 ? unit.substring(0, unit.length - 1) : unit}
    </Text>
  </View>
);

export default TimeUnit;
