import { createSlice } from "@reduxjs/toolkit";

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
  reducers: {},
});

// export const {  } = deviceDataSlice.actions;

export default deviceDataSlice.reducer;
