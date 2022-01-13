/* eslint-disable no-param-reassign */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { showMessage } from '../common/AlertUtils';

const initialState = {
  scoreboard: null,
  countdown: null,
};

export const updateConfig = createAsyncThunk('appConfig/updateConfig', async () => {});

// Redux Toolkit allows us to write "mutating" logic in reducers. It
// doesn't actually mutate the state because it uses the Immer library,
// which detects changes to a "draft state" and produces a brand new
// immutable state based off those changes
export const appConfigSlice = createSlice({
  name: 'appConfig',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateConfig.pending, (state) => {
        Object.assign(state, initialState);
      })
      .addCase(updateConfig.fulfilled, () => {})
      .addCase(updateConfig.rejected, (state, action) => {
        showMessage(action.error.message, action.error.code, null, true, action.error.stack);
      });
  },
});

export default appConfigSlice.reducer;
