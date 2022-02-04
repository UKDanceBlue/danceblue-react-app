/* eslint-disable no-param-reassign */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as Notifications from 'expo-notifications';
import * as SecureStore from 'expo-secure-store';
import * as Device from 'expo-device';
import { doc, setDoc } from 'firebase/firestore';
import { showMessage } from '../common/AlertUtils';
import { firebaseFirestore } from '../common/FirebaseApp';
import { globalColors } from '../theme';
import generateUuid from '../common/GenerateUuid';

const uuidStoreKey = __DEV__ ? 'danceblue.device-uuid.dev' : 'danceblue.device-uuid';

const initialState = {
  uuid: null,
  pushToken: null,
  notificationPermissionsGranted: null,
};

export const obtainUuid = createAsyncThunk('notification/obtainUuid', async () =>
  // Get UUID from async storage
  SecureStore.getItemAsync(uuidStoreKey, {
    keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY,
  }).then(async (uuid) => {
    // If nothing was in async storage, generate a new uuid and store it
    if (uuid) {
      return uuid;
    }

    uuid = generateUuid();
    await SecureStore.setItemAsync(uuidStoreKey, uuid, {
      keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY,
    });
    return uuid;
  })
);

export const registerPushNotifications = createAsyncThunk(
  'notification/registerPushNotifications',
  async (arg, thunkApi) => {
    if (Device.isDevice) {
      // Get the user's current preference
      let settings = await Notifications.getPermissionsAsync();

      // If the user hasn't set a preference yet, ask them.
      if (
        settings.status === 'undetermined' ||
        settings.ios?.status === Notifications.IosAuthorizationStatus.NOT_DETERMINED
      ) {
        settings = await Notifications.requestPermissionsAsync({
          android: {},
          ios: {
            allowAlert: true,
            allowBadge: true,
            allowSound: true,
            allowDisplayInCarPlay: false,
            allowCriticalAlerts: true,
            provideAppNotificationSettings: false,
            allowProvisional: false,
            allowAnnouncements: false,
          },
        });
      }

      // The user allows notifications, return the push token
      if (
        settings.granted ||
        settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL ||
        settings.ios?.status === Notifications.IosAuthorizationStatus.AUTHORIZED
      ) {
        if (Device.osName === 'Android') {
          Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: globalColors.red,
          });
        }

        return Notifications.getExpoPushTokenAsync().then(async (token) => {
          const { uuid } = thunkApi.getState().notification;
          if (uuid) {
            // Store the push notification token in firebase
            await setDoc(
              doc(firebaseFirestore, 'devices', uuid),
              {
                expoPushToken: token.data || null,
              },
              { mergeFields: ['expoPushToken'] }
            );
          }
          return { token, notificationPermissionsGranted: true };
        });
      } else {
        return { token: null, notificationPermissionsGranted: false };
      }
    } else {
      return thunkApi.rejectWithValue({ error: 'DEVICE_IS_EMULATOR' });
    }
  }
);

export const refreshPastNotifications = createAsyncThunk(
  'notification/updateConfig',
  async () => {}
);

// Redux Toolkit allows us to write "mutating" logic in reducers. It
// doesn't actually mutate the state because it uses the Immer library,
// which detects changes to a "draft state" and produces a brand new
// immutable state based off those changes
export const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(obtainUuid.fulfilled, (state, action) => {
        state.uuid = action.payload;
      })
      .addCase(obtainUuid.rejected, (state, action) => {
        showMessage(action.error.message, action.error.code, null, true, action.error.stack);
      })

      .addCase(registerPushNotifications.fulfilled, (state, action) => {
        state.notificationPermissionsGranted = action.payload.notificationPermissionsGranted;
        if (action.payload.notificationPermissionsGranted) {
          state.pushToken = action.payload.token.data;
        }
      })
      .addCase(registerPushNotifications.rejected, (state, action) => {
        if (action.error.message === 'Rejected') {
          switch (action?.payload?.error) {
            case 'DEVICE_IS_EMULATOR':
              showMessage('Emulators will not receive push notifications');
              break;
            default:
              showMessage(
                'DanceBlue Mobile ran into an unexpected issue with the notification server. This is a bug, please report it to the DanceBlue committee.',
                'Notification Error',
                () => {},
                true,
                action
              );
          }
        } else {
          showMessage(action.error.message, action.error.code, null, true, action.error.stack);
        }
      });
  },
});

export default notificationSlice.reducer;
