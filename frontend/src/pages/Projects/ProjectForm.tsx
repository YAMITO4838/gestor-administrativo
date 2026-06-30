import React from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Save, X } from 'lucide-react';
import type { Client, Project } from '../../types';
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
  `premium-field ${error ? 'premium-field-error' : ''}`;

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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5 sm:col-span-2">
          <label className="premium-label">
            Nombre del Proyecto <span className="text-red-500">*</span>
          </label>
          <input id="proj-name" {...register('name')} placeholder="Mi proyecto" className={fieldClass(!!errors.name)} />
          {errors.name && <p className="text-xs font-medium text-red-600">{errors.name.message}</p>}
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <label className="premium-label">Descripcion</label>
          <textarea
            id="proj-desc"
            {...register('description')}
            rows={3}
            placeholder="Descripcion del proyecto..."
            className={`${fieldClass(false)} resize-none`}
          />
        </div>

        <div className="space-y-1.5">
          <label className="premium-label">Lider</label>
          <input id="proj-leader" {...register('leaderName')} placeholder="Nombre del lider" className={fieldClass(false)} />
        </div>

        <div className="space-y-1.5">
          <label className="premium-label">Cliente</label>
          <select id="proj-client" {...register('clientId', { valueAsNumber: true })} className={fieldClass(false)}>
            <option value="">Sin cliente</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.razonSocial}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="premium-label">Fecha de Inicio</label>
          <input id="proj-start" type="date" {...register('startDate')} className={fieldClass(false)} />
        </div>

        <div className="space-y-1.5">
          <label className="premium-label">Fecha de Fin</label>
          <input id="proj-end" type="date" {...register('endDate')} className={fieldClass(false)} />
        </div>

        <div className="space-y-1.5">
          <label className="premium-label">Estado</label>
          <select id="proj-status" {...register('status')} className={fieldClass(false)}>
            <option value="">Sin estado</option>
            <option value="EN_PROGRESO">En Progreso</option>
            <option value="COMPLETADO">Completado</option>
            <option value="PENDIENTE">Pendiente</option>
            <option value="PAUSADO">Pausado</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="premium-label">Prioridad</label>
          <select id="proj-priority" {...register('priority')} className={fieldClass(false)}>
            <option value="">Sin prioridad</option>
            <option value="LOW">Baja</option>
            <option value="MEDIUM">Media</option>
            <option value="HIGH">Alta</option>
            <option value="CRITICAL">Critica</option>
          </select>
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <label className="premium-label">Presupuesto</label>
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

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} disabled={submitting} className="premium-button-secondary">
          <X size={16} aria-hidden="true" />
          Cancelar
        </button>
        <button type="submit" disabled={submitting} id="btn-save-project" className="premium-button-primary">
          {submitting ? (
            <>
              <Spinner size="sm" className="border-white/40 border-t-white" />
              <span>Guardando...</span>
            </>
          ) : (
            <>
              <Save size={16} aria-hidden="true" />
              <span>{initialData ? 'Actualizar' : 'Crear Proyecto'}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ProjectForm;
