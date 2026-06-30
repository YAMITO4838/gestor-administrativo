import React from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Save, X } from 'lucide-react';
import type { Task, TaskStatus } from '../../types';
import Spinner from '../../components/common/Spinner';

const schema = yup.object({
  title: yup.string().max(150).required('El titulo es requerido'),
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
  `premium-field ${error ? 'premium-field-error' : ''}`;

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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5 sm:col-span-2">
          <label className="premium-label">
            Titulo <span className="text-red-500">*</span>
          </label>
          <input id="task-title" {...register('title')} placeholder="Tarea a realizar..." className={fieldClass(!!errors.title)} />
          {errors.title && <p className="text-xs font-medium text-red-600">{errors.title.message}</p>}
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <label className="premium-label">Descripcion</label>
          <textarea
            id="task-desc"
            {...register('description')}
            rows={3}
            placeholder="Detalles de la tarea..."
            className={`${fieldClass(false)} resize-none`}
          />
        </div>

        <div className="space-y-1.5">
          <label className="premium-label">Asignado a</label>
          <input id="task-assigned" {...register('assignedTo')} placeholder="Nombre del responsable" className={fieldClass(false)} />
        </div>

        <div className="space-y-1.5">
          <label className="premium-label">Estado</label>
          <select id="task-status" {...register('status')} className={fieldClass(false)}>
            <option value="PENDING">Pendiente</option>
            <option value="IN_PROGRESS">En Progreso</option>
            <option value="COMPLETED">Completada</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="premium-label">Prioridad</label>
          <select id="task-priority" {...register('priority')} className={fieldClass(false)}>
            <option value="">Sin prioridad</option>
            <option value="LOW">Baja</option>
            <option value="MEDIUM">Media</option>
            <option value="HIGH">Alta</option>
            <option value="CRITICAL">Critica</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="premium-label">Fecha de Inicio</label>
          <input id="task-start" type="date" {...register('startDate')} className={fieldClass(false)} />
        </div>

        <div className="space-y-1.5">
          <label className="premium-label">Fecha Limite</label>
          <input id="task-due" type="date" {...register('dueDate')} className={fieldClass(false)} />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} disabled={submitting} className="premium-button-secondary">
          <X size={16} aria-hidden="true" />
          Cancelar
        </button>
        <button type="submit" disabled={submitting} id="btn-save-task" className="premium-button-primary">
          {submitting ? (
            <>
              <Spinner size="sm" className="border-white/40 border-t-white" />
              <span>Guardando...</span>
            </>
          ) : (
            <>
              <Save size={16} aria-hidden="true" />
              <span>{initialData ? 'Actualizar Tarea' : 'Crear Tarea'}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
