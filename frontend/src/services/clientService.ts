import api from '../api/axiosClient';
import type { Client } from '../types';

export const clientService = {
  getAll: async (): Promise<Client[]> => {
    const res = await api.get<Client[]>('/clients');
    return res.data;
  },

  getById: async (id: number): Promise<Client> => {
    const res = await api.get<Client>(`/clients/${id}`);
    return res.data;
  },

  create: async (client: Client): Promise<Client> => {
    const res = await api.post<Client>('/clients', client);
    return res.data;
  },

  update: async (id: number, client: Client): Promise<Client> => {
    const res = await api.put<Client>(`/clients/${id}`, client);
    return res.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/clients/${id}`);
  },
};
