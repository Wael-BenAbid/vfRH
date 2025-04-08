import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Internship, CreateInternshipRequest, UpdateInternshipRequest } from '../types';
import * as api from '../lib/api';

interface InternshipState {
  internships: Internship[];
  selectedInternship: Internship | null;
  loading: boolean;
  error: string | null;
}

const initialState: InternshipState = {
  internships: [],
  selectedInternship: null,
  loading: false,
  error: null,
};

export const fetchInternships = createAsyncThunk(
  'internship/fetchInternships',
  async (_, { rejectWithValue }) => {
    try {
      const internships = await api.getInternships();
      return internships;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

export const fetchInternshipById = createAsyncThunk(
  'internship/fetchInternshipById',
  async (id: number, { rejectWithValue }) => {
    try {
      const internship = await api.getInternshipById(id);
      return internship;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

export const createInternship = createAsyncThunk(
  'internship/createInternship',
  async (internshipData: CreateInternshipRequest, { rejectWithValue }) => {
    try {
      const internship = await api.createInternship(internshipData);
      return internship;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

export const updateInternship = createAsyncThunk(
  'internship/updateInternship',
  async ({ id, internshipData }: { id: number; internshipData: UpdateInternshipRequest }, { rejectWithValue }) => {
    try {
      const internship = await api.updateInternship(id, internshipData);
      return internship;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

export const changeInternshipStatus = createAsyncThunk(
  'internship/changeStatus',
  async ({ id, status }: { id: number; status: string }, { rejectWithValue }) => {
    try {
      const internship = await api.changeInternshipStatus(id, status);
      return internship;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

const internshipSlice = createSlice({
  name: 'internship',
  initialState,
  reducers: {
    clearSelectedInternship: (state) => {
      state.selectedInternship = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all internships
      .addCase(fetchInternships.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInternships.fulfilled, (state, action: PayloadAction<Internship[]>) => {
        state.loading = false;
        state.internships = action.payload;
      })
      .addCase(fetchInternships.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch internship by ID
      .addCase(fetchInternshipById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInternshipById.fulfilled, (state, action: PayloadAction<Internship>) => {
        state.loading = false;
        state.selectedInternship = action.payload;
      })
      .addCase(fetchInternshipById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Create internship
      .addCase(createInternship.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createInternship.fulfilled, (state, action: PayloadAction<Internship>) => {
        state.loading = false;
        state.internships.push(action.payload);
      })
      .addCase(createInternship.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update internship
      .addCase(updateInternship.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateInternship.fulfilled, (state, action: PayloadAction<Internship>) => {
        state.loading = false;
        const index = state.internships.findIndex(internship => internship.id === action.payload.id);
        if (index !== -1) {
          state.internships[index] = action.payload;
        }
        if (state.selectedInternship?.id === action.payload.id) {
          state.selectedInternship = action.payload;
        }
      })
      .addCase(updateInternship.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Change internship status
      .addCase(changeInternshipStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changeInternshipStatus.fulfilled, (state, action: PayloadAction<Internship>) => {
        state.loading = false;
        const index = state.internships.findIndex(internship => internship.id === action.payload.id);
        if (index !== -1) {
          state.internships[index] = action.payload;
        }
        if (state.selectedInternship?.id === action.payload.id) {
          state.selectedInternship = action.payload;
        }
      })
      .addCase(changeInternshipStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSelectedInternship, clearError } = internshipSlice.actions;

export default internshipSlice.reducer;
