import { configureStore } from "@reduxjs/toolkit";

import appConfigReducer from "./appConfigSlice";
import authReducer from "./authSlice";
import deviceDataReducer from "./deviceDataSlice";
import globalLoadingReducer from "./globalLoadingSlice";
import marathonReducer from "./marathonSlice";
import notificationReducer from "./notificationSlice";
import userDataReducer from "./userDataSlice";

const store = configureStore({
  reducer: {
    appConfig: appConfigReducer,
    auth: authReducer,
    deviceData: deviceDataReducer,
    globalLoading: globalLoadingReducer,
    marathon: marathonReducer,
    notification: notificationReducer,
    userData: userDataReducer,
  },
});
export default store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
