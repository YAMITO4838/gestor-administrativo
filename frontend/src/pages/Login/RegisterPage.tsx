import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/authService';
import Spinner from '../../components/common/Spinner';

const registerSchema = yup.object({
  username: yup.string().min(3).max(80).required('El nombre de usuario es requerido'),
  fullName: yup.string().optional().default(''),
  email: yup.string().email('Email inválido').required('El email es requerido'),
  password: yup.string().min(6, 'Mínimo 6 caracteres').required('La contraseña es requerida'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Las contraseñas no coinciden')
    .required('Confirma tu contraseña'),
  role: yup.string().optional().default('MEMBER'),
});

interface RegisterFormValues {
  username: string;
  fullName?: string;
  email: string;
  password: string;
  confirmPassword: string;
  role?: string;
}

const RegisterPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(registerSchema) as any,
    defaultValues: { role: 'MEMBER' },
  });

  const onSubmit: SubmitHandler<RegisterFormValues> = async (data) => {
    setError(null);
    try {
      const response = await authService.register({
        username: data.username,
        fullName: data.fullName || undefined,
        email: data.email,
        password: data.password,
        role: (data.role as 'ADMIN' | 'PROJECT_LEADER' | 'MEMBER') || 'MEMBER',
      });
      login(response);
      navigate('/dashboard');
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      setError(
        axiosError.response?.data?.message || 'Error al registrar. Intenta con otro usuario o email.'
      );
    }
  };

  const inputFields = [
    { id: 'reg-username', name: 'username' as const, label: 'Nombre de usuario', type: 'text', placeholder: 'johndoe', icon: '👤' },
    { id: 'reg-fullname', name: 'fullName' as const, label: 'Nombre completo (opcional)', type: 'text', placeholder: 'John Doe', icon: '🪪' },
    { id: 'reg-email', name: 'email' as const, label: 'Email', type: 'email', placeholder: 'john@ejemplo.com', icon: '✉️' },
    { id: 'reg-password', name: 'password' as const, label: 'Contraseña', type: 'password', placeholder: '••••••••', icon: '🔒' },
    { id: 'reg-confirm', name: 'confirmPassword' as const, label: 'Confirmar contraseña', type: 'password', placeholder: '••••••••', icon: '🔐' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-xl mb-4">
            <span className="text-white font-bold text-2xl">GA</span>
          </div>
          <h1 className="text-3xl font-bold text-white">Crear Cuenta</h1>
          <p className="text-slate-400 mt-2 text-sm">Completa los campos para registrarte</p>
        </div>

        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            {error && (
              <div className="flex items-start gap-3 bg-red-900/40 border border-red-700/50 rounded-xl p-4">
                <span className="text-red-400 text-lg">⚠️</span>
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            {inputFields.map((field) => (
              <div key={field.id} className="space-y-1.5">
                <label htmlFor={field.id} className="block text-sm font-medium text-slate-300">
                  {field.label}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{field.icon}</span>
                  <input
                    id={field.id}
                    type={field.type}
                    {...register(field.name)}
                    placeholder={field.placeholder}
                    className={`w-full bg-slate-800/60 border ${
                      errors[field.name] ? 'border-red-500' : 'border-slate-600'
                    } rounded-xl px-4 py-3 pl-10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors`}
                  />
                </div>
                {errors[field.name] && (
                  <p className="text-red-400 text-xs">{errors[field.name]?.message}</p>
                )}
              </div>
            ))}

            {/* Role selector */}
            <div className="space-y-1.5">
              <label htmlFor="reg-role" className="block text-sm font-medium text-slate-300">
                Rol
              </label>
              <select
                id="reg-role"
                {...register('role')}
                className="w-full bg-slate-800/60 border border-slate-600 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
              >
                <option value="MEMBER">Miembro</option>
                <option value="PROJECT_LEADER">Líder de Proyecto</option>
                <option value="ADMIN">Administrador</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              id="btn-register"
              className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-all duration-200 shadow-lg hover:shadow-indigo-500/25 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Spinner size="sm" />
                  Registrando...
                </>
              ) : (
                'Crear Cuenta'
              )}
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 border-t border-slate-700" />
            <span className="text-slate-500 text-xs">o</span>
            <div className="flex-1 border-t border-slate-700" />
          </div>

          <p className="text-center text-sm text-slate-400">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
