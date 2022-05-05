import { useEffect, useMemo, useCallback, useState } from "react";
import { RefreshControl, View, ScrollView } from "react-native";
import { Text, Button, ListItem } from "react-native-elements";
import * as Notifications from "expo-notifications";
import * as SecureStore from "expo-secure-store";
import * as Device from "expo-device";
import * as Linking from "expo-linking";
import { doc, DocumentSnapshot, getDoc } from "firebase/firestore";
import { useAppSelector } from "../../common/CustomHooks";
import { globalStyles, globalTextStyles } from "../../theme";
import { firebaseFirestore } from "../../common/FirebaseApp";
import { showMessage } from "../../common/AlertUtils";
import store from "../../redux/store";
import { registerPushNotifications } from "../../redux/notificationSlice";
import { FirestoreNotification } from "../../types/FirebaseTypes";

const uuidStoreKey = __DEV__ ? "danceblue.device-uuid.dev" : "danceblue.device-uuid";

const notificationsCache = {} as {
  [key: string]: FirestoreNotification;
};

/**
 * Component for "Profile" screen in main navigation
 */
const NotificationScreen = () => {
  const notificationPermissionsGranted = useAppSelector(
    (state) => state.notification.notificationPermissionsGranted
  );
  const [notifications, setNotifications] = useState<FirestoreNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const notificationReferences = useAppSelector((state) => state.auth.pastNotifications);

  useEffect(() => {
    let shouldUpdateState = true;
    Notifications.getPermissionsAsync().then((settings) => {
      if (
        (settings.granted ||
          settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL ||
          settings.ios?.status === Notifications.IosAuthorizationStatus.AUTHORIZED) !==
        notificationPermissionsGranted
      ) {
        if (shouldUpdateState) {
          store.dispatch(registerPushNotifications());
        }
      }
    });
    return () => {
      shouldUpdateState = false;
    };
  }, [notificationPermissionsGranted]);

  const refresh = useCallback(async () => {
    // Start loading
    setIsLoading(true);
    try {
      if (store.getState().appConfig.offline) {
        showMessage("You seem to be offline, connect to the internet to load notifications");
      } else {
        const uuid = await SecureStore.getItemAsync(uuidStoreKey, {
          keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY,
        });

        // We have already set a UUID and can use the retrieved value
        if (uuid) {
          // An array of all notifications to be shown
          const tempNotifications = [] as FirestoreNotification[];

          /* Ensure everything is in the cache */
          // An array of getDoc promises for any new notifications we need to get
          const newNotificationPromises = [];
          // Get any new notifications and add any we already cached to tempNotifications
          for (let i = 0; i < notificationReferences.length; i++) {
            if (!notificationsCache[notificationReferences[i]]) {
              newNotificationPromises.push(
                getDoc(doc(firebaseFirestore, notificationReferences[i])).catch(() =>
                  showMessage("Failed to get past notification from server")
                )
              );
            } else {
              tempNotifications.push(notificationsCache[notificationReferences[i]]);
            }
          }
          // Wait for any new notifications to download and add them to tempNotifications as well
          const newNotifications = (await Promise.all(
            newNotificationPromises
          )) as DocumentSnapshot[];
          for (let i = 0; i < newNotifications.length; i++) {
            if (newNotifications[i].ref) {
              const newNotificationData = newNotifications[i].data() as FirestoreNotification;
              if (newNotificationData) {
                notificationsCache[newNotifications[i].ref.path] = newNotificationData;
                tempNotifications.push(notificationsCache[notificationReferences[i]]);
              }
            }
          }

          // Sort the list by time and update the state
          setNotifications(
            tempNotifications.sort((a, b) => b.sendTime.seconds - a.sendTime.seconds)
          );
        }
      }
    } catch (error) {
      showMessage(error, "Error retrieving notifications");
    } finally {
      // Done loading
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Only run the function in this hook if notifications changes
  const notificationsListView = useMemo(() => {
    const tempNotificationsListView = [];
    for (let i = 0; i < notifications.length; i++) {
      tempNotificationsListView.push(
        <ListItem key={i} style={{ flexDirection: "column" }}>
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
          refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refresh} />}
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
            <Button onPress={() => Linking.openSettings()} title="Open Settings" />
          )}
        </View>
      )}
    </>
  );
};

export default NotificationScreen;
