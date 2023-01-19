import { Text, useTheme } from "native-base";

import { useThemeColors, useThemeFonts } from "../../customHooks";

const Scoreboard = ({ param }: { param:string }) => {
  const themes = useTheme();
  const {
    primary, secondary, tertiary, success, warning, error, danger
  } = useThemeColors();
  const {
    heading, body, mono
  } = useThemeFonts();

  return (
    <Text variant="fun" bg={primary[700]} color="#fff">hi {param}</Text>
  );
};
export default Scoreboard;
