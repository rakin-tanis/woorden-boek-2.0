'use client'
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  className?: string;
}

/* export const Select: React.FC<SelectProps> = ({ children, className, ...props }) => {
  return (
    <select
      className={`rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}; */

interface SelectContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  selectedValue: string;
  setSelectedValue: (value: string) => void;
  placeholder?: string;
}

interface SelectProps {
  children: React.ReactNode;
  value: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
}

interface SelectTriggerProps {
  children: React.ReactNode;
  className?: string;
}

interface SelectValueProps {
  placeholder?: string;
}

interface SelectContentProps {
  children: React.ReactNode;
  className?: string;
}

interface SelectItemProps {
  children: React.ReactNode;
  value: string;
  className?: string;
}

const SelectContext = React.createContext<SelectContextType | undefined>(undefined);

const useSelectContext = () => {
  const context = React.useContext(SelectContext);
  if (context === undefined) {
    throw new Error('useSelectContext must be used within a Select provider');
  }
  return context;
};

export const Select: React.FC<SelectProps> = ({ 
  children, 
  value, 
  onValueChange, 
  placeholder 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current && 
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleValueChange = (newValue: string) => {
    setSelectedValue(newValue);
    onValueChange?.(newValue);
    setIsOpen(false);
  };

  const contextValue: SelectContextType = {
    isOpen,
    setIsOpen,
    selectedValue,
    setSelectedValue: handleValueChange,
    placeholder
  };

  return (
    <SelectContext.Provider value={contextValue}>
      <div ref={selectRef} className="relative">
        {children}
      </div>
    </SelectContext.Provider>
  );
};

export const SelectTrigger: React.FC<SelectTriggerProps> = ({ 
  children, 
  className 
}) => {
  const { isOpen, setIsOpen } = useSelectContext();

  return (
    <button
      type="button"
      className={`flex items-center justify-between w-full px-3 py-2 text-sm border rounded-lg bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        isOpen ? 'border-blue-500' : 'border-gray-300'
      } ${className || ''}`}
      onClick={() => setIsOpen(!isOpen)}
      aria-expanded={isOpen}
    >
      <span className="block truncate">
        {children}
      </span>
      <ChevronDown 
        className={`w-4 h-4 transition-transform duration-200 ${
          isOpen ? 'transform rotate-180' : ''
        }`} 
      />
    </button>
  );
};

export const SelectValue: React.FC<SelectValueProps> = ({ 
  placeholder 
}) => {
  const { selectedValue } = useSelectContext();
  
  return (
    <span 
      className={`block truncate ${!selectedValue ? 'text-gray-500' : ''}`}
      role="textbox"
      aria-label={placeholder}
    >
      {selectedValue || placeholder}
    </span>
  );
};

export const SelectContent: React.FC<SelectContentProps> = ({ 
  children, 
  className 
}) => {
  const { isOpen } = useSelectContext();

  if (!isOpen) return null;

  return (
    <div 
      className={`absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto focus:outline-none ${className || ''}`}
      role="listbox"
    >
      <div className="py-1">
        {children}
      </div>
    </div>
  );
};

export const SelectItem: React.FC<SelectItemProps> = ({ 
  children, 
  value, 
  className 
}) => {
  const { selectedValue, setSelectedValue } = useSelectContext();
  const isSelected = selectedValue === value;

  return (
    <div
      className={`px-3 py-2 text-sm cursor-pointer hover:bg-blue-50 flex items-center justify-between ${
        isSelected ? 'bg-blue-50 text-blue-600' : 'text-gray-900'
      } ${className || ''}`}
      onClick={() => setSelectedValue(value)}
      role="option"
      aria-selected={isSelected}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setSelectedValue(value);
        }
      }}
    >
      {children}
      {isSelected && (
        <svg 
          className="w-4 h-4 text-blue-600" 
          fill="none" 
          strokeWidth="2" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            d="M5 13l4 4L19 7" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      )}
    </div>
  );
};

export default Select;