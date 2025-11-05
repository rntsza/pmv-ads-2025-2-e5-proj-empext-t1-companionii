import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../../layouts';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useToast } from '../../hooks/useToast';
import { api } from '../../services/api';

/**
 * AcceptInvitePage - Página para aceitar convite e criar conta
 *
 * Recebe token via query param, valida e permite criar conta
 * Endpoint: POST /auth/accept-invite
 * Payload: { token, name, password }
 */
const AcceptInvitePage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const token = searchParams.get('token') || '';
  const inviteEmail = searchParams.get('email') || '';

  const [formData, setFormData] = useState({
    name: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      toast.error('Link de convite inválido ou expirado.');
      navigate('/login', { replace: true });
    }
  }, [token, navigate, toast]);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const validatePassword = password => {
    const errors = [];

    if (password.length < 8) {
      errors.push('mínimo 8 caracteres');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('uma letra minúscula');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('uma letra maiúscula');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('um número');
    }
    if (!/[^a-zA-Z0-9]/.test(password)) {
      errors.push('um símbolo especial');
    }

    return errors;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Nome completo é obrigatório';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Nome deve ter pelo menos 3 caracteres';
    }

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else {
      const passwordErrors = validatePassword(formData.password);
      if (passwordErrors.length > 0) {
        newErrors.password = `Senha deve conter: ${passwordErrors.join(', ')}`;
      }
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post('/auth/accept-invite', {
        token,
        name: formData.name.trim(),
        password: formData.password,
      });

      const authToken = response.data?.access_token;

      if (authToken) {
        toast.success('Conta criada com sucesso! Redirecionando...');

        setTimeout(() => {
          navigate(
            `/login?message=${encodeURIComponent('Conta criada com sucesso! Faça login para continuar.')}&type=success`,
            { replace: true }
          );
        }, 1500);
      } else {
        throw new Error('Token não recebido do servidor');
      }
    } catch (error) {
      console.error('Erro ao aceitar convite:', error);

      const errorMessage = error.response?.data?.message ||
                          error.message ||
                          'Erro ao criar conta. Verifique se o link é válido.';

      toast.error(errorMessage);
      setErrors({ submit: errorMessage });

      if (error.response?.status === 400) {
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 3000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Bem-vindo ao Companion"
      subtitle="Gerencie projetos, organize tarefas diárias e gere relatórios automaticamente"
      formTitle="Complete seu cadastro"
      formSubTitle="Você foi convidado para fazer parte da equipe"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Display (read-only) */}
        {inviteEmail && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 text-sm">
              {inviteEmail}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Este é o email associado ao seu convite
            </p>
          </div>
        )}

        {/* Name Input */}
        <Input
          label="Nome Completo"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Digite seu nome completo"
          error={errors.name}
          required
          autoFocus
        />

        {/* Password Input */}
        <Input
          label="Senha"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleInputChange}
          placeholder="Digite uma senha forte"
          error={errors.password}
          required
        />

        {/* Password Requirements */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-800">
          <p className="font-medium mb-1">A senha deve conter:</p>
          <ul className="list-disc list-inside space-y-0.5 ml-1">
            <li>Mínimo de 8 caracteres</li>
            <li>Pelo menos uma letra maiúscula</li>
            <li>Pelo menos uma letra minúscula</li>
            <li>Pelo menos um número</li>
            <li>Pelo menos um símbolo especial (!@#$%^&*)</li>
          </ul>
        </div>

        {/* Confirm Password Input */}
        <Input
          label="Confirmar Senha"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          placeholder="Digite a senha novamente"
          error={errors.confirmPassword}
          required
        />

        {/* Error Message */}
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {errors.submit}
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Criando conta...' : 'Criar Conta'}
        </Button>

        {/* Additional Info */}
        <div className="text-center text-xs text-gray-500 pt-2">
          Ao criar sua conta, você concorda com nossos termos de uso e política
          de privacidade.
        </div>
      </form>
    </AuthLayout>
  );
};

export default AcceptInvitePage;
