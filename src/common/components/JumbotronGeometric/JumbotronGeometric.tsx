import { Text, View, useTheme } from "native-base";
import { Tile } from "react-native-elements";

import { useThemeColors, useThemeFonts } from "../../customHooks";

const JumbotronGeometric = ({
  icon, iconType, title, text, bgColor
}: { icon:string; iconType:string; title:string; text:string; bgColor:string }) => {
  const themes = useTheme();
  const {
    primary, // Standard is 600, light background is 100
    secondary, // Standard is 400
    tertiary, // Standard is 500
    success, warning, error, danger, blue
  } = useThemeColors();
  const {
    heading, body, mono
  } = useThemeFonts();
  
  function validateBGColor() {
    switch (bgColor) {
    case "white": return "https://i.gyazo.com/2782482b06aef9279fd902c46e4c6614.png";
    case "blue": return "https://i.gyazo.com/ad6e2f81beae7862b3268894b6fa31c8.png";
    case "lightblue": return "https://i.gyazo.com/c2452245848a13292a98e6f67e3fe4e8.png";
    default: return "https://i.gyazo.com/ad6e2f81beae7862b3268894b6fa31c8.png";
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
    <Tile
      imageSrc={{ uri: validateBGColor() }}
      icon={{
        name: icon,
        type: iconType,
        size: 34,
        color: iconColor(),
        containerStyle: { paddingBottom: 7 }
      }}
      title={title}
      titleStyle={{ fontFamily: "bodoni-flf-bold", color: fontColor("title"), fontSize: 30, marginBottom: 3 }}
      titleNumberOfLines={1}
      caption={text}
      captionStyle={{ fontFamily: "opensans-condensed-light", color: fontColor("caption"), fontSize: 18 }}
      height={200}
      overlayContainerStyle={{ padding: 0 }}
      featured/>
  );
};

export default JumbotronGeometric;
