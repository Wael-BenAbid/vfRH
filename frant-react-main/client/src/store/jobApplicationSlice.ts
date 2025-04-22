import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { JobApplication, CreateJobApplicationRequest, UpdateJobApplicationRequest } from '../types';
import * as api from '../lib/api';
import { useEffect } from 'react';

interface JobApplicationState {
  jobApplications: JobApplication[];
  selectedJobApplication: JobApplication | null;
  loading: boolean;
  error: string | null;
}

const initialState: JobApplicationState = {
  jobApplications: [],
  selectedJobApplication: null,
  loading: false,
  error: null,
};

export const fetchJobApplications = createAsyncThunk(
  'jobApplication/fetchJobApplications',
  async (_, { rejectWithValue }) => {
    try {
      const jobApplications = await api.getJobApplications();
      console.log('Fetched job applications:', jobApplications); // Vérifiez les données ici
      return jobApplications;
    } catch (error) {
      console.error('Error in fetchJobApplications:', error); // Log en cas d'erreur
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

export const fetchJobApplicationById = createAsyncThunk(
  'jobApplication/fetchJobApplicationById',
  async (id: number, { rejectWithValue }) => {
    try {
      const jobApplication = await api.getJobApplicationById(id);
      return jobApplication;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

export const createJobApplication = createAsyncThunk(
  'jobApplication/createJobApplication',
  async (applicationData: CreateJobApplicationRequest, { rejectWithValue }) => {
    try {
      const jobApplication = await api.createJobApplication(applicationData);
      return jobApplication;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

export const updateJobApplication = createAsyncThunk(
  'jobApplication/updateJobApplication',
  async ({ id, applicationData }: { id: number; applicationData: UpdateJobApplicationRequest }, { rejectWithValue }) => {
    try {
      const jobApplication = await api.updateJobApplication(id, applicationData);
      return jobApplication;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

export const approveJobApplication = createAsyncThunk<JobApplication, number>(
  'jobApplication/approveJobApplication',
  async (id: number, { rejectWithValue }) => {
    try {
      const jobApplication: JobApplication = await api.approveJobApplication(id);
      return jobApplication;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message) as unknown as Promise<JobApplication>;
      }
      return rejectWithValue('An unknown error occurred') as unknown as Promise<JobApplication>;
    }
  }
);

export const rejectJobApplication = createAsyncThunk<JobApplication, number>(
  'jobApplication/rejectJobApplication',
  async (id: number, { rejectWithValue }) => {
    try {
      const jobApplication: JobApplication = await api.rejectJobApplication(id);
      return jobApplication;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message) as unknown as Promise<JobApplication>;
      }
      return rejectWithValue('An unknown error occurred') as unknown as Promise<JobApplication>;
    }
  }
);

const jobApplicationSlice = createSlice({
  name: 'jobApplication',
  initialState,
  reducers: {
    clearSelectedJobApplication: (state) => {
      state.selectedJobApplication = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all job applications
      .addCase(fetchJobApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobApplications.fulfilled, (state, action: PayloadAction<JobApplication[]>) => {
        state.loading = false;
        state.jobApplications = action.payload; // Stockez les données ici
        console.log('Redux state updated with job applications:', action.payload); // Vérifiez ici
      })
      .addCase(fetchJobApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        console.error('Error in fetchJobApplications:', action.payload); // Log en cas d'erreur
      })
      
      // Fetch job application by ID
      .addCase(fetchJobApplicationById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobApplicationById.fulfilled, (state, action: PayloadAction<JobApplication>) => {
        state.loading = false;
        state.selectedJobApplication = action.payload;
      })
      .addCase(fetchJobApplicationById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Create job application
      .addCase(createJobApplication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createJobApplication.fulfilled, (state, action: PayloadAction<JobApplication>) => {
        state.loading = false;
        state.jobApplications.push(action.payload);
      })
      .addCase(createJobApplication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update job application
      .addCase(updateJobApplication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateJobApplication.fulfilled, (state, action: PayloadAction<JobApplication>) => {
        state.loading = false;
        const index = state.jobApplications.findIndex(app => app.id === action.payload.id);
        if (index !== -1) {
          state.jobApplications[index] = action.payload;
        }
        if (state.selectedJobApplication?.id === action.payload.id) {
          state.selectedJobApplication = action.payload;
        }
      })
      .addCase(updateJobApplication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Approve job application
      .addCase(approveJobApplication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(approveJobApplication.fulfilled, (state, action: PayloadAction<JobApplication>) => {
        state.loading = false;
        const index = state.jobApplications.findIndex(app => app.id === action.payload.id);
        if (index !== -1) {
          state.jobApplications[index] = action.payload;
        }
        if (state.selectedJobApplication?.id === action.payload.id) {
          state.selectedJobApplication = action.payload;
        }
      })
      .addCase(approveJobApplication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Reject job application
      .addCase(rejectJobApplication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rejectJobApplication.fulfilled, (state, action: PayloadAction<JobApplication>) => {
        state.loading = false;
        const index = state.jobApplications.findIndex(app => app.id === action.payload.id);
        if (index !== -1) {
          state.jobApplications[index] = action.payload;
        }
        if (state.selectedJobApplication?.id === action.payload.id) {
          state.selectedJobApplication = action.payload;
        }
      })
      .addCase(rejectJobApplication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSelectedJobApplication, clearError } = jobApplicationSlice.actions;

export default jobApplicationSlice.reducer;