import { useState, useMemo } from 'react';

const SelectComponent = ({ onSelect, name, options }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredOptions = useMemo(() => {
    return options.filter(option =>
      option.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, options]);

  const handleSelect = (option) => {
    setSelectedOption(option);
    onSelect(option);
    setIsOpen(false); // Close the dropdown after selection
  };

  return (
    <div className="relative w-full max-w-xs">
      <div
        className="input input-bordered w-full max-w-xs flex items-center justify-between cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <input
          type="text"
          value={selectedOption || searchTerm}
          onChange={e => {
            setSearchTerm(e.target.value);
            setSelectedOption(''); // Clear selected option when typing
          }}
          placeholder="Search..."
          className="w-full outline-none"
          onFocus={() => setIsOpen(true)}
        />
        <span className="ml-2">{isOpen ? '▲' : '▼'}</span>
      </div>
      {isOpen && (
        <div className="absolute z-10 w-full max-w-xs bg-white border border-gray-300 shadow-lg">
          {filteredOptions.map(option => (
            <div
              key={option}
              className="p-2 cursor-pointer hover:bg-gray-100"
              onClick={() => handleSelect(option)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SelectComponent;
