import { StackNavigationProp, createStackNavigator } from "@react-navigation/stack";
import { BlurView } from "expo-blur";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet } from "react-native";

import { useAppDispatch, useAppSelector } from "../common/CustomHooks";
import { updateConfig } from "../redux/appConfigSlice";
import { EventView } from "../screens/EventScreen";
import HourScreen from "../screens/HoursScreen/HourScreen";
import SplashLogin from "../screens/Modals/SplashLogin";
import NotificationScreen from "../screens/NotificationScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { globalColors } from "../theme";
import { RootStackParamList } from "../types/NavigationTypes";

import HeaderIcons from "./HeaderIcons";
import TabBar from "./TabBar";

const RootStack = createStackNavigator<RootStackParamList>();

const RootScreen = () => {
  const isAuthLoaded = useAppSelector((state) => state.auth.isAuthLoaded);
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);

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
          color={globalColors.lightBlue}
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
            headerRight: ({ tintColor }) => <HeaderIcons navigation={navigation} color={tintColor} />,
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
                component={EventView}
                options={({ route }) => ({
                  title: route.params.name,
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
