import React, { useEffect, useState, useCallback } from 'react';
import Layout from '../../components/layout/Layout';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Spinner from '../../components/common/Spinner';
import ClientForm from './ClientForm';
import { clientService } from '../../services/clientService';
import type { Client } from '../../types';

const ClientsPage: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | undefined>();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchClients = useCallback(async () => {
    setLoading(true);
    try {
      const data = await clientService.getAll();
      setClients(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchClients(); }, [fetchClients]);

  const filtered = clients.filter(
    (c) =>
      c.razonSocial.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.contactoPrincipal || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.correoContacto || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openCreate = () => { setEditingClient(undefined); setFormError(null); setIsFormOpen(true); };
  const openEdit = (client: Client) => { setEditingClient(client); setFormError(null); setIsFormOpen(true); };
  const openDelete = (id: number) => { setDeletingId(id); setIsDeleteOpen(true); };

  const handleSubmit = async (data: Client) => {
    setFormError(null);
    try {
      if (editingClient?.id) {
        await clientService.update(editingClient.id, data);
      } else {
        await clientService.create(data);
      }
      setIsFormOpen(false);
      fetchClients();
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      setFormError(axiosError.response?.data?.message || 'Error al guardar el cliente');
      throw err;
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    setDeleteLoading(true);
    try {
      await clientService.delete(deletingId);
      setIsDeleteOpen(false);
      fetchClients();
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <Layout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Clientes</h1>
          <p className="text-slate-400 text-sm mt-1">{clients.length} clientes registrados</p>
        </div>
        <button
          onClick={openCreate}
          id="btn-new-client"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-all shadow-lg hover:shadow-indigo-500/25"
        >
          + Nuevo Cliente
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por nombre, contacto o email..."
          className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-3 pl-10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
        />
      </div>

      {/* Grid de cards */}
      {loading ? (
        <div className="flex justify-center items-center h-48"><Spinner size="lg" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">👥</p>
          <p className="text-slate-400">{searchTerm ? 'Sin resultados' : 'No hay clientes aún'}</p>
          {!searchTerm && (
            <button onClick={openCreate} className="mt-4 text-indigo-400 hover:text-indigo-300 text-sm font-medium">
              + Crear el primero
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((client) => (
            <div
              key={client.id}
              className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-5 hover:border-slate-600 transition-all hover:shadow-lg hover:shadow-slate-900/50 group"
            >
              {/* Card header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-md">
                    <span className="text-white font-bold text-sm uppercase">
                      {client.razonSocial.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-sm leading-tight">{client.razonSocial}</h3>
                    {client.ruc && (
                      <p className="text-slate-500 text-xs mt-0.5">RUC: {client.ruc}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact info */}
              <div className="space-y-2 text-sm mb-4">
                {client.contactoPrincipal && (
                  <div className="flex items-center gap-2 text-slate-400">
                    <span>👤</span>
                    <span className="truncate">{client.contactoPrincipal}</span>
                  </div>
                )}
                {client.correoContacto && (
                  <div className="flex items-center gap-2 text-slate-400">
                    <span>✉️</span>
                    <span className="truncate">{client.correoContacto}</span>
                  </div>
                )}
                {client.telefono && (
                  <div className="flex items-center gap-2 text-slate-400">
                    <span>📞</span>
                    <span>{client.telefono}</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-3 border-t border-slate-700/50">
                <button
                  onClick={() => openEdit(client)}
                  className="flex-1 py-2 rounded-lg text-xs font-medium text-slate-300 border border-slate-600 hover:border-amber-500 hover:text-amber-400 transition-all"
                >
                  ✏️ Editar
                </button>
                <button
                  onClick={() => openDelete(client.id!)}
                  className="flex-1 py-2 rounded-lg text-xs font-medium text-slate-300 border border-slate-600 hover:border-red-500 hover:text-red-400 transition-all"
                >
                  🗑️ Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingClient ? 'Editar Cliente' : 'Nuevo Cliente'}
      >
        {formError && (
          <div className="mb-4 flex items-start gap-3 bg-red-900/40 border border-red-700/50 rounded-xl p-3">
            <span className="text-red-400">⚠️</span>
            <p className="text-red-300 text-sm">{formError}</p>
          </div>
        )}
        <ClientForm
          initialData={editingClient}
          onSubmit={handleSubmit}
          onCancel={() => setIsFormOpen(false)}
        />
      </Modal>

      {/* Delete confirmation */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        message="¿Estás seguro de eliminar este cliente? Esta acción no se puede deshacer."
        loading={deleteLoading}
      />
    </Layout>
  );
};

export default ClientsPage;
