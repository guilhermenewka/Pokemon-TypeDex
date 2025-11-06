
import React from 'react';
import type { Stat, Ability } from '../types';

interface PokemonStatsProps {
  stats: Stat[];
  abilities: Ability[];
}

const STAT_MAX_VALUES: { [key: string]: number } = {
  'hp': 255,
  'attack': 190,
  'defense': 230,
  'sp. atk': 194,
  'sp. def': 230,
  'speed': 200,
};

const STAT_COLORS: { [key: string]: string } = {
    'hp': 'bg-red-500',
    'attack': 'bg-orange-500',
    'defense': 'bg-yellow-500',
    'sp. atk': 'bg-blue-500',
    'sp. def': 'bg-green-500',
    'speed': 'bg-pink-500',
}

const StatBar: React.FC<{ stat: Stat }> = ({ stat }) => {
  const max = STAT_MAX_VALUES[stat.name.toLowerCase()] || 255;
  const percentage = Math.min((stat.value / max) * 100, 100);
  const color = STAT_COLORS[stat.name.toLowerCase()] || 'bg-slate-400';
  
  return (
    <div className="flex items-center gap-2 sm:gap-4 text-sm">
      <p className="w-1/4 capitalize text-slate-400 font-medium text-right">{stat.name}</p>
      <p className="w-8 text-left font-semibold">{stat.value}</p>
      <div className="w-full bg-slate-600 rounded-full h-2.5 flex-1">
        <div 
          className={`${color} h-2.5 rounded-full transition-all duration-500`} 
          style={{ width: `${percentage}%` }}
          aria-valuenow={stat.value}
          aria-valuemin={0}
          aria-valuemax={max}
          role="progressbar"
          aria-label={`${stat.name} stat value`}
        ></div>
      </div>
    </div>
  );
};

export const PokemonStats: React.FC<PokemonStatsProps> = ({ stats, abilities }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 animate-fade-in">
      <div className="lg:col-span-3 bg-slate-700/50 p-4 rounded-lg">
        <h3 className="text-xl font-semibold mb-3 text-yellow-400">Base Stats</h3>
        <div className="space-y-3">
          {stats.map(stat => <StatBar key={stat.name} stat={stat} />)}
        </div>
      </div>
      <div className="lg:col-span-2 bg-slate-700/50 p-4 rounded-lg">
        <h3 className="text-xl font-semibold mb-3 text-cyan-400">Abilities</h3>
        <ul className="space-y-2">
          {abilities.map(ability => (
            <li key={ability.name} className="capitalize text-slate-300 text-lg">
              {ability.name}
              {ability.isHidden && <span className="text-xs text-slate-400 ml-2 font-light italic">(Hidden Ability)</span>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
