import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Button } from '../ui';
import { projectsService } from '../../services/projectsService';

const toDateInputValue = value => {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const normalizeStatusToUi = s => {
  if (!s) return 'todo';
  const map = {
    TODO: 'todo',
    IN_PROGRESS: 'in-progress',
    REVIEW: 'review',
    DONE: 'done',
  };
  return map[s] || s;
};

const normalizePriorityToUi = p => {
  if (!p) return 'medium';
  const set = new Set([
    'low',
    'medium',
    'high',
    'urgent',
    'LOW',
    'MEDIUM',
    'HIGH',
    'URGENT',
  ]);
  if (!set.has(p)) return 'medium';
  return String(p).toLowerCase();
};

const toHours = minutes => {
  return (minutes / 60).toFixed(0);
};

const TaskForm = ({ onSubmit, onCancel, initialData = null }) => {
  const [projects, setProjects] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [availableTags, setAvailableTags] = useState([]);
  const [showTagMenu, setShowTagMenu] = useState(false);
  const tagMenuRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    projectId: '',
    status: 'todo',
    priority: 'medium',
    dueDate: '',
    estimatedHours: '',
    tags: [],
  });

  const normalized = s => s.toLowerCase().trim();
  const existingNames = availableTags.map(t => t.name);
  const filteredSuggestions = availableTags
    .filter(t => normalized(t.name).includes(normalized(tagInput)))
    .slice(0, 10);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'projectId' ? { tags: [] } : {}),
    }));
  };

  const addTag = name => {
    if (!name) return;
    const clean = name.trim();
    if (!clean) return;
    setFormData(prev => {
      if (prev.tags.includes(clean)) return prev;
      return { ...prev, tags: [...prev.tags, clean] };
    });
    setTagInput('');
    setShowTagMenu(false);
  };

  const handleAddTag = () => addTag(tagInput);

  const handleTagKeyDown = e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(tagInput);
    } else if (e.key === 'ArrowDown') {
      setShowTagMenu(true);
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (initialData) {
      onSubmit(initialData.id, formData);
    } else {
      onSubmit(formData);
    }
  };

  const handleRemoveTag = tagToRemove => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  useEffect(() => {
    (async () => {
      const list = await projectsService.listAllSelect();
      setProjects((list || []).map(p => ({ id: p.id, name: p.name })));
    })();
  }, []);

  useEffect(() => {
    if (!initialData) return;
    console.log({ initialData });

    setFormData({
      title: initialData.title || '',
      description: initialData.description || '',
      projectId: initialData.projectId || '',
      status: normalizeStatusToUi(initialData.status) || 'todo',
      priority: normalizePriorityToUi(initialData.priority) || 'medium',
      dueDate:
        typeof initialData.dueDate === 'string' &&
        /^\d{4}-\d{2}-\d{2}$/.test(initialData.dueDate)
          ? initialData.dueDate
          : toDateInputValue(
              initialData.dueDateRaw || initialData.dueDate || null,
            ),
      estimatedHours:
        initialData.estimatedMin === 0 || initialData.estimatedMin
          ? toHours(initialData.estimatedMin)
          : '',
      // actualHours:
      //   initialData.actualMin === 0 || initialData.actualMin
      //     ? toHours(initialData.actualMin)
      //     : '',
      tags: Array.isArray(initialData.tags) ? initialData.tags : [],
    });
  }, [initialData]);

  useEffect(() => {
    (async () => {
      if (!formData.projectId) {
        setAvailableTags([]);
        return;
      }
      const tags = await projectsService.listTagsByProject(
        formData.projectId,
        '',
      );
      setAvailableTags(tags || []);
    })();
  }, [formData.projectId]);

  useEffect(() => {
    const onClickOutside = e => {
      if (tagMenuRef.current && !tagMenuRef.current.contains(e.target)) {
        setShowTagMenu(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Título */}
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Título <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Digite o título da tarefa"
          required
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
        />
      </div>

      {/* Descrição */}
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
          placeholder="Descreva a tarefa (opcional)"
          rows={3}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none"
        />
      </div>

      {/* Projeto e Status */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="projectId"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Projeto <span className="text-red-500">*</span>
          </label>
          <select
            id="projectId"
            name="projectId"
            value={formData.projectId}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent appearance-none bg-white"
          >
            <option value="">Selecione um projeto</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent appearance-none bg-white"
          >
            <option value="todo">A Fazer</option>
            <option value="review">Revisão</option>
            <option value="in-progress">Em Progresso</option>
            <option value="done">Concluído</option>
          </select>
        </div>
      </div>

      {/* Prioridade e Data de Vencimento */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="priority"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Prioridade
          </label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent appearance-none bg-white"
          >
            <option value="low">Baixa</option>
            <option value="medium">Média</option>
            <option value="high">Alta</option>
            <option value="urgent">Urgente</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="dueDate"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Data de Vencimento
          </label>
          <input
            type="date"
            id="dueDate"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          />
        </div>
      </div>

      {/* Horas Estimadas e Reais */}
      <div>
        <div>
          <label
            htmlFor="estimatedHours"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Horas Estimadas
          </label>
          <input
            type="number"
            id="estimatedHours"
            name="estimatedHours"
            value={formData.estimatedHours}
            onChange={handleChange}
            placeholder="Ex: 3"
            step="0.5"
            min="0"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          />
        </div>
        {/* <div>
          <label
            htmlFor="actualHours"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Horas Reais
          </label>
          <input
            type="number"
            id="actualHours"
            name="actualHours"
            value={formData.actualHours}
            onChange={handleChange}
            placeholder="Ex: 3"
            step="0.5"
            min="0"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          />
        </div> */}
      </div>

      {/* Tags */}
      <div ref={tagMenuRef} className="relative">
        <label
          htmlFor="tagInput"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Tags
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            id="tagInput"
            value={tagInput}
            disabled={!formData.projectId}
            onFocus={() => formData.projectId && setShowTagMenu(true)}
            onChange={e => {
              setTagInput(e.target.value);
              setShowTagMenu(true);
            }}
            onKeyDown={handleTagKeyDown}
            placeholder={
              formData.projectId
                ? 'Digite para buscar/criar...'
                : 'Selecione um projeto primeiro'
            }
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent disabled:bg-gray-100"
          />
          <button
            type="button"
            onClick={handleAddTag}
            disabled={!tagInput.trim() || !formData.projectId}
            className="px-4 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
            aria-label="Adicionar tag"
          >
            +
          </button>
        </div>

        {showTagMenu &&
          formData.projectId &&
          (filteredSuggestions.length > 0 || tagInput.trim()) && (
            <div className="absolute z-20 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-56 overflow-auto">
              {filteredSuggestions.map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => addTag(t.name)}
                  className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
                  title={t.name}
                >
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: t.colorHex || '#22c55e' }}
                  />
                  <span className="text-sm text-gray-800">{t.name}</span>
                </button>
              ))}

              {tagInput.trim() &&
                !existingNames
                  .map(normalized)
                  .includes(normalized(tagInput)) && (
                  <button
                    type="button"
                    onClick={() => addTag(tagInput)}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 border-t border-gray-100"
                  >
                    <span className="text-sm text-gray-700">
                      Criar “{tagInput.trim()}”
                    </span>
                  </button>
                )}
            </div>
          )}

        {formData.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {formData.tags.map((tag, index) => (
              <span
                key={`${tag}-${index}`}
                className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:text-red-600 cursor-pointer"
                  aria-label={`Remover tag ${tag}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Botões */}
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary">
          {initialData ? 'Salvar Alterações' : 'Criar Tarefa'}
        </Button>
      </div>
    </form>
  );
};

TaskForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  initialData: PropTypes.object, // quando presente, preenche o form para edição
};

export default TaskForm;
