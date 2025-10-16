import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Input } from '../ui';
import { forgotPasswordSchema } from '../../types/auth';
import { useAuthStore } from '../../stores/authStore';
import { useToast } from '../../hooks/useToast';

const ForgotPasswordForm = () => {
  const navigate = useNavigate();
  const { forgotPassword, isLoading } = useAuthStore();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async data => {
    try {
      await forgotPassword(data.email);
      toast.info(
        'Instruções para redefinir a senha foram enviadas para seu email.',
      );
      navigate('/login');
    } catch (error) {
      console.error('Forgot password error:', error);

      // Handle specific error cases
      if (
        error.message.includes('too many requests') ||
        error.message.includes('429')
      ) {
        toast.error(
          'Muitas solicitações de redefinição de senha. Tente novamente mais tarde.',
        );
      } else if (error.message.includes('Network')) {
        toast.error('Erro de conexão. Verifique sua conexão com a internet.');
      } else {
        toast.error(
          error.message ||
            'Falha ao enviar email de redefinição de senha. Tente novamente.',
        );
      }
    }
  };

  return (
    <div>
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

        <Button
          type="submit"
          className="w-full"
          loading={isSubmitting || isLoading}
          data-testid="reset-password-button"
        >
          {isSubmitting || isLoading
            ? 'Enviando...'
            : 'Enviar link de redefinição'}
        </Button>

        <div className="text-center">
          <Link
            to="/login"
            className="text-body-medium text-black hover:text-gray-700 underline"
          >
            Voltar para login
          </Link>
        </div>
      </form>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-body-medium font-medium text-gray-900 mb-2">
          Tendo problemas?
        </h3>
        <ul className="text-body-small text-gray-600 space-y-1">
          <li>• Verifique sua pasta de spam ou lixo eletrônico</li>
          <li>• Certifique-se de ter digitado o endereço de email correto</li>
          <li>• Links de redefinição de senha expiram após 1 hora</li>
        </ul>
        <p className="text-body-small text-gray-600 mt-3">
          Ainda precisa de ajuda?{' '}
          <Link
            to="/contact"
            className="text-black underline hover:text-gray-700"
          >
            Contatar suporte
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
