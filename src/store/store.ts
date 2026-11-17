import { configureStore } from '@reduxjs/toolkit';
import draftReducer from './slices/draftSlice.ts';
import feedReducer from './slices/feedSlice.ts';
import solutionsReducer from './slices/solutionsSlice.ts';
import userReducer from './slices/userSlice.ts';

export const store = configureStore({
  reducer: {
    solutions: solutionsReducer,
    feed: feedReducer,
    draft: draftReducer,
    user: userReducer,
  },
});

export type AppStore = typeof store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
