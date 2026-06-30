import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { AlertTriangle, Eye, EyeOff, LockKeyhole, LogIn, UserRound } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/authService';
import Spinner from '../../components/common/Spinner';

const loginSchema = yup.object({
  username: yup.string().required('El usuario o email es requerido'),
  password: yup.string().min(4, 'Minimo 4 caracteres').required('La contrasena es requerida'),
});

type LoginFormData = yup.InferType<typeof loginSchema>;

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({ resolver: yupResolver(loginSchema) });

  const onSubmit = async (data: LoginFormData) => {
    setError(null);
    try {
      const response = await authService.login({
        username: data.username,
        password: data.password,
      });
      login(response);
      navigate('/dashboard');
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      setError(
        axiosError.response?.data?.message ||
          'Credenciales invalidas. Verifica tu usuario y contrasena.'
      );
    }
  };

  return (
    <div className="premium-page flex items-center justify-center p-4">
      <div className="premium-shell w-full max-w-md">
        <div className="premium-animate mb-7 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg border border-[#b5965b]/60 bg-white shadow-premium">
            <span className="bg-gradient-to-r from-[#b5965b] via-[#071d35] to-[#173b57] bg-clip-text text-3xl font-extrabold text-transparent">
              GA
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-ink">Gestor Administrativo</h1>
          <p className="mt-2 text-sm font-medium text-graphite">Premium Login</p>
        </div>

        <div className="premium-card premium-animate premium-delay-1 p-8 shadow-premium">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            {error && (
              <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
                <AlertTriangle size={19} className="mt-0.5 flex-shrink-0" aria-hidden="true" />
                <p className="text-sm leading-6">{error}</p>
              </div>
            )}

            <div className="space-y-1.5">
              <label htmlFor="login-username" className="premium-label">
                Usuario o Email
              </label>
              <div className="relative">
                <UserRound
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8a764e]"
                  aria-hidden="true"
                />
                <input
                  id="login-username"
                  type="text"
                  {...register('username')}
                  placeholder="usuario o email@ejemplo.com"
                  className={`premium-field pl-11 ${errors.username ? 'premium-field-error' : ''}`}
                />
              </div>
              {errors.username && (
                <p className="text-xs font-medium text-red-600">{errors.username.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="login-password" className="premium-label">
                Contrasena
              </label>
              <div className="relative">
                <LockKeyhole
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8a764e]"
                  aria-hidden="true"
                />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  placeholder="********"
                  className={`premium-field pl-11 pr-12 ${errors.password ? 'premium-field-error' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-graphite hover:bg-stone-100 hover:text-ink"
                  aria-label={showPassword ? 'Ocultar contrasena' : 'Mostrar contrasena'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs font-medium text-red-600">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              id="btn-login"
              className="premium-button-primary w-full"
            >
              {isSubmitting ? (
                <>
                  <Spinner size="sm" className="border-white/40 border-t-white" />
                  <span>Iniciando sesion...</span>
                </>
              ) : (
                <>
                  <LogIn size={18} aria-hidden="true" />
                  <span>Iniciar Sesion</span>
                </>
              )}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 border-t border-stone-200" />
            <span className="text-xs font-semibold uppercase tracking-wide text-graphite">o</span>
            <div className="flex-1 border-t border-stone-200" />
          </div>

          <p className="text-center text-sm text-graphite">
            No tienes cuenta?{' '}
            <Link to="/register" className="font-bold text-[#17486a] hover:text-[#6f5526]">
              Registrate aqui
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
