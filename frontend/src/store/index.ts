// src/app/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import authReducer from './authSlice';
import { friendRequestsApi } from './friendRequestsApi';
import { postApi } from './postsApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [friendRequestsApi.reducerPath]: friendRequestsApi.reducer,
    [postApi.reducerPath]: postApi.reducer,

  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      friendRequestsApi.middleware,
      postApi.middleware
    ),
  devTools: process.env.NODE_ENV !== 'production',
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
