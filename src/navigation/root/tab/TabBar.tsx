// Import third-party dependencies
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ReactElement, useEffect, useState } from "react";

// Import first-party dependencies
import { log } from "../../../common/logging";
import { useAppConfig } from "../../../context";
import { RootStackParamList, TabNavigatorParamList } from "../../../types/navigationTypes";
import HeaderIcons from "../../HeaderIcons";

import { DBHeaderText } from "./DBHeaderText";
import EventListScreen from "./EventListScreen";
import HomeScreen from "./HomeScreen";
import HoursScreen from "./HoursScreen";
import TabBarComponent from "./TabBarComponent";
import SpiritScreen from "./spirit/SpiritStack";

const Tabs = createBottomTabNavigator<TabNavigatorParamList>();

export const possibleTabs = {
  Events: <Tabs.Screen
    key="Events"
    name="Events"
    component={EventListScreen}/>,
  Spirit: <Tabs.Screen key="Spirit" name="Teams" component={SpiritScreen} />,
  MarathonHours: <Tabs.Screen key="HoursScreen" name="Marathon" component={HoursScreen} />,
} as { [name: string]: ReactElement };

const TabBar = () => {
  const {
    isConfigLoaded, enabledScreens
  } = useAppConfig();

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
      screenOptions={({ navigation }: {
            navigation: NativeStackNavigationProp<RootStackParamList>;
            route: RouteProp<TabNavigatorParamList>;
        }) => ({

        // tabBarBackground: () => (
        //   <Image
        //     source={require("../../../../assets/screens/navigation/standardBG.png") as ImageSourcePropType}
        //     alt="Navigation Background Image"
        //     width={width}
        //     height={130}/>
        // ),
        headerLeft: DBHeaderText,
        headerTitle: () => null,
        headerRight: () => (
          <HeaderIcons navigation={navigation} />
        ),
        tabBarStyle: [
          { display: "flex", backgroundColor: "transparent", height: 110, paddingTop: 40, paddingBottom: 20, borderTopColor: "transparent" },
          null,
        ],
        headerStyle: [
          {
            borderBottomWidth: 1.5,
            borderBottomColor: "#0032A0",
            borderStyle: "solid",
            shadowOffset: {
              width: 0,
              height: -5,
            },
            shadowRadius: 5,
            shadowOpacity: 0.5,
            shadowColor: "#0032A0"
          }, null
        ],
      })}
      tabBar={(props) => (<TabBarComponent {...props} />)}
    >
      <Tabs.Screen name="Home" component={HomeScreen} />
      {isConfigLoaded && currentTabs}
    </Tabs.Navigator>
  );
};

export default TabBar;

