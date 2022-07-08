import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface DeviceDataSliceType {
  deviceId: string | null;
  demoModeEnabled: boolean;
  pushToken: string | null;
  getsNotifications: boolean;
}

// Initial state
const initialState: DeviceDataSliceType = {
  deviceId: null,
  demoModeEnabled: false,
  pushToken: null,
  getsNotifications: false,
};

const deviceDataSlice = createSlice({
  initialState,
  name: "deviceData",
  reducers: {
    // Demo mode
    setDemoModeEnabled(state, action: PayloadAction<boolean>) {
      state.demoModeEnabled = action.payload;
    },
    // Push token
    setPushToken(state, action: PayloadAction<string | null>) {
      state.pushToken = action.payload;
    },
    // Gets notifications
    setGetsNotifications(state, action: PayloadAction<boolean>) {
      state.getsNotifications = action.payload;
    }
  },
});

export const {
  setDemoModeEnabled, setGetsNotifications, setPushToken
} = deviceDataSlice.actions;

export default deviceDataSlice.reducer;
