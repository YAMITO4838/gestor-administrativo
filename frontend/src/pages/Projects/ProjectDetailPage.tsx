import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Spinner from '../../components/common/Spinner';
import Badge, { getStatusVariant, getStatusLabel, getPriorityVariant } from '../../components/common/Badge';
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

  const fetchProject = useCallback(async () => {
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
  }, [projectId]);

  useEffect(() => { fetchProject(); }, [fetchProject]);

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
        <div className="flex justify-center items-center h-64"><Spinner size="lg" /></div>
      </Layout>
    );
  }

  if (!project) {
    return (
      <Layout>
        <div className="text-center py-20">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-slate-400">Proyecto no encontrado</p>
          <Link to="/projects" className="text-indigo-400 hover:text-indigo-300 text-sm mt-4 inline-block">
            ← Volver a proyectos
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
        <Link to="/projects" className="hover:text-slate-300 transition-colors">Proyectos</Link>
        <span>/</span>
        <span className="text-slate-300">{project.name}</span>
      </div>

      {/* Project header */}
      <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-white">{project.name}</h1>
              <Badge variant={getStatusVariant(project.status)}>{project.status || 'Sin estado'}</Badge>
            </div>
            {project.description && (
              <p className="text-slate-400 text-sm max-w-2xl">{project.description}</p>
            )}
          </div>
          {project.priority && (
            <Badge variant={getPriorityVariant(project.priority)} className="flex-shrink-0">
              🎯 {project.priority}
            </Badge>
          )}
        </div>

        {/* Metadata grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-700/50">
          {[
            { label: 'Líder', value: project.leaderName || '—' },
            { label: 'Cliente', value: project.clientName || '—' },
            { label: 'Inicio', value: project.startDate || '—' },
            { label: 'Fin', value: project.endDate || '—' },
          ].map((item) => (
            <div key={item.label}>
              <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">{item.label}</p>
              <p className="text-white text-sm font-medium">{item.value}</p>
            </div>
          ))}
          {project.budget != null && (
            <div className="col-span-2 sm:col-span-4">
              <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Presupuesto</p>
              <p className="text-white text-sm font-medium">${project.budget.toLocaleString()}</p>
            </div>
          )}
        </div>
      </div>

      {/* Tasks section */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-white">
          Tareas <span className="text-slate-500 font-normal text-sm">({tasks.length})</span>
        </h2>
        <button
          onClick={() => { setEditingTask(undefined); setIsTaskFormOpen(true); }}
          id="btn-new-task"
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-all shadow-lg"
        >
          + Nueva Tarea
        </button>
      </div>

      {/* Kanban-style columns */}
      {tasks.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-700/30">
          <p className="text-4xl mb-3">✅</p>
          <p className="text-slate-400">No hay tareas. ¡Crea la primera!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(['PENDING', 'IN_PROGRESS', 'COMPLETED'] as const).map((status) => (
            <div key={status} className="bg-slate-900/40 border border-slate-700/30 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant={getStatusVariant(status)}>
                  {getStatusLabel(status)}
                </Badge>
                <span className="text-slate-500 text-xs ml-auto">{tasksByStatus[status].length}</span>
              </div>
              <div className="space-y-3">
                {tasksByStatus[status].map((task) => (
                  <div
                    key={task.id}
                    className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 hover:border-slate-600 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-white text-sm font-medium leading-snug">{task.title}</p>
                      <div className="flex gap-1 flex-shrink-0">
                        <button
                          onClick={() => { setEditingTask(task); setIsTaskFormOpen(true); }}
                          className="p-1 rounded text-slate-400 hover:text-amber-400 transition-colors"
                          title="Editar"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => { setDeletingTaskId(task.id!); setIsDeleteOpen(true); }}
                          className="p-1 rounded text-slate-400 hover:text-red-400 transition-colors"
                          title="Eliminar"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                    {task.description && (
                      <p className="text-slate-500 text-xs mt-1 line-clamp-2">{task.description}</p>
                    )}
                    <div className="flex items-center gap-2 mt-3">
                      {task.assignedTo && (
                        <span className="text-slate-400 text-xs">👤 {task.assignedTo}</span>
                      )}
                      {task.priority && (
                        <Badge variant={getPriorityVariant(task.priority)} className="ml-auto">
                          {task.priority}
                        </Badge>
                      )}
                    </div>
                    {task.dueDate && (
                      <p className="text-slate-500 text-xs mt-2">📅 Límite: {task.dueDate}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Task Form Modal */}
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

      {/* Delete confirmation */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteTask}
        message="¿Estás seguro de eliminar esta tarea? Esta acción no se puede deshacer."
        loading={deleteLoading}
      />
    </Layout>
  );
};

export default ProjectDetailPage;
