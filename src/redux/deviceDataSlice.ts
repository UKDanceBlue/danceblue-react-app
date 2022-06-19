type DeviceDataSliceType = {
  deviceId: string | null;
  demoModeEnabled: boolean;
  pushToken: string | null;
  getsNotifications: boolean;
};

// Initial state
const initialState: DeviceDataSliceType = {
  deviceId: null,
  demoModeEnabled: false,
  pushToken: null,
  getsNotifications: false,
};
