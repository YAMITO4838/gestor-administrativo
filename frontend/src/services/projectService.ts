import api from '../api/axiosClient';
import type { Project, Task } from '../types';

export const projectService = {
  getAll: async (): Promise<Project[]> => {
    const res = await api.get<Project[]>('/projects');
    return res.data;
  },

  getById: async (id: number): Promise<Project> => {
    const res = await api.get<Project>(`/projects/${id}`);
    return res.data;
  },

  create: async (project: Project): Promise<Project> => {
    const res = await api.post<Project>('/projects', project);
    return res.data;
  },

  update: async (id: number, project: Project): Promise<Project> => {
    const res = await api.put<Project>(`/projects/${id}`, project);
    return res.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/projects/${id}`);
  },

  getTasks: async (projectId: number): Promise<Task[]> => {
    const res = await api.get<Task[]>(`/projects/${projectId}/tasks`);
    return res.data;
  },

  createTask: async (projectId: number, task: Task): Promise<Task> => {
    const res = await api.post<Task>(`/projects/${projectId}/tasks`, task);
    return res.data;
  },

  updateTask: async (taskId: number, task: Task): Promise<Task> => {
    const res = await api.put<Task>(`/projects/tasks/${taskId}`, task);
    return res.data;
  },

  deleteTask: async (taskId: number): Promise<void> => {
    await api.delete(`/projects/tasks/${taskId}`);
  },
};
