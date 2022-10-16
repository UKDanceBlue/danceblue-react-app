import { manufacturer as deviceManufacturer } from "expo-device";
import { openSettings } from "expo-linking";
import { setBadgeCountAsync } from "expo-notifications";
import { Box, Button, FlatList, Heading, Text, View } from "native-base";
import { useEffect } from "react";
import { RefreshControl } from "react-native";

import { log, universalCatch } from "../../../common/logging";
import { useDeviceData, useLoading, useUserData } from "../../../context";
import { useRefreshUserData } from "../../../context/user";

/**
 * Component for "Profile" screen in main navigation
 */
const NotificationScreen = () => {
  const { getsNotifications: notificationPermissionsGranted } = useDeviceData();
  const { pastNotifications: notifications } = useUserData();
  const refreshUserData = useRefreshUserData();

  const [
    ,, { UserDataProvider: isUserDataLoading }
  ] = useLoading();

  // Clear badge count when navigating to this screen
  useEffect(() => {
    (async () => {
      const success = await setBadgeCountAsync(0);

      if (!success) {
        log("Failed to clear badge count", "warn");
      }
    })().catch(universalCatch);
  }, []);

  if (!notificationPermissionsGranted) {
    return (
      <View>
        <Text textAlign="center">
        You have not enabled notifications for this device, enable them in the settings app
        </Text>
        {deviceManufacturer === "Apple" && (
          <Button onPress={() => openSettings().catch(universalCatch)} >
            Open Settings
          </Button>
        )}
      </View>
    );
  } else if (notifications.length === 0) {
    return (<View>
      <View>
        <Text textAlign="center" fontSize="lg">No notifications</Text>
      </View>
    </View>);
  } else {
    return (
      <FlatList
        refreshControl={<RefreshControl refreshing={isUserDataLoading ?? false} />}
        onRefresh={() => refreshUserData().catch(universalCatch)}
        data={notifications}
        renderItem={({ item: notification }) => (
          <Box>
            <View>
              <Heading>
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
            <Text>
              <Text>{notification.body}</Text>
            </Text>
          </Box>
        )}
      />
    );
  }
};

export default NotificationScreen;
