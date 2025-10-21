'use client';

import { useState } from 'react';

interface ModeToggleProps {
  isModernMode: boolean;
  onToggle: (mode: boolean) => void;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export default function ModeToggle({ 
  isModernMode, 
  onToggle, 
  position = 'top-left' 
}: ModeToggleProps) {
  
  const getPositionClasses = () => {
    switch (position) {
      case 'top-left': return 'top-4 left-4';
      case 'top-right': return 'top-4 right-4';
      case 'bottom-left': return 'bottom-4 left-4';
      case 'bottom-right': return 'bottom-4 right-4';
      default: return 'top-4 left-4';
    }
  };

  return (
    <div className={`fixed ${getPositionClasses()} z-[9999]`}>
      <button
        onClick={() => {
          console.log('🔥 Toggle clicked! Current mode:', isModernMode, '→ New mode:', !isModernMode);
          onToggle(!isModernMode);
        }}
        className={`px-6 py-3 rounded-lg font-bold text-lg border-2 transition-all duration-300 shadow-lg hover:scale-105 ${
          isModernMode 
          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white border-transparent hover:from-blue-600 hover:to-purple-600' 
          : 'bg-white text-gray-700 border-gray-400 hover:bg-gray-50 hover:border-gray-500'
        }`}
        title={isModernMode ? 'Cambiar a diseño minimalista' : 'Cambiar a diseño moderno'}
      >
        <span className="flex items-center space-x-2">
          <span>{isModernMode ? '🎨' : '⚪'}</span>
          <span>{isModernMode ? 'MODERNO' : 'MINIMAL'}</span>
        </span>
      </button>
    </div>
  );
}