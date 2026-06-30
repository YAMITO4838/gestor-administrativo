import React from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Save, X } from 'lucide-react';
import type { Client } from '../../types';
import Spinner from '../../components/common/Spinner';

const schema = yup.object({
  razonSocial: yup.string().max(150).required('La razon social es requerida'),
  ruc: yup.string().max(30).optional().default(''),
  contactoPrincipal: yup.string().max(100).optional().default(''),
  correoContacto: yup.string().email('Email invalido').optional().default(''),
  telefono: yup.string().max(20).optional().default(''),
});

interface ClientFormValues {
  razonSocial: string;
  ruc?: string;
  contactoPrincipal?: string;
  correoContacto?: string;
  telefono?: string;
}

interface ClientFormProps {
  initialData?: Client;
  onSubmit: (data: Client) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const fieldClass = (error?: boolean) =>
  `premium-field ${error ? 'premium-field-error' : ''}`;

const ClientForm: React.FC<ClientFormProps> = ({ initialData, onSubmit, onCancel, isLoading = false }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ClientFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(schema) as any,
    defaultValues: {
      razonSocial: initialData?.razonSocial || '',
      ruc: initialData?.ruc || '',
      contactoPrincipal: initialData?.contactoPrincipal || '',
      correoContacto: initialData?.correoContacto || '',
      telefono: initialData?.telefono || '',
    },
  });

  const handleFormSubmit: SubmitHandler<ClientFormValues> = async (data) => {
    await onSubmit({
      ...initialData,
      razonSocial: data.razonSocial,
      ruc: data.ruc || undefined,
      contactoPrincipal: data.contactoPrincipal || undefined,
      correoContacto: data.correoContacto || undefined,
      telefono: data.telefono || undefined,
    });
  };

  const submitting = isSubmitting || isLoading;

  const fields: {
    id: string;
    name: keyof ClientFormValues;
    label: string;
    type?: string;
    placeholder: string;
    required?: boolean;
  }[] = [
    { id: 'cli-razon', name: 'razonSocial', label: 'Razon Social', placeholder: 'Empresa S.A.C.', required: true },
    { id: 'cli-ruc', name: 'ruc', label: 'RUC', placeholder: '20123456789' },
    { id: 'cli-contacto', name: 'contactoPrincipal', label: 'Contacto Principal', placeholder: 'Juan Perez' },
    { id: 'cli-email', name: 'correoContacto', label: 'Email de Contacto', type: 'email', placeholder: 'contacto@empresa.com' },
    { id: 'cli-tel', name: 'telefono', label: 'Telefono', placeholder: '+51 999 999 999' },
  ];

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4" noValidate>
      {fields.map((field) => (
        <div key={field.id} className="space-y-1.5">
          <label htmlFor={field.id} className="premium-label">
            {field.label} {field.required && <span className="text-red-500">*</span>}
          </label>
          <input
            id={field.id}
            type={field.type || 'text'}
            {...register(field.name)}
            placeholder={field.placeholder}
            className={fieldClass(!!errors[field.name])}
          />
          {errors[field.name] && (
            <p className="text-xs font-medium text-red-600">{errors[field.name]?.message}</p>
          )}
        </div>
      ))}

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} disabled={submitting} className="premium-button-secondary">
          <X size={16} aria-hidden="true" />
          Cancelar
        </button>
        <button type="submit" disabled={submitting} id="btn-save-client" className="premium-button-primary">
          {submitting ? (
            <>
              <Spinner size="sm" className="border-white/40 border-t-white" />
              <span>Guardando...</span>
            </>
          ) : (
            <>
              <Save size={16} aria-hidden="true" />
              <span>{initialData ? 'Actualizar Cliente' : 'Crear Cliente'}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ClientForm;
