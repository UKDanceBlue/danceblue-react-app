// Import third-party dependencies
import { FontAwesome5 } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { DateTime, Interval } from "luxon";
import { Center, useTheme } from "native-base";
import { ReactElement, useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import WebView from "react-native-webview";

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

const ScavengerHuntComponent = () => <WebView renderLoading={() => <Center width="full" height="full"><ActivityIndicator size="large" /></Center>} startInLoadingState source={{ uri: "https://forms.gle/PV91KZunWW7c7aMAA" }} />;

export const possibleTabs = {
  Events: <Tabs.Screen
    key="Events"
    name="Events"
    component={EventListScreen}
    options = {{ headerShown: true }}/>,
  Scoreboard: <Tabs.Screen key="Scoreboard" name="Scoreboard" component={ScoreboardScreen} />,
  Team: <Tabs.Screen key="Team" name="Team" component={TeamScreen} />,
  MarathonHours: <Tabs.Screen key="HoursScreen" name="Marathon" component={HoursScreen} />,
  ScavengerHunt: <Tabs.Screen key="ScavengerHunt" name="Scavenger Hunt" component={ScavengerHuntComponent} />,
} as { [name: string]: ReactElement };

const TabBar = () => {
  const {
    isConfigLoaded, enabledScreens: configuredTabs
  } = useAppConfig();

  const { colors } = useTheme();
  const headerBgColor = useColorModeValue(colors.white, colors.gray[800]);
  const headerFgColor = useColorModeValue(colors.gray[800], colors.light[400]);

  const [ currentTabs, setCurrentTabs ] = useState<ReactElement[]>([]);

  useEffect(() => {
    if (isConfigLoaded) {
      const tempCurrentTabs = [];
      for (const configuredTab of configuredTabs) {
        if (configuredTab === "ScavengerHunt") {
          continue;
        }
        tempCurrentTabs.push(possibleTabs[configuredTab]);
      }

      // BEGIN SCAVENGER HUNT CODE
      const firstScavengerHuntInterval = Interval.fromDateTimes(DateTime.fromISO("2022-08-20T19:00:00.000"), DateTime.fromISO("2022-08-20T22:00:00.000"));
      const secondScavengerHuntInterval = Interval.fromDateTimes(DateTime.fromISO("2022-09-05T14:00:00.000"), DateTime.fromISO("2022-09-05T16:00:00.000"));
      const now = DateTime.local();

      if (firstScavengerHuntInterval.contains(now) || secondScavengerHuntInterval.contains(now) || configuredTabs.includes("ScavengerHunt")) {
        tempCurrentTabs.push(possibleTabs.ScavengerHunt);
      }
      // END SCAVENGER HUNT CODE

      setCurrentTabs(tempCurrentTabs);
      log(`Config loaded, setting current tabs to ${JSON.stringify({ currentTabs: tempCurrentTabs })}`);
    }
  }, [ configuredTabs, isConfigLoaded ]);

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
