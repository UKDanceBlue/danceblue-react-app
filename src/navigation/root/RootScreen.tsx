import { StackNavigationProp, createStackNavigator } from "@react-navigation/stack";
import { BlurView } from "expo-blur";
import { useTheme } from "native-base";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet } from "react-native";

import { useAppDispatch, useAppSelector, useColorModeValue } from "../../common/CustomHooks";
import { updateConfig } from "../../redux/appConfigSlice";
import { RootStackParamList } from "../../types/NavigationTypes";
import HeaderIcons from "../HeaderIcons";

import EventScreen from "./EventScreen";
import SplashLogin from "./Modals/SplashLogin";
import NotificationScreen from "./NotificationScreen";
import ProfileScreen from "./ProfileScreen";
import HourScreen from "./tab/HoursScreen/HourScreen";
import TabBar from "./tab/TabBar";

const RootStack = createStackNavigator<RootStackParamList>();

const RootScreen = () => {
  const isAuthLoaded = useAppSelector((state) => state.auth.isAuthLoaded);
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);

  const { colors } = useTheme();
  const headerBgColor = useColorModeValue(colors.white, colors.gray[800]);
  const headerFgColor = useColorModeValue(colors.gray[800], colors.light[600]);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isAuthLoaded) {
      void dispatch(updateConfig());
    }
  }, [ dispatch, isAuthLoaded ]);

  return (
    <>
      {!isAuthLoaded && (
        <ActivityIndicator
          size="large"

          style={{
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
        />
      )}
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
                  title: route.params.event.title,
                  headerTransparent: true,
                  headerMode: "screen",
                  headerBackground: () => (
                    <BlurView tint="light" intensity={100} style={StyleSheet.absoluteFill} />
                  ),
                })}
              />
              <RootStack.Screen name="Hour Details" component={HourScreen} />
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
