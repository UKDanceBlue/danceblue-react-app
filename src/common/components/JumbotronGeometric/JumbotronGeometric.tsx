import { Icon as IconType } from "@expo/vector-icons/build/createIconSet";
import { Column, Icon, Text, View, useTheme } from "native-base";
import { ImageBackground, ImageSourcePropType } from "react-native";

import { useThemeColors, useThemeFonts } from "../../customHooks";

// TODO - Merge with JumbotronGeneral
const JumbotronGeometric = <PossibleIconNames extends string, IconFontName extends string, IconName extends PossibleIconNames>({
  icon, iconType, title, text, bgColor="blue"
}: { icon:IconName; iconType: IconType<PossibleIconNames, IconFontName>; title:string; text:string; bgColor:string }) => {
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

  function validateBGColor() {
    switch (bgColor) {
    case "white": return require("../../../../assets/bg-geometric/white.png") as ImageSourcePropType;
    case "blue": return require("../../../../assets/bg-geometric/blue.png") as ImageSourcePropType;
    case "lightblue": return require("../../../../assets/bg-geometric/lightblue.png") as ImageSourcePropType;
    default: return require("../../../../assets/bg-geometric/blue.png") as ImageSourcePropType;
    }
  }

  function iconColor() {
    switch (bgColor) {
    case "white": return primary[600];
    case "blue": return secondary[200];
    case "lightblue": return primary[600];
    default: return secondary[200];
    }
  }

  function fontColor(loc:string) {
    switch (loc){
    case "title":
      switch (bgColor) {
      case "white": return primary[600];
      case "blue": return secondary[200];
      case "lightblue": return primary[600];
      default: return secondary[200];
      }
    default:
      switch (bgColor) {
      case "white": return primary[600];
      case "blue": return "white";
      case "lightblue": return primary[600];
      default: return "white";
      }
    }
  }

  return (
    <ImageBackground source={validateBGColor()} resizeMode="cover">
      <Column
        display="flex"
        height={200}
        justifyContent="center"
        alignItems="center">
        {icon && (<Icon as={iconType} name={icon} color={iconColor()}/>)}
        <Text style={{ fontFamily: headingBold, color: fontColor("title"), fontSize: 30, marginBottom: 3 }}>{title}</Text>
        <Text style={{ fontFamily: mono, color: fontColor("caption"), fontSize: 18 }}>{text}</Text>
      </Column>
    </ImageBackground>
  );
};

export default JumbotronGeometric;
