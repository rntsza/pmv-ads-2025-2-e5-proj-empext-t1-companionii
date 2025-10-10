import { useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from '../ui';

const COLORS = [
  { id: 'blue', value: '#3B82F6' },
  { id: 'green', value: '#10B981' },
  { id: 'orange', value: '#F59E0B' },
  { id: 'red', value: '#EF4444' },
  { id: 'purple', value: '#8B5CF6' },
  { id: 'cyan', value: '#06B6D4' },
  { id: 'deepOrange', value: '#FF5722' },
  { id: 'lime', value: '#84CC16' },
  { id: 'pink', value: '#EC4899' },
  { id: 'gray', value: '#6B7280' },
  { id: 'teal', value: '#14B8A6' },
  { id: 'violet', value: '#7C3AED' },
];

const ProjectForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    client: '',
    description: '',
    color: COLORS[0].value,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleColorSelect = (color) => {
    setFormData((prev) => ({
      ...prev,
      color,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
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
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
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
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none"
        />
      </div>

      {/* Cor do Projeto */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          <svg
            className="w-5 h-5 inline-block mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
            />
          </svg>
          Cor do Projeto
        </label>
        <div className="grid grid-cols-6 gap-3">
          {COLORS.map((color) => (
            <button
              key={color.id}
              type="button"
              onClick={() => handleColorSelect(color.value)}
              className={`w-12 h-12 rounded-xl transition-all duration-200 hover:scale-110 ${
                formData.color === color.value
                  ? 'ring-4 ring-offset-2 ring-gray-400 scale-110'
                  : ''
              }`}
              style={{ backgroundColor: color.value }}
              aria-label={`Selecionar cor ${color.id}`}
            />
          ))}
        </div>
      </div>

      {/* Botões */}
      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" size="medium" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary" size="medium">
          Criar Projeto
        </Button>
      </div>
    </form>
  );
};

ProjectForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default ProjectForm;
