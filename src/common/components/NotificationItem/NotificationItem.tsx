import * as WebBrowser from "expo-web-browser";
import { useTheme } from "native-base";
import { Icon, ListItem } from "react-native-elements";

import { useThemeColors, useThemeFonts } from "../../customHooks";

const NotificationItem = ({
  unread, title, subtitle, icon, type, link
}: { unread:boolean; title:string; subtitle:string; icon:string; type:string; link:string }) => {
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

  function bgColor() {
    if (unread) {
      return primary[100];
    }
    return "white";
  }

  return (
    <ListItem
      containerStyle={{ backgroundColor: bgColor(), marginLeft: 25, marginRight: 25, marginBottom: 5, borderRadius: 5, padding: 5 }}
      onPress={link ? () => WebBrowser.openBrowserAsync(link) : undefined}
      bottomDivider>
      <Icon
        name={icon}
        type={type}
        color={secondary[400]}
        backgroundColor="white"
        borderRadius={50}
        size={35}
        style={{ padding: 5, marginLeft: 5 }}/>
      <ListItem.Content>
        <ListItem.Title style={{ color: primary[600], fontWeight: "bold", fontFamily: body, fontSize: 14 }}>{title}</ListItem.Title>
        <ListItem.Subtitle style={{ color: primary[600], fontFamily: mono, fontSize: 14 }}>{subtitle}</ListItem.Subtitle>
      </ListItem.Content>
    </ListItem>
  );
};

export default NotificationItem;
