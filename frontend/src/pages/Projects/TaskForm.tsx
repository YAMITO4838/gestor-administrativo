import React from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import type { Task, TaskStatus } from '../../types';
import Spinner from '../../components/common/Spinner';

const schema = yup.object({
  title: yup.string().max(150).required('El título es requerido'),
  description: yup.string().optional().default(''),
  assignedTo: yup.string().optional().default(''),
  status: yup.string().optional().default('PENDING'),
  priority: yup.string().optional().default(''),
  startDate: yup.string().optional().default(''),
  dueDate: yup.string().optional().default(''),
});

interface TaskFormValues {
  title: string;
  description?: string;
  assignedTo?: string;
  status?: string;
  priority?: string;
  startDate?: string;
  dueDate?: string;
}

interface TaskFormProps {
  initialData?: Task;
  onSubmit: (data: Task) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const fieldClass = (error?: boolean) =>
  `w-full bg-slate-800/60 border ${error ? 'border-red-500' : 'border-slate-600'} rounded-xl px-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors`;

const TaskForm: React.FC<TaskFormProps> = ({ initialData, onSubmit, onCancel, isLoading = false }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(schema) as any,
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      assignedTo: initialData?.assignedTo || '',
      status: initialData?.status || 'PENDING',
      priority: initialData?.priority || '',
      startDate: initialData?.startDate || '',
      dueDate: initialData?.dueDate || '',
    },
  });

  const handleFormSubmit: SubmitHandler<TaskFormValues> = async (data) => {
    const payload: Task = {
      ...initialData,
      title: data.title,
      description: data.description || undefined,
      assignedTo: data.assignedTo || undefined,
      status: data.status as TaskStatus,
      priority: data.priority || undefined,
      startDate: data.startDate || undefined,
      dueDate: data.dueDate || undefined,
    };
    await onSubmit(payload);
  };

  const submitting = isSubmitting || isLoading;

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4" noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Title */}
        <div className="sm:col-span-2 space-y-1">
          <label className="block text-sm font-medium text-slate-300">
            Título <span className="text-red-400">*</span>
          </label>
          <input
            id="task-title"
            {...register('title')}
            placeholder="Tarea a realizar..."
            className={fieldClass(!!errors.title)}
          />
          {errors.title && <p className="text-red-400 text-xs">{errors.title.message}</p>}
        </div>

        {/* Description */}
        <div className="sm:col-span-2 space-y-1">
          <label className="block text-sm font-medium text-slate-300">Descripción</label>
          <textarea
            id="task-desc"
            {...register('description')}
            rows={3}
            placeholder="Detalles de la tarea..."
            className={fieldClass(false) + ' resize-none'}
          />
        </div>

        {/* Assigned To */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-300">Asignado a</label>
          <input
            id="task-assigned"
            {...register('assignedTo')}
            placeholder="Nombre del responsable"
            className={fieldClass(false)}
          />
        </div>

        {/* Status */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-300">Estado</label>
          <select id="task-status" {...register('status')} className={fieldClass(false)}>
            <option value="PENDING">Pendiente</option>
            <option value="IN_PROGRESS">En Progreso</option>
            <option value="COMPLETED">Completada</option>
          </select>
        </div>

        {/* Priority */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-300">Prioridad</label>
          <select id="task-priority" {...register('priority')} className={fieldClass(false)}>
            <option value="">Sin prioridad</option>
            <option value="LOW">Baja</option>
            <option value="MEDIUM">Media</option>
            <option value="HIGH">Alta</option>
            <option value="CRITICAL">Crítica</option>
          </select>
        </div>

        {/* Start date */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-300">Fecha de Inicio</label>
          <input id="task-start" type="date" {...register('startDate')} className={fieldClass(false)} />
        </div>

        {/* Due date */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-300">Fecha Límite</label>
          <input id="task-due" type="date" {...register('dueDate')} className={fieldClass(false)} />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-end pt-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="px-5 py-2.5 rounded-xl text-sm text-slate-300 border border-slate-600 hover:bg-slate-700 transition-colors disabled:opacity-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={submitting}
          id="btn-save-task"
          className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-all disabled:opacity-60 flex items-center gap-2 shadow-lg"
        >
          {submitting ? (
            <>
              <Spinner size="sm" />
              Guardando...
            </>
          ) : (
            initialData ? 'Actualizar Tarea' : 'Crear Tarea'
          )}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
