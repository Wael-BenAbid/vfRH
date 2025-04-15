// services/userService.ts
import axios from 'axios';
import { User, UserRequest } from '../types/user';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

export const getUsers = async (): Promise<User[]> => {
  const response = await axios.get(`${API_URL}/users/`);
  return response.data;
};

export const requestAccess = async (userData: UserRequest): Promise<User> => {
  const response = await axios.post(`${API_URL}/users/request_access/`, userData);
  return response.data;
};

export const approveUser = async (userId: number): Promise<void> => {
  await axios.post(`${API_URL}/users/${userId}/approve_user/`);
};

export const rejectUser = async (userId: number): Promise<void> => {
  await axios.post(`${API_URL}/users/${userId}/reject_user/`);
};

// Authentication check
export const checkUserApprovalStatus = async (userId: number): Promise<boolean> => {
  try {
    const response = await axios.get(`${API_URL}/users/${userId}/`);
    return response.data.is_active;
  } catch (error) {
    return false;
  }
};

// Get current user profile
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const response = await axios.get(`${API_URL}/users/me/`);
    return response.data;
  } catch (error) {
    return null;
  }
};