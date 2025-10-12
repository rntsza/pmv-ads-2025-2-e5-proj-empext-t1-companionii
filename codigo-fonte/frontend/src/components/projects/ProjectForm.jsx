import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button } from '../ui';

// Adicionamos a nova propriedade 'initialData'
const ProjectForm = ({ onSubmit, onCancel, initialData = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    client: '',
    description: '',
    color: '#3B82F6',
  });

  // Este 'useEffect' preenche o formulário quando recebe dados iniciais
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

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Determina se estamos no modo de edição
  const isEditing = !!initialData;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* ... (o resto do formulário continua igual) ... */}
      <div><label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Nome do Projeto <span className="text-red-500">*</span></label><input type="text" id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Digite o nome do projeto" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent" /></div>
      <div><label htmlFor="client" className="block text-sm font-medium text-gray-700 mb-2">Cliente <span className="text-red-500">*</span></label><input type="text" id="client" name="client" value={formData.client} onChange={handleChange} placeholder="Digite o nome do cliente" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent" /></div>
      <div><label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">Descrição</label><textarea id="description" name="description" value={formData.description} onChange={handleChange} placeholder="Descreva o projeto (opcional)" rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none" /></div>
      
      {/* Botões com texto dinâmico */}
      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancelar</Button>
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
  initialData: PropTypes.object, // Adicionamos a nova prop
};

export default ProjectForm;
