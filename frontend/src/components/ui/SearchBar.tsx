import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onSearch?: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, placeholder = 'Search...', onSearch }) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch();
    }
  };

  return (
    <div className={`relative flex items-center w-full transition-all duration-200 rounded-lg border bg-white ${isFocused ? 'border-cf-green ring-2 ring-cf-green/20' : 'border-cf-border'}`}>
      <Search className="absolute left-3 w-5 h-5 text-gray-400" />
      <input
        type="text"
        className="w-full pl-10 pr-10 py-2.5 bg-transparent text-cf-text-primary focus:outline-none placeholder-gray-400"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={handleKeyDown}
      />
      {value && (
        <button 
          onClick={() => onChange('')}
          className="absolute right-3 p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
