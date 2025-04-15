// store/userSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { User, UserRequest } from '../types/user';
import * as userService from '../services/userService';

interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
};

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async () => {
    const response = await userService.getUsers();
    return response;
  }
);

export const requestAccess = createAsyncThunk(
  'users/requestAccess',
  async (userData: UserRequest) => {
    const response = await userService.requestAccess(userData);
    return response;
  }
);

export const approveUser = createAsyncThunk(
  'users/approveUser',
  async (userId: number) => {
    await userService.approveUser(userId);
    return userId;
  }
);

export const rejectUser = createAsyncThunk(
  'users/rejectUser',
  async (userId: number) => {
    await userService.rejectUser(userId);
    return userId;
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch users';
      })
      // Approve User
      .addCase(approveUser.fulfilled, (state, action) => {
        state.users = state.users.map(user =>
          user.id === action.payload
            ? { ...user, is_active: true }
            : user
        );
      })
      // Reject User
      .addCase(rejectUser.fulfilled, (state, action) => {
        state.users = state.users.filter(user => user.id !== action.payload);
      });
  },
});

export default userSlice.reducer;