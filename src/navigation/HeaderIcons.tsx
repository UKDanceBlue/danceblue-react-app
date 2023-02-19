import { FontAwesome5 } from "@expo/vector-icons";
import { useTheme as useNavigationTheme } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { View } from "native-base";
import { PixelRatio, TouchableOpacity, useWindowDimensions } from "react-native";

import { RootStackParamList } from "../types/navigationTypes";

const HeaderIcons = ({ navigation }: {
  navigation: NativeStackNavigationProp<RootStackParamList>;
}) => {
  const { width } = useWindowDimensions();
  const reactNavigationTheme = useNavigationTheme();

  return (
    <View
      style={{ flexDirection: "row", width: Math.round(width * 0.13), justifyContent: "space-between", marginRight: Math.round(width * 0.025) }}>
      <TouchableOpacity onPress={() => navigation.navigate("Notifications")}>
        <FontAwesome5
          name="bell"
          color={reactNavigationTheme.colors.text}
          style={{ textAlignVertical: "center", fontSize: PixelRatio.get() * 8 }}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
        <FontAwesome5
          name="user"
          color={reactNavigationTheme.colors.text}
          style={{ textAlignVertical: "center", fontSize: PixelRatio.get() * 8 }}
        />
      </TouchableOpacity>
    </View>
  );
};

export default HeaderIcons;
