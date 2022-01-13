import { configureStore } from '@reduxjs/toolkit';

import authReducer from './authSlice';
import notificationReducer from './notificationSlice';
import appConfigReducer from './appConfigSlice';

export default configureStore({
  reducer: {
    auth: authReducer,
    notification: notificationReducer,
    appConfig: appConfigReducer,
  },
});
