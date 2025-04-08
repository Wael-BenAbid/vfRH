import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import leaveReducer from './leaveSlice';
import employeeReducer from './employeeSlice';
import missionReducer from './missionSlice';
import workHoursReducer from './workHoursSlice';
import internshipReducer from './internshipSlice';
import jobApplicationReducer from './jobApplicationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    leave: leaveReducer,
    employee: employeeReducer,
    mission: missionReducer,
    workHours: workHoursReducer,
    internship: internshipReducer,
    jobApplication: jobApplicationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
