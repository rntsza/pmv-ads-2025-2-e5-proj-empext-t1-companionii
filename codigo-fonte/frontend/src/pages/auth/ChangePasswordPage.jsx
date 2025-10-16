import { AuthLayout } from '../../layouts';
import { ChangePasswordForm } from '../../components/forms';

const ChangePasswordPage = () => {

  return (
    <AuthLayout
      title="Gerenciamento Inteligente"
      subtitle="Gerencie projetos, organize tarefas diárias e gere relatórios automaticamente"
      formTitle="Alterar sua senha"
      formSubTitle="Digite sua senha atual e escolha uma nova senha"
    >
      <ChangePasswordForm />
    </AuthLayout>
  );
};

export default ChangePasswordPage;
