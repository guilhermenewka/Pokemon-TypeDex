
import React from 'react';
import { TYPE_COLORS } from '../constants';

interface TypePillProps {
  typeName: string;
  multiplier?: number;
}

export const TypePill: React.FC<TypePillProps> = ({ typeName, multiplier }) => {
  const colorClass = TYPE_COLORS[typeName] || 'bg-gray-500 text-white';

  const formatMultiplier = (value: number) => {
    if (value === 0.5) return '½x';
    if (value === 0.25) return '¼x';
    return `${value}x`;
  };

  return (
    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold capitalize shadow ${colorClass}`}>
      <span>{typeName}</span>
      {multiplier !== undefined && (
        <span className="text-xs opacity-80 font-bold">{formatMultiplier(multiplier)}</span>
      )}
    </div>
  );
};
