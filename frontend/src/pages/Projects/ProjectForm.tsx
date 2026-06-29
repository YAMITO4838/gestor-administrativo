import React from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import type { Project, Client } from '../../types';
import Spinner from '../../components/common/Spinner';

const schema = yup.object({
  name: yup.string().max(150).required('El nombre es requerido'),
  description: yup.string().optional().default(''),
  leaderName: yup.string().max(120).optional().default(''),
  startDate: yup.string().optional().default(''),
  endDate: yup.string().optional().default(''),
  status: yup.string().optional().default(''),
  priority: yup.string().optional().default(''),
  budget: yup.number().nullable().optional(),
  clientId: yup.number().nullable().optional(),
});

interface ProjectFormValues {
  name: string;
  description?: string;
  leaderName?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  priority?: string;
  budget?: number | null;
  clientId?: number | null;
}

interface ProjectFormProps {
  initialData?: Project;
  clients: Client[];
  onSubmit: (data: Project) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const fieldClass = (error?: boolean) =>
  `w-full bg-slate-800/60 border ${error ? 'border-red-500' : 'border-slate-600'} rounded-xl px-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors`;

const ProjectForm: React.FC<ProjectFormProps> = ({
  initialData,
  clients,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(schema) as any,
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      leaderName: initialData?.leaderName || '',
      startDate: initialData?.startDate || '',
      endDate: initialData?.endDate || '',
      status: initialData?.status || '',
      priority: initialData?.priority || '',
      budget: initialData?.budget ?? undefined,
      clientId: initialData?.client?.id ?? undefined,
    },
  });

  const handleFormSubmit: SubmitHandler<ProjectFormValues> = async (data) => {
    const payload: Project = {
      ...initialData,
      name: data.name,
      description: data.description || undefined,
      leaderName: data.leaderName || undefined,
      startDate: data.startDate || undefined,
      endDate: data.endDate || undefined,
      status: data.status || undefined,
      priority: data.priority || undefined,
      budget: data.budget ?? undefined,
      client: data.clientId ? { id: data.clientId, razonSocial: '' } : undefined,
    };
    await onSubmit(payload);
  };

  const submitting = isSubmitting || isLoading;

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4" noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Name */}
        <div className="sm:col-span-2 space-y-1">
          <label className="block text-sm font-medium text-slate-300">
            Nombre del Proyecto <span className="text-red-400">*</span>
          </label>
          <input
            id="proj-name"
            {...register('name')}
            placeholder="Mi proyecto"
            className={fieldClass(!!errors.name)}
          />
          {errors.name && <p className="text-red-400 text-xs">{errors.name.message}</p>}
        </div>

        {/* Description */}
        <div className="sm:col-span-2 space-y-1">
          <label className="block text-sm font-medium text-slate-300">Descripción</label>
          <textarea
            id="proj-desc"
            {...register('description')}
            rows={3}
            placeholder="Descripción del proyecto..."
            className={fieldClass(false) + ' resize-none'}
          />
        </div>

        {/* Leader */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-300">Líder</label>
          <input id="proj-leader" {...register('leaderName')} placeholder="Nombre del líder" className={fieldClass(false)} />
        </div>

        {/* Client */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-300">Cliente</label>
          <select id="proj-client" {...register('clientId', { valueAsNumber: true })} className={fieldClass(false)}>
            <option value="">Sin cliente</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.razonSocial}
              </option>
            ))}
          </select>
        </div>

        {/* Start date */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-300">Fecha de Inicio</label>
          <input id="proj-start" type="date" {...register('startDate')} className={fieldClass(false)} />
        </div>

        {/* End date */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-300">Fecha de Fin</label>
          <input id="proj-end" type="date" {...register('endDate')} className={fieldClass(false)} />
        </div>

        {/* Status */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-300">Estado</label>
          <select id="proj-status" {...register('status')} className={fieldClass(false)}>
            <option value="">Sin estado</option>
            <option value="EN_PROGRESO">En Progreso</option>
            <option value="COMPLETADO">Completado</option>
            <option value="PENDIENTE">Pendiente</option>
            <option value="PAUSADO">Pausado</option>
          </select>
        </div>

        {/* Priority */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-300">Prioridad</label>
          <select id="proj-priority" {...register('priority')} className={fieldClass(false)}>
            <option value="">Sin prioridad</option>
            <option value="LOW">Baja</option>
            <option value="MEDIUM">Media</option>
            <option value="HIGH">Alta</option>
            <option value="CRITICAL">Crítica</option>
          </select>
        </div>

        {/* Budget */}
        <div className="sm:col-span-2 space-y-1">
          <label className="block text-sm font-medium text-slate-300">Presupuesto</label>
          <input
            id="proj-budget"
            type="number"
            step="0.01"
            {...register('budget', { valueAsNumber: true })}
            placeholder="0.00"
            className={fieldClass(false)}
          />
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
          id="btn-save-project"
          className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-all disabled:opacity-60 flex items-center gap-2 shadow-lg"
        >
          {submitting ? (
            <>
              <Spinner size="sm" />
              Guardando...
            </>
          ) : (
            initialData ? 'Actualizar' : 'Crear Proyecto'
          )}
        </button>
      </div>
    </form>
  );
};

export default ProjectForm;
