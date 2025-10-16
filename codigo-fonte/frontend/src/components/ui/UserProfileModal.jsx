import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';
import Input from './Input';
import Button from './Button';

/**
 * UserProfileModal - Modal para visualizar e editar perfil do usuário
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Controla visibilidade do modal
 * @param {Function} props.onClose - Callback ao fechar modal
 * @param {Object} props.user - Dados do usuário
 * @param {Function} props.onSave - Callback ao salvar alterações
 */
const UserProfileModal = ({ isOpen, onClose, user, onSave }) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    avatar: user?.avatar || '',
  });
  const [errors, setErrors] = useState({});

  // Atualiza formData quando user muda
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        avatar: user.avatar || '',
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Limpa erro do campo quando usuário começa a digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.email?.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (formData.avatar?.trim() && !isValidUrl(formData.avatar)) {
      newErrors.avatar = 'URL inválida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await onSave(formData);
      setIsEditing(false);
      onClose();
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      setErrors({
        submit: error.message || 'Erro ao salvar perfil. Tente novamente.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Restaura dados originais
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      avatar: user?.avatar || '',
    });
    setErrors({});
    setIsEditing(false);
  };

  const handleClose = () => {
    handleCancel();
    onClose();
  };

  const handleChangePassword = () => {
    onClose();
    navigate('/change-password');
  };

  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length === 1) {
      return parts[0].substring(0, 2).toUpperCase();
    }
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Perfil do Usuário" size="small">
      <div className="space-y-6">
        {/* Avatar Preview */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-800 to-gray-600 flex items-center justify-center overflow-hidden">
            {formData.avatar ? (
              <img
                src={formData.avatar}
                alt={formData.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : (
              <span className="text-white text-2xl font-medium">
                {getInitials(formData.name)}
              </span>
            )}
            <div className="hidden w-full h-full items-center justify-center bg-gradient-to-br from-gray-800 to-gray-600">
              <span className="text-white text-2xl font-medium">
                {getInitials(formData.name)}
              </span>
            </div>
          </div>
        </div>

        {/* Avatar URL Input */}
        <div>
          <Input
            label="URL do Avatar"
            name="avatar"
            type="url"
            value={formData.avatar}
            onChange={handleInputChange}
            placeholder="https://exemplo.com/avatar.jpg"
            disabled={!isEditing}
            error={errors.avatar}
          />
          <p className="text-xs text-gray-500 mt-1">
            Cole a URL de uma imagem para usar como avatar
          </p>
        </div>

        {/* Name Input */}
        <div>
          <Input
            label="Nome"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Seu nome completo"
            disabled={!isEditing}
            error={errors.name}
            required
          />
        </div>

        {/* Email Input */}
        <div>
          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="seu@email.com"
            disabled={!isEditing}
            error={errors.email}
            required
          />
        </div>

        {/* Password Change Link */}
        {!isEditing && (
          <div className="border-t border-gray-200 pt-6">
            <Button
              variant="outline"
              onClick={handleChangePassword}
              className="w-full"
            >
              Alterar Senha
            </Button>
          </div>
        )}

        {/* Error Message */}
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {errors.submit}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          {!isEditing ? (
            <>
              <Button
                variant="primary"
                onClick={() => setIsEditing(true)}
                className="flex-1"
              >
                Editar Perfil
              </Button>
              <Button
                variant="outline"
                onClick={handleClose}
                className="flex-1"
              >
                Fechar
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="primary"
                onClick={handleSave}
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? 'Salvando...' : 'Salvar'}
              </Button>
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
                className="flex-1"
              >
                Cancelar
              </Button>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};

UserProfileModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  user: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    avatar: PropTypes.string,
  }),
  onSave: PropTypes.func.isRequired,
};

// Helper function
function isValidUrl(string) {
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export default UserProfileModal;
