/* eslint-disable no-param-reassign */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { showMessage } from '../common/AlertUtils';
import { firebaseAuth, firebaseFirestore } from '../common/FirebaseApp';
import { FirestoreHour, FirestoreMobileAppConfig } from '../types/FirebaseTypes';
import { authSlice, logout, syncAuthStateWithUser } from './authSlice';
import store from './store';

type AppConfigSliceType = {
  isConfigLoaded: boolean;
  countdown: { millis: number; title: string };
  configuredTabs: string[];
  scoreboard: {
    pointType: 'spirit' | 'morale';
    showIcons: boolean;
    showTrophies: boolean;
  };
  demoMode?: boolean;
  demoModeKey: string;
  marathonHours: FirestoreHour[];
  offline: boolean;
};

const initialState: AppConfigSliceType = {
  isConfigLoaded: false,
  scoreboard: null,
  countdown: null,
  configuredTabs: [],
  demoMode: false,
  demoModeKey: Math.random().toString(), // Start the demo key as junk for safety's sake
  marathonHours: [],
  offline: false,
};

export const updateConfig = createAsyncThunk(
  'appConfig/updateConfig',
  async (): Promise<Partial<AppConfigSliceType>> => {
    // Get app config
    const snapshot = await getDoc(doc(firebaseFirestore, 'configs', 'mobile-app'));
    const snapshotData = snapshot.data() as FirestoreMobileAppConfig;

    // !!!MARATHON CODE!!! Get marathon hours
    const marathonHoursSnapshot = await getDocs(
      collection(firebaseFirestore, 'marathon', '2022/hours')
    );
    const marathonHours: FirestoreHour[] = [];
    marathonHoursSnapshot.forEach((docSnap) => marathonHours.push(docSnap.data() as FirestoreHour));

    return {
      countdown: snapshotData.countdown
        ? {
            title: snapshotData.countdown.title,
            millis: snapshotData.countdown.time.seconds * 1000,
          }
        : null,
      scoreboard: snapshotData.scoreboard,
      configuredTabs: snapshotData.currentTabs,
      demoModeKey: snapshotData.demoModeKey,
      marathonHours,
    };
  }
);

// Redux Toolkit allows us to write "mutating" logic in reducers. It
// doesn't actually mutate the state because it uses the Immer library,
// which detects changes to a "draft state" and produces a brand new
// immutable state based off those changes
export const appConfigSlice = createSlice({
  name: 'appConfig',
  initialState,
  reducers: {
    // Reset config reducer
    resetConfig(state) {
      Object.assign(state, initialState);
    },
    enterDemoMode(state) {
      Object.assign(state, {
        countdown: {
          title: 'DanceBlue 2022',
          millis: 1646514000000,
        },
        isConfigLoaded: true,
        demoMode: true,
      });
    },
    goOffline(state) {
      state.offline = true;
      store.dispatch(authSlice.actions.loginOffline());
    },
    goOnline(state) {
      if (firebaseAuth.currentUser) {
        store.dispatch(syncAuthStateWithUser(firebaseAuth.currentUser));
      } else {
        store.dispatch(logout());
      }
      state.offline = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Update config reducer
      .addCase(updateConfig.pending, (state) => {
        Object.assign(state, initialState);
      })
      .addCase(updateConfig.fulfilled, (state, action) => {
        state.countdown = action.payload.countdown;
        state.scoreboard = action.payload.scoreboard;
        state.configuredTabs = action.payload.configuredTabs;
        state.demoModeKey = action.payload.demoModeKey;
        state.marathonHours = action.payload.marathonHours;
        state.isConfigLoaded = true;
      })
      .addCase(updateConfig.rejected, (state, action) => {
        state.isConfigLoaded = true;
        showMessage(action.error.message, action.error.code, null, true, action.error.stack);
      });
  },
});

export default appConfigSlice.reducer;
