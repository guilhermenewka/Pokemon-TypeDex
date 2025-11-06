
import React, { useState, useEffect, useRef } from 'react';
import type { PokemonListItem } from '../types';

interface SearchBarProps {
  pokemonList: PokemonListItem[];
  onPokemonSelect: (name: string) => void;
  disabled?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ pokemonList, onPokemonSelect, disabled }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<PokemonListItem[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    if (value.length > 0) {
      const filteredSuggestions = pokemonList
        .filter(p => p.name.toLowerCase().startsWith(value.toLowerCase()))
        .slice(0, 5);
      setSuggestions(filteredSuggestions);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      onPokemonSelect('');
    }
  };

  const handleSuggestionClick = (pokemon: PokemonListItem) => {
    setQuery(pokemon.name);
    setSuggestions([]);
    setShowSuggestions(false);
    onPokemonSelect(pokemon.name);
  };

  return (
    <div className="relative" ref={searchContainerRef}>
      <input
        type="text"
        value={query}
        onChange={handleChange}
        onFocus={() => query.length > 0 && setShowSuggestions(true)}
        placeholder="E.g. Pikachu"
        disabled={disabled}
        className="w-full px-4 py-3 bg-slate-800 border-2 border-slate-600 rounded-lg text-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors"
      />
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 bg-slate-800 border border-slate-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map(pokemon => (
            <li
              key={pokemon.name}
              onClick={() => handleSuggestionClick(pokemon)}
              className="px-4 py-3 cursor-pointer hover:bg-slate-700 transition-colors capitalize"
            >
              {pokemon.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
