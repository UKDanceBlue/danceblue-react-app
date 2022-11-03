import { StackNavigationProp, createStackNavigator } from "@react-navigation/stack";
import { useTheme } from "native-base";

import { useColorModeValue } from "../../common/customHooks";
import { useAuthData } from "../../context";
import { RootStackParamList } from "../../types/navigationTypes";
import HeaderIcons from "../HeaderIcons";

import EventScreen from "./EventScreen";
import SplashLogin from "./Modals/SplashLogin";
import NotificationScreen from "./NotificationScreen";
import ProfileScreen from "./ProfileScreen";
// import HourScreen from "./tab/HoursScreen/HourScreen";
import TabBar from "./tab/TabBar";

const RootStack = createStackNavigator<RootStackParamList>();

const RootScreen = () => {
  const {
    isAuthLoaded, isLoggedIn
  } = useAuthData();


  const { colors } = useTheme();
  const headerBgColor = useColorModeValue(colors.white, colors.gray[800]);
  const headerFgColor = useColorModeValue(colors.gray[800], colors.light[600]);

  return (
    <>
      {isAuthLoaded && (
        <RootStack.Navigator
          screenOptions={({ navigation }: { navigation: StackNavigationProp<RootStackParamList> }) => ({
            headerStyle: { backgroundColor: headerBgColor },
            headerTitleStyle: { color: headerFgColor },
            headerRight: () => <HeaderIcons navigation={navigation} color={headerFgColor} />,
            headerBackTitle: "Back",
          })}>
          {isLoggedIn ? (
            <>
              <RootStack.Screen name="Tab" options={{ headerShown: false }} component={TabBar} />
              <RootStack.Screen
                name="Notifications"
                component={NotificationScreen}
                options={{ headerRight: undefined }}
              />
              <RootStack.Screen name="Profile" component={ProfileScreen} options={{ headerRight: undefined }} />
              <RootStack.Screen
                name="Event"
                component={EventScreen}
                options={({ route }) => ({
                  title: route.params.event.name,
                  headerMode: "screen",
                })}
              />
              {/* <RootStack.Screen name="Hour Details" component={HourScreen} /> */}
            </>
          ) : (
            <RootStack.Screen
              name="SplashLogin"
              component={SplashLogin}
              options={{ headerShown: false, presentation: "modal", gestureEnabled: false }}
            />
          )}
        </RootStack.Navigator>
      )}
    </>
  );
};

export default RootScreen;
