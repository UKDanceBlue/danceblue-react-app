import React, { useEffect, useMemo, useCallback, useState } from 'react';
import { RefreshControl, Text, View, ScrollView, Button } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as SecureStore from 'expo-secure-store';
import * as Device from 'expo-device';
import * as Linking from 'expo-linking';
import { doc, getDoc } from 'firebase/firestore';
import { useSelector } from 'react-redux';
import { globalStyles, globalTextStyles } from '../../theme';
import { firebaseFirestore } from '../../common/FirebaseApp';
import { showMessage } from '../../common/AlertUtils';
import store from '../../redux/store';
import { registerPushNotifications } from '../../redux/notificationSlice';

const uuidStoreKey = __DEV__ ? 'danceblue.device-uuid.dev' : 'danceblue.device-uuid';

const notificationsCache = {};

/**
 * Component for "Profile" screen in main navigation
 */
const NotificationScreen = () => {
  const notificationPermissionsGranted = useSelector(
    (state) => state.notification.notificationPermissionsGranted
  );
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Notifications.getPermissionsAsync().then((settings) => {
      if (
        (settings.granted ||
          settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL ||
          settings.ios?.status === Notifications.IosAuthorizationStatus.AUTHORIZED) !==
        notificationPermissionsGranted
      ) {
        store.dispatch(registerPushNotifications());
      }
    });
  }, [notificationPermissionsGranted]);

  const refresh = useCallback(async () => {
    // Start loading
    setIsLoading(true);
    try {
      const uuid = await SecureStore.getItemAsync(uuidStoreKey, {
        keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY,
      });

      // We have already set a UUID and can use the retrieved value
      if (uuid) {
        // Get a reference to this device's firebase document
        const deviceRef = doc(firebaseFirestore, 'devices', uuid);
        let notificationReferences = [];
        // Get the list of notifications sent to this device from firebase
        const deviceData = (
          await getDoc(deviceRef).catch(() =>
            showMessage('Cannot connect to server, push notificatons unavailable')
          )
        ).data();
        notificationReferences = deviceData.pastNotifications ? deviceData.pastNotifications : [];

        // An array of all notifications to be shown
        const tempNotifications = [];

        /* Ensure everything is in the cache */
        // An array of getDoc promises for any new notifications we need to get
        const newNotificationPromises = [];
        // Get any new notifications and add any we already cached to tempNotifications
        for (let i = 0; i < notificationReferences.length; i++) {
          if (!notificationsCache[notificationReferences[i].id]) {
            newNotificationPromises.push(
              getDoc(notificationReferences[i]).catch(() =>
                showMessage('Failed to get past notification from server')
              )
            );
          } else {
            tempNotifications.push(notificationsCache[notificationReferences[i].id]);
          }
        }
        // Wait for any new notifications to download and add them to tempNotifications as well
        const newNotifications = await Promise.all(newNotificationPromises);
        for (let i = 0; i < newNotifications.length; i++) {
          notificationsCache[newNotifications[i].ref.id] = newNotifications[i].data();
          tempNotifications.push(notificationsCache[notificationReferences[i].id]);
        }

        // Sort the list by time and update the state
        setNotifications(tempNotifications.sort((a, b) => b.sendTime.seconds - a.sendTime.seconds));
      }
    } catch (error) {
      showMessage(error, 'Error retrieving notifications');
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
        <View style={globalStyles.genericRow} key={i}>
          <View style={globalStyles.genericView}>
            {/* Title */}
            <Text style={globalTextStyles.boldText}>{notifications[i].title}</Text>
            {/* Body */}
            <Text style={globalStyles.genericText}>{notifications[i].body}</Text>
            {/* Timestamp */}
            <Text style={globalTextStyles.italicText}>
              {Date.now() - notifications[i].sendTime.toMillis() < 43200000
                ? notifications[i].sendTime
                    .toDate()
                    .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : notifications[i].sendTime.toDate().toLocaleDateString()}
            </Text>
          </View>
        </View>
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
          {Device.manufacturer === 'Apple' && (
            <Button onPress={() => Linking.openSettings()} title="Open Settings" />
          )}
        </View>
      )}
    </>
  );
};

export default NotificationScreen;
