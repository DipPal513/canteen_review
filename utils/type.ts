export interface User {
  email: string;
  password: string;
}

export interface AuthRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
}

export interface UserResponse {
  email: string;
}
