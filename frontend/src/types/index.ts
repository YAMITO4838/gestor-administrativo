// ─── Auth ──────────────────────────────────────────────
export interface AuthRequest {
  username?: string;
  email?: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  fullName?: string;
  email: string;
  password: string;
  role?: 'ADMIN' | 'PROJECT_LEADER' | 'MEMBER';
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  username: string;
  email: string;
  role: string;
}

// ─── User ──────────────────────────────────────────────
export interface Role {
  id: number;
  name: string;
}

export interface User {
  id: number;
  username: string;
  fullName: string;
  email: string;
  role: Role;
  isActive: boolean;
}

// ─── Client ────────────────────────────────────────────
export interface Client {
  id?: number;
  ruc?: string;
  razonSocial: string;
  contactoPrincipal?: string;
  correoContacto?: string;
  telefono?: string;
}

// ─── Task ──────────────────────────────────────────────
export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface Task {
  id?: number;
  title: string;
  description?: string;
  assignedTo?: string;
  assignee?: User;
  status?: TaskStatus;
  priority?: string;
  startDate?: string;
  dueDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

// ─── Project ───────────────────────────────────────────
export interface Project {
  id?: number;
  name: string;
  description?: string;
  leaderName?: string;
  clientName?: string;
  client?: Client;
  startDate?: string;
  endDate?: string;
  status?: string;
  priority?: string;
  budget?: number;
  tasks?: Task[];
  members?: User[];
  createdAt?: string;
  updatedAt?: string;
}
