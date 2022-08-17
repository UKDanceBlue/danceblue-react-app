import firebaseRemoteConfig from "@react-native-firebase/remote-config";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { log, logError } from "../common/logging";
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
  (): Partial<AppConfigSliceType> => {
    const remoteConfigData = firebaseRemoteConfig().getAll();
    const parsedRemoteConfig: Partial<AppConfigSliceType> = {};

    try {
      parsedRemoteConfig.enabledScreens = (JSON.parse(remoteConfigData.shown_tabs.asString()) ?? undefined) as string[];
    } catch (e) {
      if (e instanceof SyntaxError) {
        log("Error parsing 'shown_tabs'");
        logError(e);
        parsedRemoteConfig.enabledScreens = undefined;
      } else {
        throw e;
      }
    }
    try {
      parsedRemoteConfig.allowedLoginTypes = (JSON.parse(remoteConfigData.login_mode.asString()) as (UserLoginType[] | undefined) ?? undefined);
    } catch (e) {
      if (e instanceof SyntaxError) {
        log("Error while parsing 'login_mode' config");
        logError(e);
        parsedRemoteConfig.allowedLoginTypes = undefined;
      } else {
        throw e;
      }
    }
    parsedRemoteConfig.demoModeKey = remoteConfigData.demo_mode_key.asString();
    try {
      parsedRemoteConfig.scoreboardMode = (JSON.parse(remoteConfigData.rn_scoreboard_mode.asString()) ?? undefined) as {
        pointType: string;
        showIcons: boolean;
        showTrophies: boolean;
    } | undefined;
    } catch (e) {
      if (e instanceof SyntaxError) {
        log("Error while parsing 'rn_scoreboard_mode' config");
        logError(e);
        parsedRemoteConfig.scoreboardMode = undefined;
      } else {
        throw e;
      }
    }

    return parsedRemoteConfig;
  }
);

const appConfigSlice = createSlice({
  name: "appConfig",
  initialState,
  reducers: {
    // Reset config reducer
    resetConfig(state) {
      Object.assign(state, initialState);
    },
    enterDemoMode(state) {
      Object.assign(state, {
        isConfigLoaded: true,
        enabledScreens: [
          "Events", "Scoreboard", "Team", "MarathonHours"
        ],
        scoreboardMode: initialState.scoreboardMode,
        allowedLoginTypes: [],
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
        showMessage(action.error.message ?? "", action.error.code, undefined);
      });
  },
});

export default appConfigSlice.reducer;
export const {
  resetConfig, enterDemoMode
} = appConfigSlice.actions;
