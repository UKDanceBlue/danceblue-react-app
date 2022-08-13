import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import crashlytics from "@react-native-firebase/crashlytics";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { startLoading, stopLoading } from "./globalLoadingSlice";

interface AuthSliceType {
  isAuthLoaded: boolean;
  isLoggedIn: boolean;
  isAnonymous: boolean;
  uid: string | null;
  authClaims: { [key: string]: string | unknown } | null;
}

const initialState: AuthSliceType = {
  isAuthLoaded: false,
  isLoggedIn: false,
  isAnonymous: false,
  uid: null,
  authClaims: null,
};

// Async login action (for use with createAsyncThunk)
export const syncAuth = createAsyncThunk(
  "auth/sync",
  async (payload: { user: FirebaseAuthTypes.User }, { dispatch }): Promise<Partial<AuthSliceType>> => {
    dispatch(startLoading("auth/sync"));

    const { user } = payload;
    const authData = {} as Partial<AuthSliceType>;

    try {
      authData.isAnonymous = user.isAnonymous;
      authData.uid = user.uid;
      authData.authClaims = (await user.getIdTokenResult()).claims;
    } catch (error) {
      throw error as Error;
    } finally {
      dispatch(stopLoading("auth/sync"));
    }

    return authData;
  });


const authSlice = createSlice({
  initialState,
  name: "auth",
  reducers: {
    // Logout reducer
    logout(state) {
      state.isLoggedIn = false;
      state.isAnonymous = false;
      state.uid = null;
      state.authClaims = null;
      state.isAuthLoaded = true;

      void crashlytics().setUserId("");
    },
    enterDemoMode(state) {
      state.isAuthLoaded = true;
      state.isLoggedIn = true;
      state.uid = "demo";

      void crashlytics().setUserId("demo");
    }
  },
  extraReducers: (builder) => {
    // Login reducer
    builder.addCase(syncAuth.pending, (state) => {
      state.isAuthLoaded = false;
    });
    builder.addCase(syncAuth.fulfilled, (state, action: PayloadAction<Partial<AuthSliceType>>) => {
      state.isLoggedIn = true;
      state.isAnonymous = action.payload.isAnonymous ?? initialState.isAnonymous;
      state.uid = action.payload.uid ?? initialState.uid;
      state.authClaims = action.payload.authClaims ?? initialState.authClaims;
      state.isAuthLoaded = true;

      void crashlytics().setUserId(state.uid ?? "");
    });
    builder.addCase(syncAuth.rejected, (state) => {
      Object.assign(state, initialState);

      void crashlytics().setUserId("");
    });
  },
});

export const {
  logout, enterDemoMode
} = authSlice.actions;

export default authSlice.reducer;
