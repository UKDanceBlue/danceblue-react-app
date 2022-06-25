import * as Device from "expo-device";
import * as Linking from "expo-linking";
import * as Notifications from "expo-notifications";
import { useEffect, useMemo } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { Button, ListItem, Text } from "react-native-elements";

import { useAppSelector } from "../../common/CustomHooks";
import { registerPushNotifications } from "../../redux/notificationSlice";
import store from "../../redux/store";
import { globalStyles, globalTextStyles } from "../../theme";

/**
 * Component for "Profile" screen in main navigation
 */
const NotificationScreen = () => {
  const notificationPermissionsGranted = useAppSelector(
    (state) => state.notification.notificationPermissionsGranted
  );
  const notifications = useAppSelector((state) => state.userData.pastNotifications);
  const userDataLoading = useAppSelector((state) => state.globalLoading.loadingTokens["userData/loadUserData"] ?? false);

  useEffect(() => {
    let shouldUpdateState = true;
    void Notifications.getPermissionsAsync().then((settings) => {
      if (
        (settings.granted ||
          settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL ||
          settings.ios?.status === Notifications.IosAuthorizationStatus.AUTHORIZED) !==
        notificationPermissionsGranted
      ) {
        if (shouldUpdateState) {
          void store.dispatch(registerPushNotifications());
        }
      }
    });
    return () => {
      shouldUpdateState = false;
    };
  }, [notificationPermissionsGranted]);

  // Only run the function in this hook if notifications changes
  const notificationsListView = useMemo(() => {
    const tempNotificationsListView = [];
    for (let i = 0; i < notifications.length; i++) {
      tempNotificationsListView.push(
        <ListItem key={i} style={{ flexDirection: "column" }} hasTVPreferredFocus={undefined} tvParallaxProperties={undefined}>
          <View>
            <ListItem.Title style={globalTextStyles.boldText}>
              {notifications[i].title}
            </ListItem.Title>
            <ListItem.Subtitle>
              <Text>
                {Date.now() - notifications[i].sendTime.toMillis() < 43200000
                  ? notifications[i].sendTime
                    .toDate()
                    .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                  : notifications[i].sendTime.toDate().toLocaleDateString()}
              </Text>
            </ListItem.Subtitle>
          </View>
          <ListItem.Content style={globalStyles.genericText}>
            <Text>{notifications[i].body}</Text>
          </ListItem.Content>
        </ListItem>
      );
    }

    // If there were no notifications to display, show a message saying as much
    if (tempNotificationsListView.length === 0) {
      tempNotificationsListView.push(
        <View style={globalStyles.genericRow} key={0}>
          <View style={globalStyles.genericView}>
            <Text style={globalTextStyles.headerText}>No notifications</Text>
          </View>
        </View>
      );
    }

    return tempNotificationsListView;
  }, [notifications]);

  return (
    <>
      {notificationPermissionsGranted && (
        <ScrollView
          style={globalStyles.genericView}
          refreshControl={<RefreshControl refreshing={userDataLoading} />}
        >
          {notificationsListView}
        </ScrollView>
      )}
      {!notificationPermissionsGranted && (
        <View>
          <Text>
            You have not enabled notifications for this device, enable them in the settings app
          </Text>
          {Device.manufacturer === "Apple" && (
            <Button onPress={() => void Linking.openSettings()} title="Open Settings" />
          )}
        </View>
      )}
    </>
  );
};

export default NotificationScreen;
