import { configureStore } from '@reduxjs/toolkit';
import blogsReducer from './slices/blogsSlice';
import jobsReducer from './slices/jobsSlice';
import companiesReducer from './slices/companiesSlice';
import jobseekerProfileReducer from './slices/jobseeker/profileSlice';

export const store = configureStore({
  reducer: {
    blogs: blogsReducer,
    jobs: jobsReducer,
    companies: companiesReducer,
    jobseekerProfile: jobseekerProfileReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
