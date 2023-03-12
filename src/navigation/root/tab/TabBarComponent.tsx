import { FontAwesome5 } from "@expo/vector-icons";
import { BottomTabBarProps, BottomTabNavigationOptions } from "@react-navigation/bottom-tabs";
import { VStack } from "native-base";
import { ZStack } from "native-base/src/components/primitives";
import { Text, TouchableOpacity, View, useWindowDimensions } from "react-native";

import BackgroundCutout from "../../../../assets/screens/navigation/background-cutout";
import DanceBlueRibbon from "../../../../assets/svgs/DBRibbon";

// From https://reactnavigation.org/docs/bottom-tab-navigator#tabbar

const iconMap = {
  // https://icons.expo.fyi/
  // Key: Screen   Value: Icon ID
  Home: "home",
  Events: "calendar",
  Store: "store",
  More: "ellipsis-h",
  Scoreboard: "list-ol",
  Teams: "users",
  Donate: "hand-holding-heart",
  Marathon: "people-arrows",
  "Scavenger Hunt": "search",
  "Logo": null
};

const tabBarIcon = ({
  color, size, iconKey: routeName
}: { color: string; size: number; iconKey: keyof typeof iconMap }) => {
  if (routeName === "Logo") {
    return (
      <DanceBlueRibbon svgProps={{ width: size, height: size }} />
    );
  } else {
    return (
      <FontAwesome5
        name={iconMap[routeName]}
        size={size}
        color={color}
        style={{ textAlignVertical: "center" }}
      />
    );
  }
};

function TabBarIcon({
  isFocused, options, onPress, onLongPress, sizeFactor, isMiddle, iconSize, label, iconKey
}: {
  isFocused: boolean;
  options: BottomTabNavigationOptions;
  onPress: () => void;
  onLongPress: () => void;
  sizeFactor: number;
  isMiddle: boolean;
  iconSize: number;
  label?: string;
  iconKey: keyof typeof iconMap;
}) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityState={isFocused ? { selected: true } : {}}
      accessibilityLabel={options.tabBarAccessibilityLabel}
      testID={options.tabBarTestID}
      onPress={onPress}
      onLongPress={onLongPress}
      style={{
        flex: 1,
        width: sizeFactor,
        height: sizeFactor,
        borderRadius: sizeFactor,
        backgroundColor: isMiddle ? "#673ab7" : undefined,
      }}
    >
      <VStack
        alignItems="center"
        justifyContent="center"
        flex={1}>
        {tabBarIcon({ color: isFocused ? "#673ab7" : "#222", size: iconSize, iconKey })}
        {
          label &&
          <Text style={{ color: isFocused ? "#673ab7" : "#222" }}>
            {label}
          </Text>
        }
      </VStack>
    </TouchableOpacity>
  );
}

function TabBarComponent({
  state, descriptors, navigation, insets
}: BottomTabBarProps) {
  const {
    height: screenHeight, width: screenWidth
  } = useWindowDimensions();

  const tabBarHeight = screenHeight * .1;

  return (
    <ZStack height={tabBarHeight} width={screenWidth} style={{ marginTop: insets.top, marginBottom: insets.bottom, marginLeft: insets.left, marginRight: insets.right }}>
      <BackgroundCutout svgProps={{ width: screenWidth, height: tabBarHeight }} color="#ededed" />
      <View style={{ flexDirection: "row", width: screenWidth, height: tabBarHeight }}>
        {
          state.routes.map(
            (route, index) => {
              const { options } = descriptors[route.key];
              const label = typeof options.tabBarLabel === "string"
                ? options.tabBarLabel
                : options.title !== undefined
                  ? options.title
                  : route.name;

              const isFocused = state.index === index;

              const isMiddle = state.routes.length % 2 === 1 && index === Math.floor(state.routes.length / 2);

              const sizeOfIcon = tabBarHeight * .32;

              const onPress = () => {
                const event = navigation.emit({
                  type: "tabPress",
                  target: route.key,
                  canPreventDefault: true,
                });

                if (!isFocused && !event.defaultPrevented) {
                  // The `merge: true` option makes sure that the params inside the tab screen are preserved
                  navigation.navigate({ name: route.name, merge: true, params: {} });
                }
              };

              const onLongPress = () => {
                navigation.emit({
                  type: "tabLongPress",
                  target: route.key,
                });
              };

              return (

                isMiddle?(
                  <>
                    <View style = {{
                      position: "absolute",
                      width: screenWidth,
                      height: screenWidth*.1*1.4,
                      bottom: Math.trunc(tabBarHeight * .5),
                      left: 0,
                      right: 0,
                      justifyContent: "center",
                      alignItems: "center",
                    }}>
                      <TabBarIcon
                        isFocused={isFocused}
                        options={options}
                        onPress={onPress}
                        onLongPress={onLongPress}
                        sizeFactor={tabBarHeight * .8}
                        isMiddle={isMiddle}
                        iconSize={tabBarHeight * .8}
                        iconKey="Logo" />
                    </View>
                    <View
                      style={{ width: screenWidth * .2 }}
                      collapsable={false}
                    >
                    </View>
                  </>
                ) : (
                  <TabBarIcon
                    isFocused={isFocused}
                    options={options}
                    onPress={onPress}
                    onLongPress={onLongPress}
                    sizeFactor={tabBarHeight * .8}
                    isMiddle={isMiddle}
                    iconSize={sizeOfIcon}
                    label={label}
                    iconKey={route.name as keyof typeof iconMap} />
                )
              );
            }
          )
        }
      </View>
    </ZStack >
  );
}

export default TabBarComponent;
