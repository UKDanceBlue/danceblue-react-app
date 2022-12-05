import firestore, { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { FirestoreNotification, isFirestoreNotification } from "@ukdanceblue/db-app-common";
import { manufacturer as deviceManufacturer } from "expo-device";
import { openSettings } from "expo-linking";
import { setBadgeCountAsync } from "expo-notifications";
import { DateTime } from "luxon";
import { Box, Button, Heading, Row, SectionList, Skeleton, Text, View, useTheme } from "native-base";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Alert, RefreshControl, SectionListRenderItem, useWindowDimensions } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, { SharedValue,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring } from "react-native-reanimated";

import { log, universalCatch } from "../../../common/logging";
import { useAuthData, useDeviceData, useLoading, useUserData } from "../../../context";
import { useRefreshUserData } from "../../../context/user";

interface NotificationListDataEntry {
  notification: (FirestoreNotification | undefined);
  reference: FirebaseFirestoreTypes.DocumentReference<FirestoreNotification> | undefined;
  indexWithOpenMenu: Animated.SharedValue<undefined | number>;
}

const AnimatedNotificationRow: SectionListRenderItem<NotificationListDataEntry | undefined, { title: string; data: (NotificationListDataEntry | undefined)[] }> = ({ item }: { item: NotificationListDataEntry | undefined }) => {
  const { width: screenWidth } = useWindowDimensions();
  const { sizes } = useTheme();
  const refreshUserData = useRefreshUserData();

  const { uid } = useAuthData();

  const sideMenuWidth = screenWidth * 0.2;
  const x = useSharedValue(0);
  const flung = useSharedValue(false);

  // A gesture handler that allows swiping the view left only, right will just bounce
  const panGestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: { startX: number }) => {
      ctx.startX = x.value;
    },
    onActive: (event, ctx) => {
      const desiredTransition = ctx.startX + event.translationX;
      if (desiredTransition < 0) {
        x.value = desiredTransition;
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

  const animatedViewStyle = useAnimatedStyle(() => {
    return { transform: [{ translateX: x.value }] };
  });

  const buttonRowHeight = useSharedValue<number>(0);
  const animatedButtonRowStyle = useAnimatedStyle(() => {
    let width = sideMenuWidth;

    if (x.value < -(sideMenuWidth + sizes["4"])) {
      width -= x.value + sideMenuWidth + sizes["4"];
    }

    return { width, height: buttonRowHeight.value };
  }, [
    x, buttonRowHeight, flung
  ]);

  const notification = item?.notification;
  const loading = notification == null;

  return (
    // TODO add support for flinging the menu to delete
    <PanGestureHandler onGestureEvent={panGestureHandler} minDist={15}>
      <Animated.View style={animatedViewStyle} >
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
            onLayout={(event) => {
              buttonRowHeight.value = (event.nativeEvent.layout.height);
            }}
          >
            <View flexDirection="row" justifyContent="space-between" mb="2">
              <Skeleton.Text
                isLoaded={!loading}
                lines={1}
                width={(screenWidth / 6) * 3}
              >
                <Heading
                  size="sm"
                  flex={5}>{notification?.title}</Heading>
              </Skeleton.Text>
              <Skeleton.Text
                isLoaded={!loading}
                lines={1}
                width={(screenWidth / 6) * 2}
                textAlign="end"
              >
                <Text flex={1}>
                  {
                    notification && DateTime.fromISO(notification.sendTime).toLocaleString(DateTime.TIME_SIMPLE)
                  }
                </Text>
              </Skeleton.Text>
            </View>
            <Skeleton.Text
              isLoaded={!loading}
              width={screenWidth - (sizes[4] * 3)}
            >
              <Text>
                <Text>{notification?.body}</Text>
              </Text>
            </Skeleton.Text>
          </Box>
          <Animated.View
            style={animatedButtonRowStyle}
          >
            <Button
              disabled={uid == null}
              onPress={() => {
                Alert.alert(
                  "Delete Notification",
                  "Are you sure you want to delete this notification?",
                  [
                    {
                      style: "cancel",
                      text: "Cancel"
                    },
                    {
                      style: "destructive",
                      text: "Delete",
                      onPress: () => {
                        if (uid) {
                          firestore()
                            .collection("users")
                            .doc(uid)
                            .update({ notificationReferences: firestore.FieldValue.arrayRemove(item?.reference) })
                            .then(refreshUserData)
                            .catch(universalCatch);
                        }
                      }
                    }
                  ]
                );
              }}
              width="100%"
              height="100%"
              variant="solid"
              colorScheme="red"
            >
              Delete
            </Button>
          </Animated.View>
        </Row>
      </Animated.View>
    </PanGestureHandler>
  );
};

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
    refresh(notificationReferences, setNotifications, indexWithOpenMenu).catch(universalCatch);
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
              .then(() => refresh(notificationReferences, setNotifications, indexWithOpenMenu))
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
        renderSectionHeader={({ section: { title } }) => (
          <View
            backgroundColor="light.100">
            <Heading
              size="md"
              p={2}
            >
              {title}
            </Heading>
          </View>
        )}
        renderItem={AnimatedNotificationRow}
      />
    );
  }
}

export default NotificationScreen;

async function refresh(
  notificationReferences: FirebaseFirestoreTypes.DocumentReference<FirestoreNotification>[],
  setNotifications: Dispatch<SetStateAction<(NotificationListDataEntry | undefined)[]>>,
  indexWithOpenMenu: SharedValue<number | undefined>) {
  // Get the notifications from references
  const promises: Promise<NotificationListDataEntry | undefined>[] = [];

  let hasAlerted = false;

  for (const pastNotificationRef of notificationReferences) {
    promises.push((async () => {
      let pastNotificationSnapshot: FirebaseFirestoreTypes.DocumentSnapshot<FirestoreNotification> | undefined = undefined;
      try {
        pastNotificationSnapshot = await pastNotificationRef.get({ source: "server" });
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
        return {
          notification: pastNotificationSnapshotData,
          indexWithOpenMenu,
          reference: pastNotificationSnapshot.ref
        };
      } else {
        log(`Past notification: FirebaseFirestoreTypes.DocumentSnapshot<FirestoreNotification> "${pastNotificationSnapshot.ref.path}" is not valid`, "warn");
        return undefined;
      }
    })());
  }

  const resolvedPromises = await Promise.all(promises);
  const notificationsByDate = resolvedPromises
    .filter((notification): notification is NotificationListDataEntry => notification !== undefined)
    .sort((a, b) => (
      b.notification?.sendTime == null
        ? 0
        : DateTime.fromISO(b.notification.sendTime).toMillis()
    ) -
      (a.notification?.sendTime == null
        ? 0
        : DateTime.fromISO(a.notification.sendTime).toMillis()
      )
    );
  setNotifications(notificationsByDate);
}
