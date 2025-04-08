import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Leave, CreateLeaveRequest, UpdateLeaveRequest } from '../types';
import * as api from '../lib/api';

interface LeaveState {
  leaves: Leave[];
  selectedLeave: Leave | null;
  loading: boolean;
  error: string | null;
}

const initialState: LeaveState = {
  leaves: [],
  selectedLeave: null,
  loading: false,
  error: null,
};

export const fetchLeaves = createAsyncThunk(
  'leave/fetchLeaves',
  async (_, { rejectWithValue }) => {
    try {
      const leaves = await api.getLeaves();
      return leaves;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

export const fetchLeaveById = createAsyncThunk(
  'leave/fetchLeaveById',
  async (id: number, { rejectWithValue }) => {
    try {
      const leave = await api.getLeaveById(id);
      return leave;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

export const createLeave = createAsyncThunk(
  'leave/createLeave',
  async (leaveData: CreateLeaveRequest, { rejectWithValue }) => {
    try {
      const leave = await api.createLeave(leaveData);
      return leave;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

export const updateLeave = createAsyncThunk(
  'leave/updateLeave',
  async ({ id, leaveData }: { id: number; leaveData: UpdateLeaveRequest }, { rejectWithValue }) => {
    try {
      const leave = await api.updateLeave(id, leaveData);
      return leave;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

export const approveLeave = createAsyncThunk(
  'leave/approveLeave',
  async (id: number, { rejectWithValue }) => {
    try {
      const leave = await api.approveLeave(id);
      return leave;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

export const rejectLeave = createAsyncThunk(
  'leave/rejectLeave',
  async (id: number, { rejectWithValue }) => {
    try {
      const leave = await api.rejectLeave(id);
      return leave;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

const leaveSlice = createSlice({
  name: 'leave',
  initialState,
  reducers: {
    clearSelectedLeave: (state) => {
      state.selectedLeave = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all leaves
      .addCase(fetchLeaves.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeaves.fulfilled, (state, action: PayloadAction<Leave[]>) => {
        state.loading = false;
        state.leaves = action.payload;
      })
      .addCase(fetchLeaves.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch single leave
      .addCase(fetchLeaveById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeaveById.fulfilled, (state, action: PayloadAction<Leave>) => {
        state.loading = false;
        state.selectedLeave = action.payload;
      })
      .addCase(fetchLeaveById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Create leave
      .addCase(createLeave.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createLeave.fulfilled, (state, action: PayloadAction<Leave>) => {
        state.loading = false;
        state.leaves.push(action.payload);
      })
      .addCase(createLeave.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update leave
      .addCase(updateLeave.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateLeave.fulfilled, (state, action: PayloadAction<Leave>) => {
        state.loading = false;
        const index = state.leaves.findIndex(leave => leave.id === action.payload.id);
        if (index !== -1) {
          state.leaves[index] = action.payload;
        }
        if (state.selectedLeave?.id === action.payload.id) {
          state.selectedLeave = action.payload;
        }
      })
      .addCase(updateLeave.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Approve leave
      .addCase(approveLeave.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(approveLeave.fulfilled, (state, action: PayloadAction<Leave>) => {
        state.loading = false;
        const index = state.leaves.findIndex(leave => leave.id === action.payload.id);
        if (index !== -1) {
          state.leaves[index] = action.payload;
        }
        if (state.selectedLeave?.id === action.payload.id) {
          state.selectedLeave = action.payload;
        }
      })
      .addCase(approveLeave.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Reject leave
      .addCase(rejectLeave.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rejectLeave.fulfilled, (state, action: PayloadAction<Leave>) => {
        state.loading = false;
        const index = state.leaves.findIndex(leave => leave.id === action.payload.id);
        if (index !== -1) {
          state.leaves[index] = action.payload;
        }
        if (state.selectedLeave?.id === action.payload.id) {
          state.selectedLeave = action.payload;
        }
      })
      .addCase(rejectLeave.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSelectedLeave, clearError } = leaveSlice.actions;

export default leaveSlice.reducer;
