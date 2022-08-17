import { manufacturer as deviceManufacturer } from "expo-device";
import { openSettings } from "expo-linking";
import { IosAuthorizationStatus, getPermissionsAsync } from "expo-notifications";
import { Box, Button, FlatList, Heading, Text, View } from "native-base";
import { useEffect } from "react";
import { ActivityIndicator, RefreshControl } from "react-native";

import { useAppDispatch, useAppSelector } from "../../../common/CustomHooks";
import { universalCatch } from "../../../common/logging";
import { registerPushNotifications } from "../../../redux/notificationSlice";

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
    getPermissionsAsync().then((settings) => {
      if (
        (settings.granted ||
          settings.ios?.status === IosAuthorizationStatus.PROVISIONAL ||
          settings.ios?.status === IosAuthorizationStatus.AUTHORIZED) !==
        notificationPermissionsGranted
      ) {
        dispatch(registerPushNotifications()).catch(universalCatch);
      }
    }).catch(universalCatch);
  }, [ dispatch, notificationPermissionsGranted ]);

  if (notificationPermissionsGranted === null) {
    return <ActivityIndicator />;
  } else if (!notificationPermissionsGranted) {
    return (
      <View>
        <Text textAlign="center">
        You have not enabled notifications for this device, enable them in the settings app
        </Text>
        {deviceManufacturer === "Apple" && (
          <Button onPress={() => openSettings().catch(universalCatch)} title="Open Settings" />
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
        refreshControl={<RefreshControl refreshing={userDataLoading} />}
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
