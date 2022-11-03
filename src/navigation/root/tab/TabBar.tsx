// Import third-party dependencies
import { FontAwesome5 } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useTheme } from "native-base";
import { ReactElement, useEffect, useState } from "react";

// Import first-party dependencies
import { useColorModeValue } from "../../../common/customHooks";
import { log } from "../../../common/logging";
import { useAppConfig } from "../../../context";
import { RootStackParamList, TabNavigatorParamList } from "../../../types/navigationTypes";
import HeaderIcons from "../../HeaderIcons";

import EventListScreen from "./EventListScreen";
import HomeScreen from "./HomeScreen";
import HoursScreen from "./HoursScreen";
import ScoreboardScreen from "./ScoreBoardScreen";
import TeamScreen from "./TeamScreen";

const Tabs = createBottomTabNavigator<TabNavigatorParamList>();

export const possibleTabs = {
  Events: <Tabs.Screen
    key="Events"
    name="Events"
    component={EventListScreen}/>,
  Scoreboard: <Tabs.Screen key="Scoreboard" name="Scoreboard" component={ScoreboardScreen} />,
  Team: <Tabs.Screen key="Team" name="Team" component={TeamScreen} />,
  MarathonHours: <Tabs.Screen key="HoursScreen" name="Marathon" component={HoursScreen} />,
} as { [name: string]: ReactElement };

const TabBar = () => {
  const {
    isConfigLoaded, enabledScreens
  } = useAppConfig();

  const { colors } = useTheme();
  const headerBgColor = useColorModeValue(colors.white, colors.gray[800]);
  const headerFgColor = useColorModeValue(colors.gray[800], colors.light[400]);

  const [ currentTabs, setCurrentTabs ] = useState<ReactElement[]>([]);

  useEffect(() => {
    if (isConfigLoaded) {
      const tempCurrentTabs = [];
      for (const tabName of enabledScreens) {
        tempCurrentTabs.push(possibleTabs[tabName]);
      }

      setCurrentTabs(tempCurrentTabs);
      log(`Config loaded, setting current tabs to ${JSON.stringify({ currentTabs: tempCurrentTabs })}`);
    }
  }, [ enabledScreens, isConfigLoaded ]);

  return (
    <Tabs.Navigator
      screenOptions={({
        route, navigation
      }: {
            navigation: StackNavigationProp<RootStackParamList>;
            route: RouteProp<TabNavigatorParamList>;
        }) => ({
        headerStyle: { backgroundColor: headerBgColor },
        headerTitleStyle: { color: headerFgColor },
        tabBarIcon: ({
          color, size
        }) => {
          const iconMap = {
            // https://icons.expo.fyi/
            // Key: Screen   Value: Icon ID
            Home: "home",
            Events: "calendar",
            Store: "store",
            More: "ellipsis-h",
            Scoreboard: "list-ol",
            Team: "users",
            Donate: "hand-holding-heart",
            Marathon: "people-arrows",
            "Scavenger Hunt": "search"
          };

          // You can return any component that you like here!
          return (
            <FontAwesome5
              name={iconMap[route.name]}
              size={size}
              color={color}
              style={{ textAlignVertical: "center" }}
            />
          );
        },
        headerRight: () => (
          <HeaderIcons navigation={navigation} color={headerFgColor} />
        ),
        tabBarActiveTintColor: "white",
        tabBarActiveBackgroundColor: "#3248a8",
        tabBarStyle: [
          { display: "flex" },
          null,
        ],
      })}
    >
      <Tabs.Screen name="Home" component={HomeScreen} />
      {isConfigLoaded && currentTabs}
    </Tabs.Navigator>
  );
};

export default TabBar;
