import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { FirestoreNotification, isFirestoreNotification } from "@ukdanceblue/db-app-common";
import { manufacturer as deviceManufacturer } from "expo-device";
import { openSettings } from "expo-linking";
import { setBadgeCountAsync } from "expo-notifications";
import { DateTime } from "luxon";
import { Box, Button, Heading, Row, SectionList, Text, View, useTheme } from "native-base";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Alert, RefreshControl, SectionListRenderItem, useWindowDimensions } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, { useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring } from "react-native-reanimated";

import { log, universalCatch } from "../../../common/logging";
import { useDeviceData, useLoading, useUserData } from "../../../context";
import { useRefreshUserData } from "../../../context/user";

const NotificationRow = ({
  item: notification, screenWidth, sideMenuWidth
}: { item: FirestoreNotification; screenWidth: number; sideMenuWidth: number }) => {
  const { sizes } = useTheme();

  return (
    <Row
      width={screenWidth + sideMenuWidth}
      collapsable={false}
      my="2">
      <Box
        mx="4"
        p="1.5"
        background="blue.200"
        rounded="md"
        shadow="2"
        width={screenWidth - (sizes[4] * 2)}
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
      <Row
        width={sideMenuWidth}
      >
        <Button
          onPress={() => {
            Alert.alert(
              "Delete Notification",
              "Are you sure you want to delete this notification?"
            );
          }}
          width="100%"
          height="100%"
          variant="solid"
          colorScheme="red"
        >
          Delete
        </Button>
      </Row>
    </Row>
  );
};

const AnimatedNotificationRow: SectionListRenderItem<FirestoreNotification, { title: string; data: FirestoreNotification[] }> = ({ item }: { item: FirestoreNotification }) => {
  const { width: screenWidth } = useWindowDimensions();
  const sideMenuWidth = screenWidth * 0.2;
  const x = useSharedValue(0);

  // A gesture handler that allows swiping the view left only, right will just bounce
  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: { startX: number }) => {
      ctx.startX = x.value;
    },
    onActive: (event, ctx) => {
      const desiredTransition = ctx.startX + event.translationX;
      if (desiredTransition < 0) {
        // Try to move the view left (showing buttons)
        if (desiredTransition > -(sideMenuWidth + 20)) {
          // Not yet to the end of the buttons, so move the view without restriction
          x.value = desiredTransition;
        } else {
          // The view is already at the leftmost position, so bounce back
          x.value = -(sideMenuWidth + 20) + (desiredTransition + (sideMenuWidth + 20)) * 0.1;
        }
      } else {
        // Try to move the view right
        x.value = desiredTransition * 0.1;
      }
    },
    onEnd: () => {
      if (x.value < -sideMenuWidth) {
        x.value = withSpring(-sideMenuWidth * 1.25);
      } else {
        x.value = withSpring(0);
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return { transform: [{ translateX: x.value }] };
  });

  return (
    <PanGestureHandler onGestureEvent={gestureHandler} minDist={15}>
      <Animated.View style={animatedStyle} >
        <NotificationRow
          item={item}
          screenWidth={screenWidth}
          sideMenuWidth={sideMenuWidth}
        />
      </Animated.View>
    </PanGestureHandler>
  );
};

/**
 * Component for "Profile" screen in main navigation
 */
const NotificationScreen = () => {
  const { getsNotifications: notificationPermissionsGranted } = useDeviceData();

  const indexWithOpenMenu = useSharedValue<undefined | number>(undefined);

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
        data={{ notifications, indexWithOpenMenu }}
        getItem={(data: {
          notifications: FirestoreNotification[];
          indexWithOpenMenu: Animated.SharedValue<undefined | number>;
        }, index) => data.notifications[index]}
        getItemCount={(data: {
          notifications: FirestoreNotification[];
          indexWithOpenMenu: Animated.SharedValue<undefined | number>;
        }) => data.notifications.length}
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
        renderItem={AnimatedNotificationRow}
      />
    );
  }
};

export default NotificationScreen;

async function refresh(
  notificationReferences: FirebaseFirestoreTypes.DocumentReference<FirestoreNotification>[],
  setNotifications: Dispatch<SetStateAction<FirestoreNotification[]>>
) {
  // Get the notifications from references
  const promises: Promise<FirestoreNotification | undefined>[] = [];

  let hasAlerted = false;

  for (const pastNotificationRef of notificationReferences) {
    promises.push((async () => {
      let pastNotificationSnapshot: FirebaseFirestoreTypes.DocumentSnapshot<FirestoreNotification> | undefined = undefined;
      try {
        pastNotificationSnapshot = await pastNotificationRef.get({ source: "cache" });
      } catch (_) {
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
      }

      if (pastNotificationSnapshot == null) {
        return undefined;
      }

      const pastNotificationSnapshotData = pastNotificationSnapshot.data();
      if (isFirestoreNotification(pastNotificationSnapshotData)) {
        return pastNotificationSnapshotData;
      } else {
        log(`Past notification: FirebaseFirestoreTypes.DocumentSnapshot<FirestoreNotification> "${pastNotificationSnapshot.ref.path}" is not valid`, "warn");
        return undefined;
      }
    })());
  }

  const resolvedPromises = await Promise.all(promises);
  const notificationsByDate = resolvedPromises
    .filter((notification): notification is FirestoreNotification => notification !== undefined)
    .sort((a, b) => DateTime.fromISO(b.sendTime).toMillis() - DateTime.fromISO(a.sendTime).toMillis());
  setNotifications(notificationsByDate);
}
