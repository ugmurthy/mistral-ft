import  { useState, useMemo } from 'react';

const SelectComponent = ({ onSelect, options }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);

  const filteredOptions = useMemo(() => {
    return options.filter(option =>
      option.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, options]);

  const handleSelect = (option) => {
    setSelectedOption(option);
    onSelect(option);
  };

  return (
    <div>
      <input
      className='input input-bordered w-full max-w-xs'
        type="text"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        placeholder="Search..."
      />
      <select className="select w-full max-w-xs" value={selectedOption} onChange={e => handleSelect(e.target.value)}>
        {filteredOptions.map(option => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectComponent;