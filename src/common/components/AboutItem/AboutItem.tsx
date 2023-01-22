import * as WebBrowser from "expo-web-browser";
import { Icon, useTheme } from "native-base";
import { ListItem } from "react-native-elements";

import { useThemeColors, useThemeFonts } from "../../customHooks";

const AboutItem = ({
  icon, iconType, iconColor, link, title
}: { icon:string; iconType:unknown; iconColor:string; link:string; title:string }) => {
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

  return (
    <ListItem
      style={{ borderColor: primary[600] }}
      containerStyle={{ backgroundColor: primary[100], borderColor: primary[600] }}
      onPress={link ? () => WebBrowser.openBrowserAsync(link) : undefined}
      bottomDivider>
      <Icon name={icon} as={iconType} color={iconColor}/>
      <ListItem.Content>
        <ListItem.Title style={{ color: primary[600], fontWeight: "bold", fontFamily: body }}>{title}</ListItem.Title>
      </ListItem.Content>
      <ListItem.Chevron color={primary[600]}/>
    </ListItem>
  );
};

export default AboutItem;
