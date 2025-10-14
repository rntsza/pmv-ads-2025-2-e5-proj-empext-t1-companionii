import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button } from '../ui';


const PROJECT_COLORS = [
  { name: 'Azul', value: '#3B82F6' },
  { name: 'Verde', value: '#10B981' },
  { name: 'Laranja', value: '#F59E0B' },
  { name: 'Vermelho', value: '#EF4444' },
  { name: 'Roxo', value: '#8B5CF6' },
  { name: 'Ciano', value: '#06B6D4' },
  { name: 'Laranja Escuro', value: '#F97316' },
  { name: 'Lima', value: '#84CC16' },
  { name: 'Rosa', value: '#EC4899' },
  { name: 'Cinza', value: '#6B7280' },
  { name: 'Turquesa', value: '#14B8A6' },
  { name: 'Roxo Escuro', value: '#A855F7' },
];


const ProjectForm = ({ onSubmit, onCancel, initialData = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    client: '',
    description: '',
    color: '#3B82F6',
  });

  
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        client: initialData.client || '',
        description: initialData.description || '',
        color: initialData.color || '#3B82F6',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleColorSelect = (color) => {
    setFormData((prev) => ({ ...prev, color }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

 
  const isEditing = !!initialData;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Nome do Projeto */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          Nome do Projeto <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Digite o nome do projeto"
          required
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
        />
      </div>

      {/* Cliente */}
      <div>
        <label htmlFor="client" className="block text-sm font-medium text-gray-700 mb-2">
          Cliente <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="client"
          name="client"
          value={formData.client}
          onChange={handleChange}
          placeholder="Digite o nome do cliente"
          required
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
        />
      </div>

      {/* Descrição */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Descrição
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Descreva o projeto (opcional)"
          rows={3}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none"
        />
      </div>

      {/* Seletor de Cor */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
          Cor do Projeto
        </label>
        <div className="grid grid-cols-6 gap-3">
          {PROJECT_COLORS.map((colorOption) => (
            <button
              key={colorOption.value}
              type="button"
              onClick={() => handleColorSelect(colorOption.value)}
              className={`w-20 h-20 aspect-square rounded-lg transition-all ${
                formData.color === colorOption.value
                  ? 'ring-2 ring-offset-2 ring-gray-900 scale-110'
                  : 'hover:scale-105'
              }`}
              style={{ backgroundColor: colorOption.value }}
              title={colorOption.name}
              aria-label={`Selecionar cor ${colorOption.name}`}
            />
          ))}
        </div>
      </div>

      {/* Botões */}
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary">
          {isEditing ? 'Salvar Alterações' : 'Criar Projeto'}
        </Button>
      </div>
    </form>
  );
};

ProjectForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  initialData: PropTypes.object, 
};

export default ProjectForm;
