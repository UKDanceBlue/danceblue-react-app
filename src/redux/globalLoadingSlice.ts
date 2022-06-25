import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface GlobalLoadingSliceType {
  loadingTokens: Record<string, boolean>;
  anyLoading: boolean;
}

const initialState: GlobalLoadingSliceType = { loadingTokens: {}, anyLoading: false };

const globalLoadingSlice = createSlice({
  initialState,
  name: "globalLoading",
  reducers: {
    setLoading: (state, action: PayloadAction<{ token: string; loading: boolean }>) => {
      state.loadingTokens[action.payload.token] = action.payload.loading;
      if (action.payload.loading && !state.anyLoading) {
        state.anyLoading = true;
      } else if (!action.payload.loading && state.anyLoading) {
        state.anyLoading = Object.values(state.loadingTokens).some((value) => value);
      }
    },
    startLoading: (state, action: PayloadAction<string>) => {
      state.loadingTokens[action.payload] = true;
      state.anyLoading = true;
    },
    stopLoading: (state, action: PayloadAction<string>) => {
      state.loadingTokens[action.payload] = false;
      state.anyLoading = Object.values(state.loadingTokens).some((value) => value);
    },
    stopAllLoading: (state) => {
      state.loadingTokens = {};
      state.anyLoading = false;
    }
  },
});

export const {
  setLoading, startLoading, stopAllLoading, stopLoading
} = globalLoadingSlice.actions;

export default globalLoadingSlice.reducer;
