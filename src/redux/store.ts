import { configureStore } from '@reduxjs/toolkit';

import authReducer from './authSlice';
import notificationReducer from './notificationSlice';
import appConfigReducer from './appConfigSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    notification: notificationReducer,
    appConfig: appConfigReducer,
  },
});
export default store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
