import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import CompanySelect from './CompanySelect';

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

const ProjectForm = ({
  onSubmit,
  onCancel,
  initialData = null,
  companies = [],
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#3B82F6',
    company: null,
  });

  useEffect(() => {
    if (!initialData) return;

    let selectedCompany = null;

    if (initialData.companyId && companies.length > 0) {
      selectedCompany =
        companies.find(c => c.id === initialData.companyId) || null;
    } else if (initialData.clientName) {
      selectedCompany = { id: null, name: initialData.clientName };
    } else if (initialData.company) {
      selectedCompany = initialData.company;
    }

    console.log('initialData:', initialData);
    console.log('selectedCompany:', selectedCompany);
    setFormData({
      name: initialData.name || '',
      description: initialData.description || '',
      color: initialData.color || '#3B82F6',
      company: selectedCompany,
    });
  }, [initialData, companies]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleColorSelect = color => {
    setFormData(prev => ({ ...prev, color }));
  };

  const handleSubmit = e => {
    e.preventDefault();

    const payload = {
      name: formData.name,
      description: formData.description,
      color: formData.color,
      companyId: formData.company?.id ?? null,
      client: formData.company?.id ? null : (formData.company?.name ?? null),
    };

    onSubmit(payload);
  };

  const isEditing = !!initialData;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
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

      <CompanySelect
        value={
          formData.company?.id
            ? companies.find(c => c.id === formData.company.id) ||
              formData.company
            : formData.company
        }
        onChange={company => setFormData(prev => ({ ...prev, company }))}
        companies={companies}
      />

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
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

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
          Cor do Projeto
        </label>
        <div className="grid grid-cols-6 gap-3">
          {PROJECT_COLORS.map(colorOption => (
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
            />
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2.5 bg-black text-white rounded-lg font-medium hover:bg-gray-900"
        >
          {isEditing ? 'Salvar Alterações' : 'Criar Projeto'}
        </button>
      </div>
    </form>
  );
};

ProjectForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  initialData: PropTypes.object,
  companies: PropTypes.array,
};

export default ProjectForm;
