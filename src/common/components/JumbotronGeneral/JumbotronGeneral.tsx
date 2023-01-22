import { Text, View, useTheme } from "native-base";
import { Icon } from "react-native-elements";

import { useThemeColors, useThemeFonts } from "../../customHooks";

const JumbotronGeneral = ({
  icon, iconColor, type, title, text, subtitle
}: { icon:string; iconColor:string; type:string; title:string; text:string; subtitle:string }) => {
  const themes = useTheme();
  const {
    primary, // Standard is 600, light background is 100
    secondary, // Standard is 400
    tertiary, // Standard is 500
    success, warning, error, danger, blue
  } = useThemeColors();
  const {
    headingBold, heading, body, mono
  } = useThemeFonts();

  return (
    <View margin={3} backgroundColor={primary[100]} padding={4}>
      <Icon
        name={icon}
        type={type}
        color={iconColor}
        size={36}/>
      <Text
        textAlign="center"
        fontSize="2xl"
        color={primary[600]}
        fontFamily={headingBold}
        bold>{title}</Text>
      <Text
        textAlign="center"
        fontSize="lg"
        color={primary[600]}
        bold>{text}</Text>
      <Text
        textAlign="center"
        fontSize="md"
        color={primary[600]}
        fontFamily={mono}>{subtitle}</Text>
    </View>
  );
};

export default JumbotronGeneral;
