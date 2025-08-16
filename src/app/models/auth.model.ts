import { UserRole, User } from "./user.model";

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  departementId?: number;
}


export interface AuthResponse {
  token: string;
  user: User;
  refreshToken?: string;
  expiresIn?: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
//export { User };
export type { User };

export { UserRole };
  
  
  
  
// Add these interfaces to your existing auth.model.ts file

export interface UserDto {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  departementId?: number;
  departement?: {
    id: number;
    libelleFr: string;
    libelleAr: string;
    abreviationFr: string;
    abreviationAr: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateUserRequest {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  departementId?: number;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateRoleRequest {
  role: UserRole;
  departementId?: number;
}

// Existing interfaces that should already be in your model...
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  departementId?: number;
}
/*
export interface AuthResponse {
  user: UserDto;
  token: string;
  refreshToken?: string;
  expiresIn?: number;
}
*/


// Additional utility interfaces
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface UserFilters {
  searchTerm?: string;
  role?: UserRole;
  departmentId?: number;
  isActive?: boolean;
}

export interface UserStats {
  totalUsers: number;
  doctorCount: number;
  archivistCount: number;
  adminCount: number;
  activeUsers: number;
  inactiveUsers: number;
}

