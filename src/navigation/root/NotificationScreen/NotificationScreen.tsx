import * as Device from "expo-device";
import * as Linking from "expo-linking";
import * as Notifications from "expo-notifications";
import { Box, Button, FlatList, Heading, Text } from "native-base";
import { useEffect } from "react";
import { RefreshControl, View } from "react-native";

import { useAppDispatch, useAppSelector } from "../../../common/CustomHooks";
import { registerPushNotifications } from "../../../redux/notificationSlice";
import { globalStyles, globalTextStyles } from "../../../theme";

/**
 * Component for "Profile" screen in main navigation
 */
const NotificationScreen = () => {
  const notificationPermissionsGranted = useAppSelector(
    (state) => state.notification.notificationPermissionsGranted
  );
  const notifications = useAppSelector((state) => state.userData.pastNotifications);
  const userDataLoading = useAppSelector((state) => state.globalLoading.loadingTokens["userData/loadUserData"]);

  const dispatch = useAppDispatch();

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
          void dispatch(registerPushNotifications());
        }
      }
    });
    return () => {
      shouldUpdateState = false;
    };
  }, [ dispatch, notificationPermissionsGranted ]);

  return (
    <>
      {notificationPermissionsGranted
        ? (notifications.length > 0 ? (
          <FlatList
            style={globalStyles.genericView}
            refreshControl={<RefreshControl refreshing={userDataLoading} />}
            data={notifications}
            renderItem={({ item: notification }) => (
              <Box>
                <View>
                  <Heading style={globalTextStyles.boldText}>
                    {notification.title}
                  </Heading>
                  <Heading>
                    <Text>
                      {Date.now() - notification.sendTime.toMillis() < 43200000
                        ? notification.sendTime
                          .toDate()
                          .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                        : notification.sendTime.toDate().toLocaleDateString()}
                    </Text>
                  </Heading>
                </View>
                <Text style={globalStyles.genericText}>
                  <Text>{notification.body}</Text>
                </Text>
              </Box>
            )}
          />
        ) : <View style={globalStyles.genericRow}>
          <View style={globalStyles.genericView}>
            <Text style={globalTextStyles.headerText}>No notifications</Text>
          </View>
        </View>) : (
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
