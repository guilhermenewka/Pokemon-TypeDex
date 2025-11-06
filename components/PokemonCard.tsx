
import React, { useState } from 'react';
import type { ProcessedPokemon } from '../types';
import { TypeEffectiveness } from './TypeEffectiveness';
import { PokemonStats } from './PokemonStats';
import { TypePill } from './TypePill';

interface PokemonCardProps {
  pokemon: ProcessedPokemon;
}

export const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon }) => {
  const [activeTab, setActiveTab] = useState<'effectiveness' | 'stats'>('effectiveness');

  return (
    <div className="bg-slate-800 rounded-xl shadow-lg p-4 sm:p-6 border border-slate-700 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left">
        <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-6">
          <img
            src={pokemon.spriteUrl}
            alt={pokemon.name}
            className="w-32 h-32 sm:w-40 sm:h-40 bg-slate-700 rounded-full p-2"
          />
        </div>
        <div className="flex-grow">
          <p className="text-sm text-slate-400">#{pokemon.id.toString().padStart(3, '0')}</p>
          <h2 className="text-3xl sm:text-4xl font-bold capitalize text-white mb-2">{pokemon.name}</h2>
          <div className="flex justify-center sm:justify-start gap-2">
            {pokemon.types.map(type => (
              <TypePill key={type} typeName={type} />
            ))}
          </div>
        </div>
      </div>
      
      <div className="mt-6 border-b border-slate-700 flex">
        <button
          onClick={() => setActiveTab('effectiveness')}
          className={`px-4 py-2 text-sm font-medium transition-colors focus:outline-none ${
            activeTab === 'effectiveness'
              ? 'border-b-2 border-yellow-400 text-yellow-400'
              : 'text-slate-400 hover:text-white'
          }`}
          aria-pressed={activeTab === 'effectiveness'}
        >
          Effectiveness
        </button>
        <button
          onClick={() => setActiveTab('stats')}
          className={`px-4 py-2 text-sm font-medium transition-colors focus:outline-none ${
            activeTab === 'stats'
              ? 'border-b-2 border-yellow-400 text-yellow-400'
              : 'text-slate-400 hover:text-white'
          }`}
          aria-pressed={activeTab === 'stats'}
        >
          Stats & Abilities
        </button>
      </div>

      <div className="mt-4">
        {activeTab === 'effectiveness' && (
          <TypeEffectiveness weaknesses={pokemon.weaknesses} resistances={pokemon.resistances} />
        )}
        {activeTab === 'stats' && (
          <PokemonStats stats={pokemon.stats} abilities={pokemon.abilities} />
        )}
      </div>
    </div>
  );
};
