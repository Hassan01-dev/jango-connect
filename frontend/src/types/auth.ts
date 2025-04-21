export interface User {
    _id?: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    profileImage?: string;
    bio?: string;
    friends?: string[];
    created_at?: string;
    updated_at?: string;
  }
  
  export interface AuthState {
    token: string | null;
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
  }
  
  export interface LoginCredentials {
    identifier: string;
    password: string;
  }
  
  export interface SignupCredentials {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }
  
  export interface AuthResponse {
    token: string;
    user: User;
  }