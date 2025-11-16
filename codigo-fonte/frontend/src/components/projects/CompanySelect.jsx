import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { companiesService } from '../../services/companiesService';

const CompanySelect = ({ value, onChange, companies }) => {
  const [search, setSearch] = useState('');
  const [filtered, setFiltered] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef();

  useEffect(() => {
    if (!search) {
      setFiltered([]);
      return;
    }
    setFiltered(
      companies.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()),
      ),
    );
  }, [search, companies]);

  useEffect(() => {
    const handleClickOutside = e => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = company => {
    onChange(company);
    setSearch(company.name);
    setShowDropdown(false);
  };

  const handleCreate = async () => {
    if (!search.trim()) return;
    setLoading(true);
    try {
      const newCompany = await companiesService.create({
        name: search.trim(),
        description: null,
        color: '#3B82F6', // default color
      });
      onChange({
        id: newCompany.id,
        name: newCompany.name,
        description: newCompany.description,
        colorHex: newCompany.colorHex,
      });
      setSearch(newCompany.name);
      setShowDropdown(false);
    } catch (err) {
      console.error('Erro ao criar empresa:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Empresa <span className="text-red-500">*</span>
      </label>

      <input
        type="text"
        value={search}
        onChange={e => {
          setSearch(e.target.value);
          setShowDropdown(true);
        }}
        onFocus={() => setShowDropdown(!!search)}
        placeholder="Digite o nome da empresa"
        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
        required
        disabled={loading}
      />

      {showDropdown && (
        <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg max-h-60 overflow-auto shadow-lg">
          {filtered.length > 0
            ? filtered.map(c => (
                <li
                  key={c.id}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSelect(c)}
                >
                  {c.name}
                </li>
              ))
            : search.trim() && (
                <li
                  className={`px-4 py-2 hover:bg-gray-100 cursor-pointer text-blue-600 font-medium ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  onClick={loading ? undefined : handleCreate}
                >
                  {loading ? 'Criando...' : `Criar Empresa "${search}"`}
                </li>
              )}
        </ul>
      )}
    </div>
  );
};

CompanySelect.propTypes = {
  value: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  companies: PropTypes.array.isRequired,
};

export default CompanySelect;
