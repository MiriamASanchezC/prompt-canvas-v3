'use client';

import { THEMES, ThemeKey } from './Canvas';

interface ThemeSelectorProps {
  onThemeSelect: (theme: ThemeKey) => void;
  onCancel: () => void;
  position: { x: number; y: number };
}

export default function ThemeSelector({ onThemeSelect, onCancel, position }: ThemeSelectorProps) {
  return (
    <div
      className="fixed z-50 bg-white rounded-lg shadow-xl border border-gray-200 p-2"
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      <div className="text-xs text-gray-500 mb-2 px-2">Elige un tema para la conexión:</div>
      <div className="grid grid-cols-2 gap-1">
        {Object.entries(THEMES).map(([key, theme]) => (
          <button
            key={key}
            onClick={() => onThemeSelect(key as ThemeKey)}
            className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-50 transition-colors text-sm"
          >
            <span className="text-lg">{theme.icon}</span>
            <span style={{ color: theme.color }} className="font-medium">
              {theme.name}
            </span>
          </button>
        ))}
      </div>
      <div className="border-t border-gray-100 mt-2 pt-2">
        <button
          onClick={onCancel}
          className="w-full text-xs text-gray-500 hover:text-gray-700 py-1"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
