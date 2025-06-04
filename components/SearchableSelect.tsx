
import React, { useState, useEffect, useRef } from 'react';
import { SelectOption } from '../types';
import { ChevronDownIcon, SearchIcon, XMarkIcon } from '../constants.tsx';

// Base props common to both single and multi-select
interface SearchableSelectPropsBase {
  label: string;
  options: SelectOption[];
  placeholder?: string;
  isMultiSelect?: boolean;
  allowClear?: boolean;
  showSearch?: boolean; // New prop
  disabled?: boolean; // Added disabled prop
}

// Props for single-select mode
interface SingleSearchableSelectProps extends SearchableSelectPropsBase {
  isMultiSelect?: false; // Explicitly false or undefined
  value: string;
  onChange: (value: string) => void;
}

// Props for multi-select mode
interface MultiSearchableSelectProps extends SearchableSelectPropsBase {
  isMultiSelect: true; // Explicitly true
  value: string[];
  onChange: (value: string[]) => void;
}

// Union type for all possible props
type SearchableSelectProps = SingleSearchableSelectProps | MultiSearchableSelectProps;

const SearchableSelect: React.FC<SearchableSelectProps> = (props) => {
  const { label, options, placeholder = 'Select...', allowClear = true, showSearch = true, disabled = false } = props; // Added showSearch, default to true, added disabled
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (!disabled) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      if (!disabled) {
        document.removeEventListener("mousedown", handleClickOutside);
      }
    };
  }, [wrapperRef, disabled]);

  const filteredOptions = showSearch ? options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  ) : options;
  
  let displayLabel = placeholder;
  let hasSelection = false;

  if (props.isMultiSelect) { 
    const currentValue = props.value; 
    if (currentValue.length === 1) {
      displayLabel = options.find(opt => opt.value === currentValue[0])?.label || placeholder;
      hasSelection = true;
    } else if (currentValue.length > 0) {
      displayLabel = `${currentValue.length} items selected`;
      hasSelection = true;
    }
  } else { 
    const currentValue = props.value; 
    if (currentValue) {
      displayLabel = options.find(opt => opt.value === currentValue)?.label || placeholder;
      hasSelection = true;
    }
  }


  const handleOptionToggle = (optionValue: string) => {
    if (disabled) return;
    if (props.isMultiSelect) { 
      const currentSelected = [...props.value]; 
      const index = currentSelected.indexOf(optionValue);
      if (index > -1) {
        currentSelected.splice(index, 1);
      } else {
        currentSelected.push(optionValue);
      }
      (props as MultiSearchableSelectProps).onChange(currentSelected);
    } else { 
      (props as SingleSearchableSelectProps).onChange(optionValue); 
      setIsOpen(false); 
    }
  };

  const handleClearSelection = (event: React.MouseEvent) => {
    if (disabled) return;
    event.stopPropagation(); 
    if (props.isMultiSelect) { 
      (props as MultiSearchableSelectProps).onChange([]); 
    } else { 
      (props as SingleSearchableSelectProps).onChange(''); 
    }
    setSearchTerm(''); 
  };

  return (
    <div className="relative w-full" ref={wrapperRef}>
      {/* Render label only if it's not an empty string, otherwise it takes up space */}
      {label && <label className={`block text-xs font-medium mb-1 ${disabled ? 'text-gray-400' : 'text-gray-700'}`}>{label}</label>}
      <div className="relative">
        <button
          type="button"
          className={`w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm flex items-center justify-between
            ${disabled ? 'bg-gray-50 cursor-not-allowed text-gray-400' : 'cursor-default'}`}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          disabled={disabled}
        >
          <span className="block truncate">{displayLabel}</span>
          <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
             <ChevronDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </span>
        </button>
        {allowClear && hasSelection && !disabled && (
          <button
            type="button"
            onClick={handleClearSelection}
            className="absolute inset-y-0 right-6 pr-3 flex items-center z-10" 
            aria-label="Clear selection"
            disabled={disabled}
          >
            <XMarkIcon className="h-4 w-4 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      {isOpen && !disabled && (
        <div className="absolute z-20 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
          {showSearch && (
            <div className="p-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  aria-label="Search options"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    aria-label="Clear search"
                  >
                    <XMarkIcon className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>
            </div>
          )}
          {filteredOptions.length === 0 && searchTerm !== '' && showSearch ? (
            <div className="px-4 py-2 text-sm text-gray-700">No options found.</div>
          ) : (
            filteredOptions.map((option) => {
              let isSelected = false;
              if (props.isMultiSelect) { 
                isSelected = props.value.includes(option.value); 
              } else { 
                isSelected = props.value === option.value; 
              }
              return (
                <div
                  key={option.value}
                  className={`cursor-default select-none relative py-2 pl-3 pr-9 text-sm hover:bg-blue-50 flex items-center ${isSelected ? 'bg-blue-100 text-blue-700' : 'text-gray-900'} ${showSearch ? '' : 'pl-4'}`} // Adjust padding if no search
                  onClick={() => handleOptionToggle(option.value)}
                  role="option"
                  aria-selected={isSelected}
                >
                  {props.isMultiSelect && ( 
                    <input
                      type="checkbox"
                      checked={isSelected}
                      readOnly 
                      className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                    />
                  )}
                  <span className={`block truncate ${isSelected ? 'font-semibold' : 'font-normal'}`}>
                    {option.label}
                  </span>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;