import React from 'react';
import { TypePill } from './TypePill';

interface TypeEffectivenessProps {
  weaknesses: { [key: string]: number };
  resistances: { [key: string]: number };
}

const sortEffectiveness = (effectiveness: { [key: string]: number }) => {
  return Object.entries(effectiveness).sort(([, a], [, b]) => b - a);
};

export const TypeEffectiveness: React.FC<TypeEffectivenessProps> = ({ weaknesses, resistances }) => {
  const sortedWeaknesses = sortEffectiveness(weaknesses);
  // FIX: Changed sort callback to avoid destructuring in arguments to fix type inference issues.
  const sortedResistances = Object.entries(resistances).sort((a, b) => a[1] - b[1]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
      <div className="bg-slate-700/50 p-4 rounded-lg">
        <h3 className="text-xl font-semibold mb-3 text-red-400">Weaknesses</h3>
        <div className="flex flex-wrap gap-2">
          {sortedWeaknesses.length > 0 ? (
            sortedWeaknesses.map(([type, multiplier]) => (
              <TypePill key={type} typeName={type} multiplier={multiplier} />
            ))
          ) : (
            <p className="text-slate-400 text-sm">None</p>
          )}
        </div>
      </div>
      <div className="bg-slate-700/50 p-4 rounded-lg">
        <h3 className="text-xl font-semibold mb-3 text-green-400">Resistances</h3>
        <div className="flex flex-wrap gap-2">
          {sortedResistances.length > 0 ? (
            sortedResistances.map(([type, multiplier]) => (
              <TypePill key={type} typeName={type} multiplier={multiplier} />
            ))
          ) : (
             <p className="text-slate-400 text-sm">None</p>
          )}
        </div>
      </div>
    </div>
  );
};
