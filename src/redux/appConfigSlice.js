/* eslint-disable no-param-reassign */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { doc, getDoc } from 'firebase/firestore';
import { showMessage } from '../common/AlertUtils';
import { firebaseFirestore } from '../common/FirebaseApp';

const initialState = {
  isConfigLoaded: false,
  scoreboard: null,
  countdown: null,
};

export const updateConfig = createAsyncThunk('appConfig/updateConfig', async () =>
  getDoc(doc(firebaseFirestore, 'configs', 'mobile-app')).then((snapshot) => {
    const snapshotData = snapshot.data();
    return {
      countdown: snapshotData.countdown
        ? {
            title: snapshotData.countdown.title,
            millis: snapshotData.countdown.time.seconds * 1000,
          }
        : null,
      scoreboard: snapshotData.scoreboard,
    };
  })
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
        state.isConfigLoaded = true;
      })
      .addCase(updateConfig.rejected, (state, action) => {
        state.isConfigLoaded = true;
        showMessage(action.error.message, action.error.code, null, true, action.error.stack);
      });
  },
});

export default appConfigSlice.reducer;
