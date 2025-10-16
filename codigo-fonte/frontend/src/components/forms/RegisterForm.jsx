import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input, Checkbox } from '../ui';
import { registerSchema, checkPasswordStrength } from '../../types/auth';
import { useAuthStore } from '../../stores/authStore';
import { useToast } from '../../hooks/useToast';

const RegisterForm = () => {
  const navigate = useNavigate();
  const { register: registerUser, isLoading } = useAuthStore();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    },
  });

  const password = watch('password');

  const passwordStrength = useMemo(() => {
    if (!password) return null;
    return checkPasswordStrength(password);
  }, [password]);

  const onSubmit = async data => {
    try {
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      toast.success('Conta criada com sucesso! Faça login.');
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);

      if (
        error.message.includes('already exists') ||
        error.message.includes('409')
      ) {
        setError('email', { message: 'Já existe uma conta com este email' });
      } else if (
        error.message.includes('validation') ||
        error.message.includes('422')
      ) {
        toast.error('Verifique suas informações e tente novamente.');
      } else if (error.message.includes('Network')) {
        toast.error('Erro de conexão. Verifique sua conexão com a internet.');
      } else {
        toast.error(error.message || 'Falha no cadastro. Tente novamente.');
      }
    }
  };

  const getPasswordStrengthColor = () => {
    if (!passwordStrength) return '';
    switch (passwordStrength.strength) {
      case 'weak':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'strong':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const getPasswordStrengthBarColor = () => {
    if (!passwordStrength) return 'bg-gray-200';
    switch (passwordStrength.strength) {
      case 'weak':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'strong':
        return 'bg-green-500';
      default:
        return 'bg-gray-200';
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input
        label="Nome completo"
        type="text"
        placeholder="Digite seu nome completo"
        error={errors.name?.message}
        {...register('name')}
        autoComplete="name"
        autoFocus
        data-testid="name-input"
      />

      <Input
        label="Endereço de email"
        type="email"
        placeholder="Digite seu email"
        error={errors.email?.message}
        {...register('email')}
        autoComplete="email"
        data-testid="email-input"
      />

      <div>
        <Input
          label="Senha"
          type="password"
          placeholder="Crie uma senha"
          error={errors.password?.message}
          showPasswordToggle={true}
          {...register('password')}
          autoComplete="new-password"
          data-testid="password-input"
        />

        {password && passwordStrength && (
          <div className="mt-2">
            <div className="flex items-center space-x-2 mb-1">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthBarColor()}`}
                  style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                />
              </div>
              <span
                className={`text-sm font-medium ${getPasswordStrengthColor()}`}
              >
                {passwordStrength.strength.charAt(0).toUpperCase() +
                  passwordStrength.strength.slice(1)}
              </span>
            </div>
            {passwordStrength.feedback.length > 0 && (
              <div className="text-sm text-gray-600">
                <p>Para fortalecer sua senha:</p>
                <ul className="list-disc list-inside ml-2">
                  {passwordStrength.feedback.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      <Input
        label="Confirmar senha"
        type="password"
        placeholder="Confirme sua senha"
        error={errors.confirmPassword?.message}
        {...register('confirmPassword')}
        autoComplete="new-password"
        data-testid="confirm-password-input"
      />

      <Checkbox
        label={
          <span>
            Eu concordo com os{' '}
            <Link
              to="/terms"
              className="text-black underline hover:text-gray-700"
            >
              Termos de Serviço
            </Link>{' '}
            and{' '}
            <Link
              to="/privacy"
              className="text-black underline hover:text-gray-700"
            >
              Política de Privacidade
            </Link>
          </span>
        }
        error={errors.acceptTerms?.message}
        {...register('acceptTerms')}
        data-testid="terms-checkbox"
      />

      <Button
        type="submit"
        className="w-full"
        loading={isSubmitting || isLoading}
        data-testid="register-button"
      >
        {isSubmitting || isLoading ? 'Criando conta...' : 'Criar conta'}
      </Button>

      <div className="text-center">
        <span className="text-body-medium text-gray-600">
          Já tem uma conta?{' '}
          <Link
            to="/login"
            className="text-black font-medium hover:text-gray-700 underline"
          >
            Entrar
          </Link>
        </span>
      </div>
    </form>
  );
};

export default RegisterForm;
