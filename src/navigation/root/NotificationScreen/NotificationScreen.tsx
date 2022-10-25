import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { manufacturer as deviceManufacturer } from "expo-device";
import { openSettings } from "expo-linking";
import { setBadgeCountAsync } from "expo-notifications";
import { DateTime } from "luxon";
import { Box, Button, Heading, SectionList, Text, View } from "native-base";
import { useEffect, useState } from "react";
import { Alert, RefreshControl } from "react-native";

import { log, universalCatch } from "../../../common/logging";
import { useDeviceData, useLoading, useUserData } from "../../../context";
import { useRefreshUserData } from "../../../context/user";
import { FirestoreNotification, isFirestoreNotification } from "../../../types/FirestoreNotification";

/**
 * Component for "Profile" screen in main navigation
 */
const NotificationScreen = () => {
  const { getsNotifications: notificationPermissionsGranted } = useDeviceData();

  const { notificationReferences } = useUserData();
  const refreshUserData = useRefreshUserData();

  const [
    ,, { UserDataProvider: isUserDataLoading }
  ] = useLoading();

  const [ isLoading, setIsLoading ] = useState(false);
  const isAnyLoading = isLoading || isUserDataLoading;

  const [ notifications, setNotifications ] = useState<FirestoreNotification[]>([]);

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
    refresh(notificationReferences, setNotifications).catch(universalCatch);
  }, [notificationReferences]);

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
  } else {
    return (
      <SectionList
        refreshControl={<RefreshControl
          refreshing={isAnyLoading ?? false}
          onRefresh={() => {
            setIsLoading(true);
            refreshUserData()
              .then(() => refresh(notificationReferences, setNotifications))
              .then(() => setIsLoading(false))
              .catch(universalCatch);
          }} />}
        data={notifications}
        sections={
          Object.entries(notifications.reduce<Record<string, FirestoreNotification[] | undefined>>((acc, notification) => {
            const date = DateTime.fromISO(notification.sendTime).toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY);

            acc[date] = [ ...(acc[date] ?? []), notification ];

            return acc;
          }, {})).map(([ date, notifications ]) => ({ title: date, data: notifications ?? [] }))
        }
        keyExtractor={(notification) => `${notification.title } : ${ notification.sendTime}`}
        ListEmptyComponent={() => (
          <View>
            <Text textAlign="center">No Notifications</Text>
          </View>
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Heading
            size="md"
            p={2}
          >
            {title}
          </Heading>
        )}
        renderItem={({ item: notification }) => (
          <Box
            mx="4"
            my="2"
            padding="1.5"
            background="blue.200"
            rounded="md"
            shadow="2"
          >
            <View flexDirection="row" justifyContent="space-between">
              <Heading size="sm">{notification.title}</Heading>
              <Text>
                {
                  DateTime.fromISO(notification.sendTime).toLocaleString(DateTime.TIME_SIMPLE)
                }
              </Text>
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

async function refresh(
  notificationReferences: FirebaseFirestoreTypes.DocumentReference<FirestoreNotification>[],
  setNotifications: React.Dispatch<React.SetStateAction<FirestoreNotification[]>>
) {
  const now = DateTime.now();
  // Get the notifications from references
  const promises: Promise<FirestoreNotification | undefined>[] = [];

  let hasAlerted = false;

  for (const pastNotificationRef of notificationReferences) {
    promises.push((async () => {
      let pastNotificationSnapshot: FirebaseFirestoreTypes.DocumentSnapshot<FirestoreNotification> = await pastNotificationRef.get({ source: "cache" });
      if (!pastNotificationSnapshot.exists) {
        try {
          pastNotificationSnapshot = await pastNotificationRef.get();
        } catch (e) {
          universalCatch(e);
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          if (!hasAlerted) {
            Alert.alert("Error", "There was an error loading some of your notifications. Please try again.");
            hasAlerted = true;
          }
        }
      } else {
        const pastNotificationSnapshotData = pastNotificationSnapshot.data();
        if (isFirestoreNotification(pastNotificationSnapshotData)) {
          return pastNotificationSnapshotData;
        } else {
          log(`Past notification "${pastNotificationSnapshot.ref.path}" is not valid`, "warn");
        }
      }
    })());
  }

  setNotifications(
    (await Promise.all(promises))
      .filter((notification): notification is FirestoreNotification => notification !== undefined && now.diff(DateTime.fromISO(notification.sendTime)).toMillis() < 0)
      .sort((a, b) => DateTime.fromISO(b.sendTime).toMillis() - DateTime.fromISO(a.sendTime).toMillis())
  );
}

