import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { Button, Input } from '../ui';
import { useToast } from '../../hooks/useToast';
import { authService } from '../../services/authService';
import { useState } from 'react';

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Senha atual é obrigatória'),
  newPassword: z.string().min(6, 'A nova senha deve ter no mínimo 6 caracteres'),
  confirmPassword: z.string().min(1, 'Confirmação de senha é obrigatória'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
});

const ChangePasswordForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await authService.changePassword(
        data.currentPassword,
        data.newPassword
      );

      toast.success('Senha alterada com sucesso!');
      reset();

      // Redireciona para o dashboard após 1.5 segundos
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (error) {
      console.error('Change password error:', error);

      // Handle specific error cases
      if (error.message.includes('Current password is incorrect')) {
        setError('currentPassword', { message: 'Senha atual está incorreta' });
      } else if (error.message.includes('Network')) {
        toast.error('Erro de conexão. Verifique sua conexão com a internet.');
      } else {
        toast.error(error.message || 'Erro ao alterar senha. Tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1); // Volta para a página anterior
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Current Password Input */}
      <Input
        label="Senha Atual"
        type="password"
        placeholder="Digite sua senha atual"
        error={errors.currentPassword?.message}
        showPasswordToggle={true}
        {...register('currentPassword')}
        autoComplete="current-password"
        autoFocus
        data-testid="current-password-input"
      />

      {/* New Password Input */}
      <Input
        label="Nova Senha"
        type="password"
        placeholder="Digite a nova senha (mínimo 6 caracteres)"
        error={errors.newPassword?.message}
        showPasswordToggle={true}
        {...register('newPassword')}
        autoComplete="new-password"
        data-testid="new-password-input"
      />

      {/* Confirm Password Input */}
      <Input
        label="Confirmar Nova Senha"
        type="password"
        placeholder="Confirme a nova senha"
        error={errors.confirmPassword?.message}
        showPasswordToggle={true}
        {...register('confirmPassword')}
        autoComplete="new-password"
        data-testid="confirm-password-input"
      />

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button
          type="submit"
          className="w-full"
          loading={isSubmitting || isLoading}
          data-testid="change-password-button"
        >
          {isSubmitting || isLoading ? 'Alterando senha...' : 'Alterar Senha'}
        </Button>

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleCancel}
          disabled={isSubmitting || isLoading}
          data-testid="cancel-button"
        >
          Cancelar
        </Button>
      </div>

      {/* Info Text */}
      <div className="text-center">
        <p className="text-sm text-gray-600">
          Após alterar sua senha, você continuará conectado.
        </p>
      </div>
    </form>
  );
};

export default ChangePasswordForm;
