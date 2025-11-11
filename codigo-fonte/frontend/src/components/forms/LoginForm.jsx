import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { Button, Input, Checkbox } from '../ui';
import { loginSchema } from '../../types/auth';
import { useAuthStore } from '../../stores/authStore';
import { useToast } from '../../hooks/useToast';
// import { authService } from '../../services/authService';

const LoginForm = () => {
  const { login, isLoading, isRateLimited, getCooldownTime } = useAuthStore();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async data => {
    if (isRateLimited()) {
      const cooldownTime = Math.ceil(getCooldownTime() / 1000 / 60);
      toast.error(
        `Muitas tentativas de login. Tente novamente em ${cooldownTime} minutos.`,
      );
      return;
    }

    try {
      await login(data);
      toast.success('Login realizado com sucesso! Bem-vindo de volta.');
    } catch (error) {
      console.error('Login error:', error);

      // Handle specific error cases
      if (error.message.includes('Invalid credentials')) {
        setError('password', { message: 'Email ou senha inválidos' });
      } else if (error.message.includes('too many requests')) {
        toast.error('Muitas tentativas de login. Tente novamente mais tarde.');
      } else if (error.message.includes('Network')) {
        toast.error('Erro de conexão. Verifique sua conexão com a internet.');
      } else {
        toast.error(error.message || 'Falha no login. Tente novamente.');
      }
    }
  };

  // const handleGoogleLogin = () => {
  //   const googleAuthUrl = authService.getGoogleAuthUrl();
  //   window.location.href = googleAuthUrl;
  // };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input
        label="Endereço de email"
        type="email"
        placeholder="Digite seu email"
        error={errors.email?.message}
        {...register('email')}
        autoComplete="email"
        autoFocus
        data-testid="email-input"
      />

      <Input
        label="Senha"
        type="password"
        placeholder="Digite sua senha"
        error={errors.password?.message}
        showPasswordToggle={true}
        {...register('password')}
        autoComplete="current-password"
        data-testid="password-input"
      />

      <div className="flex items-center justify-between">
        <Checkbox label="Lembrar de mim" {...register('rememberMe')} />
        <Link
          to="/forgot-password"
          className="text-sm text-black hover:text-gray-700 underline"
        >
          Esqueceu a senha?
        </Link>
      </div>

      <Button
        type="submit"
        className="w-full"
        loading={isSubmitting || isLoading}
        disabled={isRateLimited()}
        data-testid="login-button"
      >
        {isSubmitting || isLoading ? 'Entrando...' : 'Entrar'}
      </Button>

      {/* <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Ou continue com</span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleGoogleLogin}
        disabled={isSubmitting || isLoading}
        data-testid="google-login-button"
      >
        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Continuar com Google
      </Button> */}

      <div className="text-center">
        <span className="text-body-medium text-gray-600">
          Não tem uma conta?{' '}
          <Link
            to="/register"
            className="text-black font-medium hover:text-gray-700 underline"
          >
            Cadastre-se
          </Link>
        </span>
      </div>
    </form>
  );
};

export default LoginForm;
