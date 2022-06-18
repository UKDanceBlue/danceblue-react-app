import firebaseRemoteConfig from "@react-native-firebase/remote-config";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { showMessage } from "../common/AlertUtils";

import { UserLoginType } from "./userDataSlice";

type AppConfigSliceType = {
  isConfigLoaded: boolean;
  enabledScreens: string[];
  countdowns: {
    [key: string]: { millis: number; title: string };
  };
  allowedLoginTypes: UserLoginType[];
  demoModeKey: string;
};

const initialState: AppConfigSliceType = {
  isConfigLoaded: false,
  enabledScreens: [],
  countdowns: {},
  allowedLoginTypes: [],
  demoModeKey: Math.random().toString(), // Start the demo key as junk for safety's sake
};

export const updateConfig = createAsyncThunk(
  "appConfig/updateConfig",
  async (): Promise<Partial<AppConfigSliceType>> => {
    await firebaseRemoteConfig().fetchAndActivate();
    const remoteConfig = firebaseRemoteConfig().getAll();
    console.log("Remote config:", remoteConfig);

    return {};
  }
);

// Redux Toolkit allows us to write "mutating" logic in reducers. It
// Doesn't actually mutate the state because it uses the Immer library,
// Which detects changes to a "draft state" and produces a brand new
// Immutable state based off those changes
export const appConfigSlice = createSlice({
  name: "appConfig",
  initialState,
  reducers: {
    // Reset config reducer
    resetConfig(state) {
      Object.assign(state, initialState);
    },
    enterDemoMode(state) {
      Object.assign(state, {
        isConfigLoaded: false,
        enabledScreens: [],
        countdowns: {},
        allowedLoginTypes: [],
        demoModeKey: Math.random().toString(), // Start the demo key as junk for safety's sake
      });
    },
  },
  extraReducers: (builder) => {
    builder
      // Update config reducer
      .addCase(updateConfig.pending, (state) => {
        Object.assign(state, initialState);
      })
      .addCase(updateConfig.fulfilled, (state, action) => {
        state.enabledScreens = action.payload.enabledScreens || initialState.enabledScreens;
        state.countdowns = action.payload.countdowns || initialState.countdowns;
        state.allowedLoginTypes = action.payload.allowedLoginTypes || initialState.allowedLoginTypes;
        state.demoModeKey = action.payload.demoModeKey || initialState.demoModeKey;
        state.isConfigLoaded = true;
      })
      .addCase(updateConfig.rejected, (state, action) => {
        state.isConfigLoaded = true;
        showMessage(action.error.message ?? "", action.error.code, undefined, true, action.error.stack);
      });
  },
});

export default appConfigSlice.reducer;
