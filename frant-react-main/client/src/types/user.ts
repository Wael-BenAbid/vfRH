// types/user.ts
export interface User {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    user_type: 'admin' | 'employee' | 'intern';
    is_active: boolean;
    created_at: string;
    leave_balance?: number;
  }
  
  export interface UserRequest {
    username: string;
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    user_type: 'employee' | 'intern';
  }
  
  export interface UserResponse {
    user: User;
    message: string;
  }
  
  export interface UserState {
    currentUser: User | null;
    users: User[];
    loading: boolean;
    error: string | null;
  }