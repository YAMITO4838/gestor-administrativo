import React from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import type { Client } from '../../types';
import Spinner from '../../components/common/Spinner';

const schema = yup.object({
  razonSocial: yup.string().max(150).required('La razón social es requerida'),
  ruc: yup.string().max(30).optional().default(''),
  contactoPrincipal: yup.string().max(100).optional().default(''),
  correoContacto: yup.string().email('Email inválido').optional().default(''),
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
  `w-full bg-slate-800/60 border ${error ? 'border-red-500' : 'border-slate-600'} rounded-xl px-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors`;

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
    { id: 'cli-razon', name: 'razonSocial', label: 'Razón Social', placeholder: 'Empresa S.A.C.', required: true },
    { id: 'cli-ruc', name: 'ruc', label: 'RUC', placeholder: '20123456789' },
    { id: 'cli-contacto', name: 'contactoPrincipal', label: 'Contacto Principal', placeholder: 'Juan Pérez' },
    { id: 'cli-email', name: 'correoContacto', label: 'Email de Contacto', type: 'email', placeholder: 'contacto@empresa.com' },
    { id: 'cli-tel', name: 'telefono', label: 'Teléfono', placeholder: '+51 999 999 999' },
  ];

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4" noValidate>
      {fields.map((field) => (
        <div key={field.id} className="space-y-1">
          <label htmlFor={field.id} className="block text-sm font-medium text-slate-300">
            {field.label} {field.required && <span className="text-red-400">*</span>}
          </label>
          <input
            id={field.id}
            type={field.type || 'text'}
            {...register(field.name)}
            placeholder={field.placeholder}
            className={fieldClass(!!errors[field.name])}
          />
          {errors[field.name] && (
            <p className="text-red-400 text-xs">{errors[field.name]?.message}</p>
          )}
        </div>
      ))}

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
          id="btn-save-client"
          className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-all disabled:opacity-60 flex items-center gap-2 shadow-lg"
        >
          {submitting ? (
            <>
              <Spinner size="sm" />
              Guardando...
            </>
          ) : (
            initialData ? 'Actualizar Cliente' : 'Crear Cliente'
          )}
        </button>
      </div>
    </form>
  );
};

export default ClientForm;
