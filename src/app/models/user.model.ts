export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  departementId?: number;
  departementName?: string;
  isActive: boolean;
  lastLogin?: Date;
}

export enum UserRole {
  Doctor = 1,
  Archivist = 2,
  Admin = 3
}