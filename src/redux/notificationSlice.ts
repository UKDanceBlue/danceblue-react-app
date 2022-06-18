import firestore from "@react-native-firebase/firestore";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { ExpoPushToken } from "expo-notifications";
import * as SecureStore from "expo-secure-store";

import { showMessage } from "../common/AlertUtils";
import generateUuid from "../common/GenerateUuid";
import { globalColors } from "../theme";

const uuidStoreKey = __DEV__ ? "danceblue.device-uuid.dev" : "danceblue.device-uuid";

type NotificationSliceType = {
  uuid: string | null;
  pushToken: string | null;
  notificationPermissionsGranted: boolean | null;
};

const initialState: NotificationSliceType = {
  uuid: null,
  pushToken: null,
  notificationPermissionsGranted: null,
};

export const obtainUuid = createAsyncThunk("notification/obtainUuid", async () =>
  // Get UUID from async storage
  SecureStore.getItemAsync(uuidStoreKey, { keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY }).then(async (uuid) => {
    // If nothing was in async storage, generate a new uuid and store it
    if (uuid) {
      return uuid;
    }

    uuid = generateUuid() as string;

    await SecureStore.setItemAsync(uuidStoreKey, uuid, { keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY });
    return uuid;
  })
);

type RegisterPushNotificationsErrors = { error: "DEVICE_IS_EMULATOR" };

export const registerPushNotifications = createAsyncThunk<
  { token: ExpoPushToken | null; notificationPermissionsGranted: boolean },
  void,
  { state: { notification: NotificationSliceType } }
>("notification/registerPushNotifications", async (arg, thunkApi) => {
  if (Device.isDevice) {
    // Get the user's current preference
    let settings = await Notifications.getPermissionsAsync();

    // If the user hasn't set a preference yet, ask them.
    if (
      settings.status === "undetermined" ||
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
      if (Device.osName === "Android") {
        Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [
            0, 250, 250, 250
          ],
          lightColor: globalColors.red,
        });
      }

      return Notifications.getExpoPushTokenAsync().then(async (token) => {
        const { uuid } = thunkApi.getState().notification;
        if (uuid) {
          // Store the push notification token in firebase
          await firestore().doc(`devices/${uuid}`).set({ expoPushToken: token.data || null },
            { mergeFields: ["expoPushToken"] }
          );
        }
        return { token, notificationPermissionsGranted: true };
      });
    } else {
      return { token: null, notificationPermissionsGranted: false };
    }
  } else {
    return thunkApi.rejectWithValue({ error: "DEVICE_IS_EMULATOR" });
  }
});

export const refreshPastNotifications = createAsyncThunk(
  "notification/updateConfig",
  async () => {}
);

// Redux Toolkit allows us to write "mutating" logic in reducers. It
// Doesn't actually mutate the state because it uses the Immer library,
// Which detects changes to a "draft state" and produces a brand new
// Immutable state based off those changes
export const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(obtainUuid.fulfilled, (state, action) => {
        state.uuid = action.payload;
      })
      .addCase(obtainUuid.rejected, (state, action) => {
        showMessage(action.error.message ?? "Undefined Error", action.error.code, undefined, true, action.error.stack);
      })

      .addCase(registerPushNotifications.fulfilled, (state, action) => {
        state.notificationPermissionsGranted = action.payload.notificationPermissionsGranted;
        if (action.payload.notificationPermissionsGranted) {
          state.pushToken = action.payload.token?.data ?? null;
        }
      })
      .addCase(registerPushNotifications.rejected, (state, action) => {
        if (action.error.message === "Rejected") {
          switch ((action?.payload as RegisterPushNotificationsErrors)?.error) {
          case "DEVICE_IS_EMULATOR":
            showMessage("Emulators will not receive push notifications");
            break;
          default:
            showMessage(
              "DanceBlue Mobile ran into an unexpected issue with the notification server. This is a bug, please report it to the DanceBlue committee.",
              "Notification Error",
              () => {},
              true,
              action
            );
          }
        } else {
          showMessage(action.error.message ?? "Undefined Error", action.error.code, undefined, true, action.error.stack);
        }
      });
  },
});

export default notificationSlice.reducer;
