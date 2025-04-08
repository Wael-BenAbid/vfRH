import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Mission, CreateMissionRequest, UpdateMissionRequest } from '../types';
import * as api from '../lib/api';

interface MissionState {
  missions: Mission[];
  selectedMission: Mission | null;
  loading: boolean;
  error: string | null;
}

const initialState: MissionState = {
  missions: [],
  selectedMission: null,
  loading: false,
  error: null,
};

export const fetchMissions = createAsyncThunk(
  'mission/fetchMissions',
  async (_, { rejectWithValue }) => {
    try {
      const missions = await api.getMissions();
      return missions;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

export const fetchMissionById = createAsyncThunk(
  'mission/fetchMissionById',
  async (id: number, { rejectWithValue }) => {
    try {
      const mission = await api.getMissionById(id);
      return mission;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

export const createMission = createAsyncThunk(
  'mission/createMission',
  async (missionData: CreateMissionRequest, { rejectWithValue }) => {
    try {
      const mission = await api.createMission(missionData);
      return mission;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

export const updateMission = createAsyncThunk(
  'mission/updateMission',
  async ({ id, missionData }: { id: number; missionData: UpdateMissionRequest }, { rejectWithValue }) => {
    try {
      const mission = await api.updateMission(id, missionData);
      return mission;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

export const completeMission = createAsyncThunk(
  'mission/completeMission',
  async (id: number, { rejectWithValue }) => {
    try {
      const mission = await api.completeMission(id);
      return mission;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

const missionSlice = createSlice({
  name: 'mission',
  initialState,
  reducers: {
    clearSelectedMission: (state) => {
      state.selectedMission = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all missions
      .addCase(fetchMissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMissions.fulfilled, (state, action: PayloadAction<Mission[]>) => {
        state.loading = false;
        state.missions = action.payload;
      })
      .addCase(fetchMissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch mission by ID
      .addCase(fetchMissionById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMissionById.fulfilled, (state, action: PayloadAction<Mission>) => {
        state.loading = false;
        state.selectedMission = action.payload;
      })
      .addCase(fetchMissionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Create mission
      .addCase(createMission.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMission.fulfilled, (state, action: PayloadAction<Mission>) => {
        state.loading = false;
        state.missions.push(action.payload);
      })
      .addCase(createMission.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update mission
      .addCase(updateMission.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMission.fulfilled, (state, action: PayloadAction<Mission>) => {
        state.loading = false;
        const index = state.missions.findIndex(mission => mission.id === action.payload.id);
        if (index !== -1) {
          state.missions[index] = action.payload;
        }
        if (state.selectedMission?.id === action.payload.id) {
          state.selectedMission = action.payload;
        }
      })
      .addCase(updateMission.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Complete mission
      .addCase(completeMission.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(completeMission.fulfilled, (state, action: PayloadAction<Mission>) => {
        state.loading = false;
        const index = state.missions.findIndex(mission => mission.id === action.payload.id);
        if (index !== -1) {
          state.missions[index] = action.payload;
        }
        if (state.selectedMission?.id === action.payload.id) {
          state.selectedMission = action.payload;
        }
      })
      .addCase(completeMission.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSelectedMission, clearError } = missionSlice.actions;

export default missionSlice.reducer;
