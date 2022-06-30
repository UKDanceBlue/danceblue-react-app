import firebaseRemoteConfig from "@react-native-firebase/remote-config";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { showMessage } from "../common/util/AlertUtils";

import { UserLoginType } from "./userDataSlice";

interface AppConfigSliceType {
  isConfigLoaded: boolean;
  enabledScreens: string[];
  allowedLoginTypes: UserLoginType[];
  scoreboardMode: { pointType:string;showIcons:boolean;showTrophies:boolean };
  demoModeKey: string;
}

const initialState: AppConfigSliceType = {
  isConfigLoaded: false,
  enabledScreens: [],
  allowedLoginTypes: [],
  scoreboardMode: { pointType: "", showIcons: false, showTrophies: false },
  demoModeKey: Math.random().toString(), // Start the demo key as junk for safety's sake
};

export const updateConfig = createAsyncThunk(
  "appConfig/updateConfig",
  async (): Promise<Partial<AppConfigSliceType>> => {
    const remoteConfigInstance = firebaseRemoteConfig();
    await remoteConfigInstance.fetchAndActivate();
    const remoteConfig = {} as Partial<AppConfigSliceType>;

    remoteConfig.enabledScreens = (JSON.parse(remoteConfigInstance.getString("rn_shown_tabs")) ?? undefined) as string[] | undefined;
    remoteConfig.allowedLoginTypes = ((JSON.parse(remoteConfigInstance.getString("login_mode")) as { rn?: UserLoginType[] }).rn ?? undefined);
    remoteConfig.demoModeKey = remoteConfigInstance.getString("demo_mode_key");
    remoteConfig.scoreboardMode = (JSON.parse(remoteConfigInstance.getString("rn_scoreboard_mode")) ?? undefined) as {
      pointType: string;
      showIcons: boolean;
      showTrophies: boolean;
  } | undefined;

    return remoteConfig;
  }
);

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
        scoreboardMode: {},
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
        state.enabledScreens = action.payload.enabledScreens ?? initialState.enabledScreens;
        state.scoreboardMode = action.payload.scoreboardMode ?? initialState.scoreboardMode;
        state.allowedLoginTypes = action.payload.allowedLoginTypes ?? initialState.allowedLoginTypes;
        state.demoModeKey = action.payload.demoModeKey ?? initialState.demoModeKey;
        state.isConfigLoaded = true;
      })
      .addCase(updateConfig.rejected, (state, action) => {
        state.isConfigLoaded = true;
        showMessage(action.error.message ?? "", action.error.code, undefined, true, action.error.stack);
      });
  },
});

export default appConfigSlice.reducer;
