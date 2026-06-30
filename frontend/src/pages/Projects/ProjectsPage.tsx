import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Eye, FolderKanban, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Spinner from '../../components/common/Spinner';
import Badge from '../../components/common/Badge';
import { getPriorityVariant, getStatusLabel, getStatusVariant } from '../../components/common/badgeUtils';
import ProjectForm from './ProjectForm';
import { projectService } from '../../services/projectService';
import { clientService } from '../../services/clientService';
import type { Client, Project } from '../../types';

const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | undefined>();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [p, c] = await Promise.all([projectService.getAll(), clientService.getAll()]);
      setProjects(p);
      setClients(c);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    const loadInitialData = async () => {
      setLoading(true);
      try {
        const [p, c] = await Promise.all([projectService.getAll(), clientService.getAll()]);
        if (active) {
          setProjects(p);
          setClients(c);
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadInitialData();

    return () => {
      active = false;
    };
  }, []);

  const filtered = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.clientName || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openCreate = () => {
    setEditingProject(undefined);
    setFormError(null);
    setIsFormOpen(true);
  };

  const openEdit = (project: Project) => {
    setEditingProject(project);
    setFormError(null);
    setIsFormOpen(true);
  };

  const openDelete = (id: number) => {
    setDeletingId(id);
    setIsDeleteOpen(true);
  };

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
      <div className="premium-animate mb-8 flex flex-col gap-5">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.24em] text-[#8a764e]">Portfolio</p>
            <h1 className="text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
              Lista Profesional de Proyectos
            </h1>
            <p className="mt-3 text-sm font-medium text-graphite">{projects.length} proyectos en total</p>
          </div>
          <button onClick={openCreate} id="btn-new-project" className="premium-button-primary">
            <Plus size={18} aria-hidden="true" />
            <span>Nuevo Proyecto</span>
          </button>
        </div>
      </div>

      <div className="premium-animate premium-delay-1 relative mb-6 max-w-2xl">
        <Search
          size={20}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-graphite"
          aria-hidden="true"
        />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por nombre o cliente..."
          className="premium-field pl-11"
        />
      </div>

      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="premium-card premium-animate py-16 text-center">
          <FolderKanban size={42} className="mx-auto mb-4 text-[#8a764e]" aria-hidden="true" />
          <p className="text-sm font-medium text-graphite">
            {searchTerm ? 'Sin resultados' : 'No hay proyectos aun'}
          </p>
          {!searchTerm && (
            <button onClick={openCreate} className="mt-4 font-bold text-[#17486a] hover:text-[#6f5526]">
              Crear el primero
            </button>
          )}
        </div>
      ) : (
        <div className="premium-card premium-animate premium-delay-2 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px]">
              <thead>
                <tr className="border-b border-stone-200 bg-white/70">
                  <th className="px-6 py-4 text-left text-xs font-extrabold uppercase tracking-wide text-graphite">
                    Proyecto
                  </th>
                  <th className="hidden px-6 py-4 text-left text-xs font-extrabold uppercase tracking-wide text-graphite md:table-cell">
                    Cliente
                  </th>
                  <th className="hidden px-6 py-4 text-left text-xs font-extrabold uppercase tracking-wide text-graphite sm:table-cell">
                    Estado
                  </th>
                  <th className="hidden px-6 py-4 text-left text-xs font-extrabold uppercase tracking-wide text-graphite lg:table-cell">
                    Prioridad
                  </th>
                  <th className="hidden px-6 py-4 text-left text-xs font-extrabold uppercase tracking-wide text-graphite lg:table-cell">
                    Presupuesto
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-extrabold uppercase tracking-wide text-graphite">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {filtered.map((project) => (
                  <tr key={project.id} className="group hover:bg-stone-50/80">
                    <td className="px-6 py-5">
                      <Link to={`/projects/${project.id}`} className="block">
                        <p className="text-base font-extrabold text-ink group-hover:text-[#17486a]">
                          {project.name}
                        </p>
                        <p className="mt-1 text-xs font-medium text-graphite">
                          {project.leaderName || 'Sin lider'} - {project.tasks?.length || 0} tareas
                        </p>
                      </Link>
                    </td>
                    <td className="hidden px-6 py-5 md:table-cell">
                      <span className="text-sm font-semibold text-ink">{project.clientName || '-'}</span>
                    </td>
                    <td className="hidden px-6 py-5 sm:table-cell">
                      <Badge variant={getStatusVariant(project.status)}>{getStatusLabel(project.status)}</Badge>
                    </td>
                    <td className="hidden px-6 py-5 lg:table-cell">
                      {project.priority ? (
                        <Badge variant={getPriorityVariant(project.priority)}>{project.priority}</Badge>
                      ) : (
                        <span className="text-sm text-graphite">-</span>
                      )}
                    </td>
                    <td className="hidden px-6 py-5 lg:table-cell">
                      <span className="text-sm font-semibold text-ink">
                        {project.budget != null ? `$${project.budget.toLocaleString()}` : '-'}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/projects/${project.id}`} className="premium-icon-button" title="Ver detalle">
                          <Eye size={18} aria-hidden="true" />
                        </Link>
                        <button onClick={() => openEdit(project)} className="premium-icon-button" title="Editar">
                          <Pencil size={18} aria-hidden="true" />
                        </button>
                        <button
                          onClick={() => openDelete(project.id!)}
                          className="premium-icon-button hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                          title="Eliminar"
                        >
                          <Trash2 size={18} aria-hidden="true" />
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

      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingProject ? 'Editar Proyecto' : 'Nuevo Proyecto'}
        size="lg"
      >
        {formError && (
          <div className="mb-4 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-3 text-red-700">
            <AlertTriangle size={18} className="mt-0.5 flex-shrink-0" aria-hidden="true" />
            <p className="text-sm">{formError}</p>
          </div>
        )}
        <ProjectForm
          initialData={editingProject}
          clients={clients}
          onSubmit={handleSubmit}
          onCancel={() => setIsFormOpen(false)}
        />
      </Modal>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        message="Estas seguro de eliminar este proyecto? Esta accion tambien eliminara todas sus tareas."
        loading={deleteLoading}
      />
    </Layout>
  );
};

export default ProjectsPage;
