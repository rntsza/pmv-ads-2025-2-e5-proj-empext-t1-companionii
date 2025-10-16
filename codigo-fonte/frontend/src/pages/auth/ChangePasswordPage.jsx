import { useSearchParams, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../../layouts';
import { ChangePasswordForm } from '../../components/forms';
import { useToast } from '../../hooks/useToast';

const ChangePasswordPage = () => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  const token = searchParams.get('token') || '';

  if (!token) {
    toast.error('Link inválido ou expirado. Solicite uma nova redefinição.');
    return navigate('/login');
  }

  return (
    <AuthLayout
      title="Gerenciamento Inteligente"
      subtitle="Gerencie projetos, organize tarefas diárias e gere relatórios automaticamente"
      formTitle="Alterar sua senha"
      formSubTitle="Digite sua senha atual e escolha uma nova senha"
    >
      <ChangePasswordForm token={token} />
    </AuthLayout>
  );
};

export default ChangePasswordPage;
