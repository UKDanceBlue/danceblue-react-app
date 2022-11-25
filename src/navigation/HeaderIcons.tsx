import { FontAwesome5 } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { View } from "native-base";
import { PixelRatio, TouchableOpacity } from "react-native";

import { RootStackParamList } from "../types/navigationTypes";

const HeaderIcons = ({
  navigation, color
}: {
  navigation: NativeStackNavigationProp<RootStackParamList>;
  color?: string;
}) => (
  <View
    style={{ flexDirection: "row" }}
  >
    <TouchableOpacity onPress={() => navigation.navigate("Notifications")}>
      <FontAwesome5
        name="bell"
        color={color}
        style={{ textAlignVertical: "center", padding: "5%", fontSize: PixelRatio.get() * 8 }}
      />
    </TouchableOpacity>
    <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
      <FontAwesome5
        name="user"
        color={color}
        style={{ textAlignVertical: "center", padding: "5%", fontSize: PixelRatio.get() * 8 }}
      />
    </TouchableOpacity>
  </View>
);

export default HeaderIcons;
