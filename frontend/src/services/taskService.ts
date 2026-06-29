import api from '../api/axiosClient';
import type { Task, TaskStatus } from '../types';

export const taskService = {
  getByProject: async (projectId: number): Promise<Task[]> => {
    const res = await api.get<Task[]>(`/tasks/project/${projectId}`);
    return res.data;
  },

  create: async (projectId: number, task: Task): Promise<Task> => {
    const res = await api.post<Task>(`/tasks/project/${projectId}`, task);
    return res.data;
  },

  update: async (id: number, task: Task): Promise<Task> => {
    const res = await api.put<Task>(`/tasks/${id}`, task);
    return res.data;
  },

  updateStatus: async (id: number, status: TaskStatus): Promise<Task> => {
    const res = await api.patch<Task>(`/tasks/${id}/status?status=${status}`);
    return res.data;
  },

  assignUser: async (taskId: number, userId: number): Promise<Task> => {
    const res = await api.patch<Task>(`/tasks/${taskId}/assign/${userId}`);
    return res.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },
};
