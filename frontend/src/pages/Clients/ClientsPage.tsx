import React, { useEffect, useState } from 'react';
import { AlertTriangle, Mail, Pencil, Phone, Plus, Search, Trash2, UserRound, UsersRound } from 'lucide-react';
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

  const fetchClients = async () => {
    setLoading(true);
    try {
      const data = await clientService.getAll();
      setClients(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    const loadInitialClients = async () => {
      setLoading(true);
      try {
        const data = await clientService.getAll();
        if (active) setClients(data);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadInitialClients();

    return () => {
      active = false;
    };
  }, []);

  const filtered = clients.filter(
    (c) =>
      c.razonSocial.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.contactoPrincipal || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.correoContacto || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openCreate = () => {
    setEditingClient(undefined);
    setFormError(null);
    setIsFormOpen(true);
  };

  const openEdit = (client: Client) => {
    setEditingClient(client);
    setFormError(null);
    setIsFormOpen(true);
  };

  const openDelete = (id: number) => {
    setDeletingId(id);
    setIsDeleteOpen(true);
  };

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
      <div className="premium-animate mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.24em] text-[#8a764e]">CRM</p>
          <h1 className="text-4xl font-extrabold tracking-tight text-ink">Clientes</h1>
          <p className="mt-2 text-sm font-medium text-graphite">{clients.length} clientes registrados</p>
        </div>
        <button onClick={openCreate} id="btn-new-client" className="premium-button-primary">
          <Plus size={18} aria-hidden="true" />
          <span>Nuevo Cliente</span>
        </button>
      </div>

      <div className="premium-animate premium-delay-1 relative mb-6">
        <Search
          size={20}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-graphite"
          aria-hidden="true"
        />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por nombre, contacto o email..."
          className="premium-field pl-11"
        />
      </div>

      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="premium-card premium-animate py-16 text-center">
          <UsersRound size={42} className="mx-auto mb-4 text-[#8a764e]" aria-hidden="true" />
          <p className="text-sm font-medium text-graphite">
            {searchTerm ? 'Sin resultados' : 'No hay clientes aun'}
          </p>
          {!searchTerm && (
            <button onClick={openCreate} className="mt-4 font-bold text-[#17486a] hover:text-[#6f5526]">
              Crear el primero
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((client, index) => (
            <div
              key={client.id}
              className="premium-card-interactive premium-animate p-5"
              style={{ animationDelay: `${index * 55}ms` }}
            >
              <div className="mb-5 flex items-start gap-3">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg border border-[#b5965b]/40 bg-[#fbf7ed] text-[#8a764e] shadow-sm">
                  <span className="text-sm font-extrabold uppercase">{client.razonSocial.charAt(0)}</span>
                </div>
                <div className="min-w-0">
                  <h3 className="truncate text-base font-extrabold text-ink">{client.razonSocial}</h3>
                  {client.ruc && <p className="mt-1 text-xs font-medium text-graphite">RUC: {client.ruc}</p>}
                </div>
              </div>

              <div className="mb-5 space-y-2 text-sm">
                {client.contactoPrincipal && (
                  <div className="flex items-center gap-2 text-graphite">
                    <UserRound size={16} aria-hidden="true" />
                    <span className="truncate">{client.contactoPrincipal}</span>
                  </div>
                )}
                {client.correoContacto && (
                  <div className="flex items-center gap-2 text-graphite">
                    <Mail size={16} aria-hidden="true" />
                    <span className="truncate">{client.correoContacto}</span>
                  </div>
                )}
                {client.telefono && (
                  <div className="flex items-center gap-2 text-graphite">
                    <Phone size={16} aria-hidden="true" />
                    <span>{client.telefono}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2 border-t border-stone-200 pt-4">
                <button onClick={() => openEdit(client)} className="premium-button-secondary flex-1 px-3 py-2">
                  <Pencil size={15} aria-hidden="true" />
                  Editar
                </button>
                <button
                  onClick={() => openDelete(client.id!)}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                >
                  <Trash2 size={15} aria-hidden="true" />
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingClient ? 'Editar Cliente' : 'Nuevo Cliente'}
      >
        {formError && (
          <div className="mb-4 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-3 text-red-700">
            <AlertTriangle size={18} className="mt-0.5 flex-shrink-0" aria-hidden="true" />
            <p className="text-sm">{formError}</p>
          </div>
        )}
        <ClientForm
          initialData={editingClient}
          onSubmit={handleSubmit}
          onCancel={() => setIsFormOpen(false)}
        />
      </Modal>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        message="Estas seguro de eliminar este cliente? Esta accion no se puede deshacer."
        loading={deleteLoading}
      />
    </Layout>
  );
};

export default ClientsPage;
