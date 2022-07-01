import { Text } from "native-base";
import { View } from "react-native";

const validUnits = [
  "seconds", "minutes", "hours", "days", "months", "years"
] as const;

/**
 * A label for a unit of time
 * @param props.value The value of time
 * @param props.unit The unit of time (plural)
 */
const TimeUnit = ({
  value,
  unit,
}: {
  value: number | undefined;
  unit: typeof validUnits[number];
}) => {
  if (!validUnits.includes(unit)) {
    throw new Error(`Invalid unit: ${unit}`);
  }

  return (
    <View style={{ alignItems: "center", paddingLeft: 7, paddingRight: 7 }}>
      <Text style={{
        color: "white",
        fontSize: 40,
        fontWeight: "bold",
      }}>{Math.max(0, value ?? 0)}</Text>
      <Text style={{ fontSize: 20, color: "white" }}>
        {(value ?? 0) === 1 ? unit.substring(0, unit.length - 1) : unit}
      </Text>
    </View>
  );
};

export default TimeUnit;
