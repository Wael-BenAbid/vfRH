import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { WorkHours, CreateWorkHoursRequest } from '../types';
import * as api from '../lib/api';

interface WorkHoursState {
  workHours: WorkHours[];
  loading: boolean;
  error: string | null;
}

const initialState: WorkHoursState = {
  workHours: [],
  loading: false,
  error: null,
};

export const fetchWorkHours = createAsyncThunk(
  'workHours/fetchWorkHours',
  async (_, { rejectWithValue }) => {
    try {
      const workHours = await api.getWorkHours();
      return workHours;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

export const createWorkHours = createAsyncThunk(
  'workHours/createWorkHours',
  async (workHoursData: CreateWorkHoursRequest, { rejectWithValue }) => {
    try {
      const workHours = await api.createWorkHours(workHoursData);
      return workHours;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

const workHoursSlice = createSlice({
  name: 'workHours',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all work hours
      .addCase(fetchWorkHours.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkHours.fulfilled, (state, action: PayloadAction<WorkHours[]>) => {
        state.loading = false;
        state.workHours = action.payload;
      })
      .addCase(fetchWorkHours.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Create work hours
      .addCase(createWorkHours.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createWorkHours.fulfilled, (state, action: PayloadAction<WorkHours>) => {
        state.loading = false;
        state.workHours.push(action.payload);
      })
      .addCase(createWorkHours.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = workHoursSlice.actions;

export default workHoursSlice.reducer;
