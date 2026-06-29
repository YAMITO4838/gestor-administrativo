import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Spinner from '../../components/common/Spinner';
import Badge, { getStatusVariant, getPriorityVariant } from '../../components/common/Badge';
import ProjectForm from './ProjectForm';
import { projectService } from '../../services/projectService';
import { clientService } from '../../services/clientService';
import type { Project, Client } from '../../types';

const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | undefined>();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [p, c] = await Promise.all([projectService.getAll(), clientService.getAll()]);
      setProjects(p);
      setClients(c);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filtered = projects.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.clientName || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openCreate = () => { setEditingProject(undefined); setFormError(null); setIsFormOpen(true); };
  const openEdit = (project: Project) => { setEditingProject(project); setFormError(null); setIsFormOpen(true); };
  const openDelete = (id: number) => { setDeletingId(id); setIsDeleteOpen(true); };

  const handleSubmit = async (data: Project) => {
    setFormError(null);
    try {
      if (editingProject?.id) {
        await projectService.update(editingProject.id, data);
      } else {
        await projectService.create(data);
      }
      setIsFormOpen(false);
      fetchData();
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      setFormError(axiosError.response?.data?.message || 'Error al guardar el proyecto');
      throw err;
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    setDeleteLoading(true);
    try {
      await projectService.delete(deletingId);
      setIsDeleteOpen(false);
      fetchData();
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <Layout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Proyectos</h1>
          <p className="text-slate-400 text-sm mt-1">{projects.length} proyectos en total</p>
        </div>
        <button
          onClick={openCreate}
          id="btn-new-project"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-all shadow-lg hover:shadow-indigo-500/25"
        >
          + Nuevo Proyecto
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por nombre o cliente..."
          className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-3 pl-10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center items-center h-48"><Spinner size="lg" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">📁</p>
          <p className="text-slate-400">{searchTerm ? 'Sin resultados' : 'No hay proyectos aún'}</p>
          {!searchTerm && (
            <button onClick={openCreate} className="mt-4 text-indigo-400 hover:text-indigo-300 text-sm font-medium">
              + Crear el primero
            </button>
          )}
        </div>
      ) : (
        <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700/50">
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-6 py-4">Proyecto</th>
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-6 py-4 hidden md:table-cell">Cliente</th>
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-6 py-4 hidden sm:table-cell">Estado</th>
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-6 py-4 hidden lg:table-cell">Prioridad</th>
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-6 py-4 hidden lg:table-cell">Presupuesto</th>
                  <th className="text-right text-xs font-semibold text-slate-400 uppercase tracking-wider px-6 py-4">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/30">
                {filtered.map((project) => (
                  <tr key={project.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <Link to={`/projects/${project.id}`} className="group">
                        <p className="text-white font-medium text-sm group-hover:text-indigo-400 transition-colors">
                          {project.name}
                        </p>
                        <p className="text-slate-500 text-xs mt-0.5">
                          {project.leaderName || 'Sin líder'} • {project.tasks?.length || 0} tareas
                        </p>
                      </Link>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span className="text-slate-300 text-sm">{project.clientName || '—'}</span>
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      <Badge variant={getStatusVariant(project.status)}>
                        {project.status || '—'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      {project.priority ? (
                        <Badge variant={getPriorityVariant(project.priority)}>{project.priority}</Badge>
                      ) : (
                        <span className="text-slate-500 text-sm">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <span className="text-slate-300 text-sm">
                        {project.budget != null ? `$${project.budget.toLocaleString()}` : '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/projects/${project.id}`}
                          className="p-2 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-700 transition-all text-sm"
                          title="Ver detalle"
                        >
                          👁️
                        </Link>
                        <button
                          onClick={() => openEdit(project)}
                          className="p-2 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-700 transition-all"
                          title="Editar"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => openDelete(project.id!)}
                          className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-700 transition-all"
                          title="Eliminar"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingProject ? 'Editar Proyecto' : 'Nuevo Proyecto'}
        size="lg"
      >
        {formError && (
          <div className="mb-4 flex items-start gap-3 bg-red-900/40 border border-red-700/50 rounded-xl p-3">
            <span className="text-red-400">⚠️</span>
            <p className="text-red-300 text-sm">{formError}</p>
          </div>
        )}
        <ProjectForm
          initialData={editingProject}
          clients={clients}
          onSubmit={handleSubmit}
          onCancel={() => setIsFormOpen(false)}
        />
      </Modal>

      {/* Delete confirmation */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        message="¿Estás seguro de eliminar este proyecto? Esta acción también eliminará todas sus tareas."
        loading={deleteLoading}
      />
    </Layout>
  );
};

export default ProjectsPage;
