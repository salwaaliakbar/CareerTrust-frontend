import { combineReducers, configureStore, createAction } from '@reduxjs/toolkit';
import blogsReducer from './slices/blogsSlice';
import jobsReducer from './slices/jobsSlice';
import companiesReducer from './slices/companiesSlice';
import jobseekerProfileReducer from './slices/jobseeker/profileSlice';
import applicationsReducer from './slices/jobseeker/applicationsSlice';
import dashboardReducer from './slices/dashboardSlice';

export const resetAppState = createAction('app/resetState');
export const resetAuthState = createAction('auth/resetState');

const appReducer = combineReducers({
  blogs: blogsReducer,
  jobs: jobsReducer,
  companies: companiesReducer,
  jobseekerProfile: jobseekerProfileReducer,
  applications: applicationsReducer,
  dashboard: dashboardReducer,
});

const rootReducer = (
  state: ReturnType<typeof appReducer> | undefined,
  action:
    | ReturnType<typeof resetAppState>
    | ReturnType<typeof resetAuthState>
    | Parameters<typeof appReducer>[1],
) => {
  if (resetAppState.match(action)) {
    return appReducer(undefined, action);
  }

  if (resetAuthState.match(action)) {
    const initialState = appReducer(undefined, action);

    if (!state) {
      return initialState;
    }

    return {
      ...state,
      jobseekerProfile: initialState.jobseekerProfile,
      applications: initialState.applications,
      dashboard: initialState.dashboard,
    };
  }

  return appReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
