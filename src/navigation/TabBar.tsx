// Import third-party dependencies
import { FontAwesome5 } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useEffect, useState } from "react";

// Import first-party dependencies
import { useAppSelector } from "../common/CustomHooks";
import EventScreen from "../screens/EventScreen";
import GenericWebviewScreen from "../screens/GenericWebviewScreen";
import HomeScreen from "../screens/HomeScreen";
import HoursScreen from "../screens/HoursScreen";
import ScoreboardScreen from "../screens/ScoreBoardScreen";
import TeamScreen from "../screens/TeamScreen";
import { TabNavigatorParamList } from "../types/NavigationTypes";

import HeaderIcons from "./HeaderIcons";

const Tabs = createBottomTabNavigator<TabNavigatorParamList>();

const possibleTabs = {
  Events: <Tabs.Screen key="Events" name="Events" component={EventScreen} />,
  Scoreboard: <Tabs.Screen key="Scoreboard" name="Scoreboard" component={ScoreboardScreen} />,
  Team: <Tabs.Screen key="Team" name="Team" component={TeamScreen} />,
  MarathonHours: <Tabs.Screen key="HoursScreen" name="Marathon" component={HoursScreen} />,
} as { [key: string]: JSX.Element };

const TabBar = () => {
  const isConfigLoaded = useAppSelector((state) => state.appConfig.isConfigLoaded);
  const configuredTabs = useAppSelector((state) => state.appConfig.enabledScreens);
  const demoMode = false; // UseAppSelector((state) => state.appConfig.demoMode); TODO reimplement

  const [
    currentTabs, setCurrentTabs
  ] = useState<JSX.Element[]>([]);

  useEffect(() => {
    if (isConfigLoaded) {
      const tempCurrentTabs = [];
      for (let i = 0; i < configuredTabs.length; i++) {
        if (possibleTabs[configuredTabs[i]]) {
          tempCurrentTabs.push(possibleTabs[configuredTabs[i]]);
        }
      }
      setCurrentTabs(tempCurrentTabs);
    }
  }, [
    configuredTabs, isConfigLoaded
  ]);

  return (
    <>
      {isConfigLoaded && (
        <Tabs.Navigator
          screenOptions={({
            route, navigation
          }) => ({
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
              } as { [key: string]: string };

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
            headerRight: ({ tintColor }) => (
              <HeaderIcons navigation={navigation} color={tintColor} />
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
          <Tabs.Screen key="HoursScreen" name="Marathon" component={HoursScreen} />
          {!demoMode && currentTabs}
          {demoMode && Object.values(possibleTabs)}
        </Tabs.Navigator>
      )}
    </>
  );
};

export default TabBar;
