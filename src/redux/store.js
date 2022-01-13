import { configureStore } from '@reduxjs/toolkit';

import authReducer from './authSlice';
import notificationReducer from './notificationSlice';

export default configureStore({
  reducer: {
    auth: authReducer,
    notification: notificationReducer,
  },
});
