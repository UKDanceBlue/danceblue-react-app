import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { doc, getDoc } from 'firebase/firestore';
import { globalStyles, globalTextStyles } from '../../theme';
import { firebaseFirestore } from '../../common/FirebaseApp';
import { showMessage } from '../../common/AlertUtils';

const secureStoreKey = 'danceblue-device-uuid';
const secureStoreOptions = { keychainAccessible: SecureStore.ALWAYS_THIS_DEVICE_ONLY };

/**
 * Component for "Profile" screen in main navigation
 */
const NotificationScreen = () => {
  const [notifications, setNotifications] = useState([]);
  const [notificationsListView, setNotificationsListView] = useState();

  useEffect(() => {
    SecureStore.isAvailableAsync().then(async (isAvailable) => {
      if (isAvailable) {
        await SecureStore.getItemAsync(secureStoreKey, secureStoreOptions).then(async (uuid) => {
          // We have already set a UUID and can use the retrieved value
          if (uuid) {
            // Get this device's doc
            const deviceRef = doc(firebaseFirestore, 'devices', uuid);
            // Set notifications to the array found in firebase
            getDoc(deviceRef).then((snapshot) =>
              setNotifications(snapshot.get('pastNotifications'))
            );
          }
        });
      } else {
        showMessage('Cannot retrieve device ID, push notificatons unavailable');
      }
    });
  }, []);

  useEffect(() => {
    const tempNotificationsListView = [];
    for (let i = 0; i < notifications.length; i++) {
      tempNotificationsListView.push(
        <View style={globalStyles.genericRow} key={i}>
          <View style={globalStyles.genericView}>
            <Text style={globalTextStyles.headerText}>{notifications[i].title}</Text>
            <Text>{notifications[i].body}</Text>
          </View>
        </View>
      );
    }
    setNotificationsListView(tempNotificationsListView);
  }, [notifications]);

  return (
    <View style={globalStyles.genericView}>{notificationsListView || <ActivityIndicator />}</View>
  );
};

export default NotificationScreen;
