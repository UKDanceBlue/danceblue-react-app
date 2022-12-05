import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { FirestoreNotification } from "@ukdanceblue/db-app-common";
import { manufacturer as deviceManufacturer } from "expo-device";
import { openSettings } from "expo-linking";
import { setBadgeCountAsync } from "expo-notifications";
import { DateTime } from "luxon";
import { Button, SectionList, Text, View } from "native-base";
import { useEffect, useState } from "react";
import { RefreshControl } from "react-native";
import Animated, { useSharedValue } from "react-native-reanimated";

import { log, universalCatch } from "../../../common/logging";
import { useDeviceData, useLoading, useUserData } from "../../../context";
import { useRefreshUserData } from "../../../context/user";

import { NotificationRow } from "./NotificationRow";
import { NotificationSectionHeader } from "./NotificationSectionHeader";
import { refreshNotificationScreen } from "./refresh";

export interface NotificationListDataEntry {
  notification: (FirestoreNotification | undefined);
  reference: FirebaseFirestoreTypes.DocumentReference<FirestoreNotification> | undefined;
  indexWithOpenMenu: Animated.SharedValue<undefined | number>;
}

/**
 * Component for "Profile" screen in main navigation
 */
function NotificationScreen() {
  const { getsNotifications: notificationPermissionsGranted } = useDeviceData();

  const indexWithOpenMenu = useSharedValue<undefined | number>(undefined);

  const { notificationReferences } = useUserData();
  const refreshUserData = useRefreshUserData();

  const [
    , , { UserDataProvider: isUserDataLoading }
  ] = useLoading();

  const [ isLoading, setIsLoading ] = useState(false);
  const isAnyLoading = isLoading || isUserDataLoading;

  const [ notifications, setNotifications ] = useState<(NotificationListDataEntry | undefined)[]>([]);

  // Clear badge count when navigating to this screen
  useEffect(() => {
    (async () => {
      const success = await setBadgeCountAsync(0);

      if (!success) {
        log("Failed to clear badge count", "warn");
      }
    })().catch(universalCatch);
  }, []);

  useEffect(() => {
    refreshNotificationScreen(notificationReferences, setNotifications, indexWithOpenMenu).catch(universalCatch);
  }, [ indexWithOpenMenu, notificationReferences ]);

  if (!notificationPermissionsGranted) {
    return (
      <View>
        <Text textAlign="center">
          You have not enabled notifications for this device, enable them in the settings app
        </Text>
        {deviceManufacturer === "Apple" && (
          <Button onPress={() => openSettings().catch(universalCatch)}>
            Open Settings
          </Button>
        )}
      </View>
    );
  } else {
    return (
      <SectionList
        refreshControl={<RefreshControl
          refreshing={isAnyLoading ?? false}
          onRefresh={() => {
            setIsLoading(true);
            setNotifications(notificationReferences.map(() => undefined));
            refreshUserData()
              .then(() => refreshNotificationScreen(notificationReferences, setNotifications, indexWithOpenMenu))
              .then(() => setIsLoading(false))
              .catch(universalCatch);
          }}/>}
        data={notifications}
        sections={
          Object.entries(notifications.reduce<Record<string, NotificationListDataEntry[] | undefined>>((acc, data) => {
            if (data?.notification == null) {
              acc[""] = [
                ...(acc[""] ?? []), {
                  notification: undefined,
                  reference: undefined,
                  indexWithOpenMenu
                }
              ];

              return acc;
            } else {
              const date = DateTime.fromISO(data.notification.sendTime).toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY);

              acc[date] = [ ...(acc[date] ?? []), data ];

              return acc;
            }
          }, {})).map(([ date, notifications ]) => ({ title: date, data: notifications ?? [] }))
        }
        keyExtractor={(data, i) => data?.notification == null ? String(i) : `${data.notification.title} : ${data.notification.sendTime}`}
        ListEmptyComponent={() => (
          <View>
            <Text textAlign="center">No Notifications</Text>
          </View>
        )}
        renderSectionHeader={NotificationSectionHeader}
        renderItem={NotificationRow}
      />
    );
  }
}

export default NotificationScreen;
