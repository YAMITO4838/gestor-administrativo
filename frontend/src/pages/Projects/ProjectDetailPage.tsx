import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Pencil,
  Plus,
  SearchX,
  Target,
  Trash2,
  UserRound,
} from 'lucide-react';
import Layout from '../../components/layout/Layout';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Spinner from '../../components/common/Spinner';
import Badge from '../../components/common/Badge';
import { getPriorityVariant, getStatusLabel, getStatusVariant } from '../../components/common/badgeUtils';
import TaskForm from './TaskForm';
import { projectService } from '../../services/projectService';
import type { Project, Task } from '../../types';

const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const projectId = Number(id);

  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingTaskId, setDeletingTaskId] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchProject = async () => {
    setLoading(true);
    try {
      const [proj, taskList] = await Promise.all([
        projectService.getById(projectId),
        projectService.getTasks(projectId),
      ]);
      setProject(proj);
      setTasks(taskList);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    const loadInitialProject = async () => {
      setLoading(true);
      try {
        const [proj, taskList] = await Promise.all([
          projectService.getById(projectId),
          projectService.getTasks(projectId),
        ]);
        if (active) {
          setProject(proj);
          setTasks(taskList);
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadInitialProject();

    return () => {
      active = false;
    };
  }, [projectId]);

  const handleTaskSubmit = async (data: Task) => {
    if (editingTask?.id) {
      await projectService.updateTask(editingTask.id, data);
    } else {
      await projectService.createTask(projectId, data);
    }
    setIsTaskFormOpen(false);
    fetchProject();
  };

  const handleDeleteTask = async () => {
    if (!deletingTaskId) return;
    setDeleteLoading(true);
    try {
      await projectService.deleteTask(deletingTaskId);
      setIsDeleteOpen(false);
      fetchProject();
    } finally {
      setDeleteLoading(false);
    }
  };

  const tasksByStatus = {
    PENDING: tasks.filter((t) => t.status === 'PENDING'),
    IN_PROGRESS: tasks.filter((t) => t.status === 'IN_PROGRESS'),
    COMPLETED: tasks.filter((t) => t.status === 'COMPLETED'),
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex h-64 items-center justify-center">
          <Spinner size="lg" />
        </div>
      </Layout>
    );
  }

  if (!project) {
    return (
      <Layout>
        <div className="premium-card premium-animate py-20 text-center">
          <SearchX size={44} className="mx-auto mb-4 text-[#8a764e]" aria-hidden="true" />
          <p className="text-sm font-medium text-graphite">Proyecto no encontrado</p>
          <Link
            to="/projects"
            className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#17486a] hover:text-[#6f5526]"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Volver a proyectos
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="premium-animate mb-6 flex items-center gap-2 text-sm font-medium text-graphite">
        <Link to="/projects" className="inline-flex items-center gap-2 hover:text-ink">
          <ArrowLeft size={16} aria-hidden="true" />
          Proyectos
        </Link>
        <span>/</span>
        <span className="text-ink">{project.name}</span>
      </div>

      <div className="premium-card premium-animate premium-delay-1 mb-6 p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <h1 className="text-4xl font-extrabold tracking-tight text-ink">{project.name}</h1>
              <Badge variant={getStatusVariant(project.status)}>{getStatusLabel(project.status)}</Badge>
            </div>
            {project.description && (
              <p className="max-w-3xl text-sm leading-6 text-graphite">{project.description}</p>
            )}
          </div>
          {project.priority && (
            <Badge variant={getPriorityVariant(project.priority)} className="flex-shrink-0">
              <Target size={14} aria-hidden="true" />
              {project.priority}
            </Badge>
          )}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 border-t border-stone-200 pt-6 sm:grid-cols-4">
          {[
            { label: 'Lider', value: project.leaderName || '-' },
            { label: 'Cliente', value: project.clientName || '-' },
            { label: 'Inicio', value: project.startDate || '-' },
            { label: 'Fin', value: project.endDate || '-' },
          ].map((item) => (
            <div key={item.label}>
              <p className="mb-1 text-xs font-extrabold uppercase tracking-wide text-graphite">{item.label}</p>
              <p className="text-sm font-bold text-ink">{item.value}</p>
            </div>
          ))}
          {project.budget != null && (
            <div className="col-span-2 sm:col-span-4">
              <p className="mb-1 text-xs font-extrabold uppercase tracking-wide text-graphite">Presupuesto</p>
              <p className="text-sm font-bold text-ink">${project.budget.toLocaleString()}</p>
            </div>
          )}
        </div>
      </div>

      <div className="premium-animate premium-delay-2 mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-extrabold text-ink">
          Tareas <span className="text-base font-semibold text-graphite">({tasks.length})</span>
        </h2>
        <button
          onClick={() => {
            setEditingTask(undefined);
            setIsTaskFormOpen(true);
          }}
          id="btn-new-task"
          className="premium-button-primary"
        >
          <Plus size={18} aria-hidden="true" />
          <span>Nueva Tarea</span>
        </button>
      </div>

      {tasks.length === 0 ? (
        <div className="premium-card premium-animate py-16 text-center">
          <CheckCircle2 size={42} className="mx-auto mb-4 text-[#8a764e]" aria-hidden="true" />
          <p className="text-sm font-medium text-graphite">No hay tareas. Crea la primera.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {(['PENDING', 'IN_PROGRESS', 'COMPLETED'] as const).map((status, index) => (
            <div
              key={status}
              className="premium-card premium-animate p-4"
              style={{ animationDelay: `${180 + index * 70}ms` }}
            >
              <div className="mb-4 flex items-center gap-2">
                <Badge variant={getStatusVariant(status)}>{getStatusLabel(status)}</Badge>
                <span className="ml-auto text-xs font-bold text-graphite">{tasksByStatus[status].length}</span>
              </div>
              <div className="space-y-3">
                {tasksByStatus[status].map((task) => (
                  <div
                    key={task.id}
                    className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm hover:border-[#b5965b]/50 hover:shadow-soft"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-extrabold leading-snug text-ink">{task.title}</p>
                      <div className="flex flex-shrink-0 gap-1">
                        <button
                          onClick={() => {
                            setEditingTask(task);
                            setIsTaskFormOpen(true);
                          }}
                          className="premium-icon-button h-8 w-8"
                          title="Editar"
                        >
                          <Pencil size={15} aria-hidden="true" />
                        </button>
                        <button
                          onClick={() => {
                            setDeletingTaskId(task.id!);
                            setIsDeleteOpen(true);
                          }}
                          className="premium-icon-button h-8 w-8 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                          title="Eliminar"
                        >
                          <Trash2 size={15} aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                    {task.description && (
                      <p className="mt-2 line-clamp-2 text-xs leading-5 text-graphite">{task.description}</p>
                    )}
                    <div className="mt-3 flex items-center gap-2">
                      {task.assignedTo && (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-graphite">
                          <UserRound size={14} aria-hidden="true" />
                          {task.assignedTo}
                        </span>
                      )}
                      {task.priority && (
                        <Badge variant={getPriorityVariant(task.priority)} className="ml-auto">
                          {task.priority}
                        </Badge>
                      )}
                    </div>
                    {task.dueDate && (
                      <p className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-graphite">
                        <CalendarDays size={14} aria-hidden="true" />
                        Limite: {task.dueDate}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isTaskFormOpen}
        onClose={() => setIsTaskFormOpen(false)}
        title={editingTask ? 'Editar Tarea' : 'Nueva Tarea'}
        size="lg"
      >
        <TaskForm
          initialData={editingTask}
          onSubmit={handleTaskSubmit}
          onCancel={() => setIsTaskFormOpen(false)}
        />
      </Modal>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteTask}
        message="Estas seguro de eliminar esta tarea? Esta accion no se puede deshacer."
        loading={deleteLoading}
      />
    </Layout>
  );
};

export default ProjectDetailPage;
