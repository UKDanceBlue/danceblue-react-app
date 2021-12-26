import React, { useEffect, useMemo, useCallback, useState } from 'react';
import { RefreshControl, Text, View } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { doc, getDoc } from 'firebase/firestore';
import { ScrollView } from 'react-native-gesture-handler';
import { globalStyles, globalTextStyles } from '../../theme';
import { firebaseFirestore } from '../../common/FirebaseApp';
import { showMessage } from '../../common/AlertUtils';

const secureStoreKey = 'danceblue-device-uuid';
const secureStoreOptions = { keychainAccessible: SecureStore.ALWAYS_THIS_DEVICE_ONLY };

const notificationsCache = {};

/**
 * Component for "Profile" screen in main navigation
 */
const NotificationScreen = () => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const refresh = useCallback(() => {
    // Start loading
    setIsLoading(true);
    // Check if OS secure store is available
    SecureStore.isAvailableAsync()
      .then(async (isAvailable) => {
        if (isAvailable) {
          await SecureStore.getItemAsync(secureStoreKey, secureStoreOptions)
            .then(async (uuid) => {
              // We have already set a UUID and can use the retrieved value
              if (uuid) {
                // Get a reference to this device's firebase document
                const deviceRef = doc(firebaseFirestore, 'devices', uuid);
                let notificationReferences = [];
                // Get the list of notifications sent to this device from firebase
                await getDoc(deviceRef)
                  .then((snapshot) => {
                    notificationReferences = snapshot.get('pastNotifications');
                  })
                  .catch(() =>
                    showMessage('Cannot connect to server, push notificatons unavailable')
                  );

                // An array of all notifications to be shown
                const tempNotifications = [];

                /* Ensure everything is in the cache */
                // An array of getDoc promises for any new notifications we need to get
                const newNotificationPromises = [];
                // Get any new notifications and add any we already cached to tempNotifications
                for (let i = 0; i < notificationReferences.length; i++) {
                  if (!notificationsCache[notificationReferences[i].id]) {
                    newNotificationPromises.push(getDoc(notificationReferences[i]));
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
                setNotifications(
                  tempNotifications.sort((a, b) => b.sendTime.seconds - a.sendTime.seconds)
                );
              }
            })
            .catch(() => showMessage('Cannot retrieve device ID, push notificatons unavailable'));
        } else {
          showMessage('Cannot retrieve device ID, push notificatons unavailable');
        }
      })
      .catch(() => showMessage('Cannot retrieve device ID, push notificatons unavailable'));

    // Done loading
    setIsLoading(false);
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
    <ScrollView
      style={globalStyles.genericView}
      refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refresh} />}
    >
      {notificationsListView}
    </ScrollView>
  );
};

export default NotificationScreen;
