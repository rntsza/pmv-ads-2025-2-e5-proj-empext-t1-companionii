import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Button, Input } from '../ui';
import { useToast } from '../../hooks/useToast';
import { authService } from '../../services/authService';
import { useAuthStore } from '../../stores/authStore';
import { changePasswordSchema, checkPasswordStrength } from '../../types/auth';

const ChangePasswordForm = ({ token = '' }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { logout } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  const newPassword = watch('newPassword');

  const onSubmit = async data => {
    if (!token) {
      toast.error('Link inválido ou expirado. Solicite uma nova redefinição.');
      return;
    }

    setIsLoading(true);
    try {
      await authService.changePassword(data.newPassword, token);

      toast.success('Senha alterada com sucesso!');
      reset();
      await logout();
      // Redireciona para o login após 1.5 segundos
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (error) {
      console.error('Change password error:', error);
      toast.error('Erro ao alterar a senha. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/login');
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

  const passwordStrength = useMemo(() => {
    if (!newPassword) return null;
    return checkPasswordStrength(newPassword);
  }, [newPassword]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
          disabled={isSubmitting || isLoading}
        >
          {isSubmitting || isLoading ? 'Alterando senha...' : 'Alterar Senha'}
        </Button>

        {newPassword && passwordStrength && (
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
    </form>
  );
};

export default ChangePasswordForm;
