import { Text, View } from "native-base";

import { useThemeFonts } from "../../customHooks";

const validUnits = [
  "seconds", "minutes", "hours", "days", "months", "years"
] as const;

/**
 * A label for a unit of time
 * @param props The react props
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
  const {
    headingBold, body
  } = useThemeFonts();

  if (!validUnits.includes(unit)) {
    throw new Error(`Invalid unit: ${unit}`);
  }

  return (
    <View style={{ alignItems: "center", paddingLeft: 7, paddingRight: 7, minHeight: 70 }}>
      <Text
        color="secondary.400"
        fontSize="3xl"
        fontFamily={headingBold}>
        {Math.max(0, value ?? 0)}
      </Text>
      <Text color="secondary.400" fontSize="xl" fontFamily={body}>
        {(value ?? 0) === 1 ? unit.substring(0, unit.length - 1) : unit}
      </Text>
    </View>
  );
};

export default TimeUnit;
