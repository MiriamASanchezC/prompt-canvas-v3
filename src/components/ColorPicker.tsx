'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface ColorPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onColorSelect: (color: string) => void;
}

const NOTE_COLORS = [
  { id: 'yellow-light', color: '#FEF3C7', name: 'Amarillo Claro' },
  { id: 'yellow', color: '#FCD34D', name: 'Amarillo' },
  { id: 'orange-light', color: '#FED7AA', name: 'Naranja Claro' },
  { id: 'orange', color: '#FB923C', name: 'Naranja' },
  { id: 'pink-light', color: '#FBCFE8', name: 'Rosa Claro' },
  { id: 'pink', color: '#F472B6', name: 'Rosa' },
  { id: 'blue-light', color: '#BFDBFE', name: 'Azul Claro' },
  { id: 'blue', color: '#60A5FA', name: 'Azul' },
  { id: 'purple-light', color: '#C4B5FD', name: 'Morado Claro' },
  { id: 'purple', color: '#A78BFA', name: 'Morado' },
  { id: 'cyan-light', color: '#A5F3FC', name: 'Cian Claro' },
  { id: 'cyan', color: '#22D3EE', name: 'Cian' },
  { id: 'teal-light', color: '#99F6E4', name: 'Verde Agua Claro' },
  { id: 'teal', color: '#2DD4BF', name: 'Verde Agua' },
  { id: 'green-light', color: '#BBF7D0', name: 'Verde Claro' },
  { id: 'green', color: '#4ADE80', name: 'Verde' },
  { id: 'lime-light', color: '#D9F99D', name: 'Lima Claro' },
  { id: 'lime', color: '#84CC16', name: 'Lima' },
  { id: 'gray-light', color: '#F3F4F6', name: 'Gris Claro' },
  { id: 'gray-dark', color: '#374151', name: 'Gris Oscuro' },
];

export default function ColorPicker({ isOpen, onClose, onColorSelect }: ColorPickerProps) {
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleColorClick = (color: string) => {
    onColorSelect(color);
    onClose();
  };

  return (
    <>
      {/* Overlay para cerrar al hacer clic fuera */}
      <div 
        className="fixed inset-0 z-30" 
        onClick={onClose}
      />
      
      {/* Panel de colores */}
      <div className="fixed left-16 top-0 h-full bg-white border-r border-gray-200 shadow-lg z-40 w-64 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">Colores de Nota</h3>
            <p className="text-sm text-gray-500">Elige el color para tu post-it</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Grid de colores */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
            {NOTE_COLORS.map((colorOption) => (
              <button
                key={colorOption.id}
                onClick={() => handleColorClick(colorOption.color)}
                onMouseEnter={() => setHoveredColor(colorOption.id)}
                onMouseLeave={() => setHoveredColor(null)}
                className={`relative w-full h-20 rounded-xl border-2 transition-all duration-200 ${
                  hoveredColor === colorOption.id 
                    ? 'border-gray-400 scale-105 shadow-lg' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                style={{ backgroundColor: colorOption.color }}
              >
                {/* Efecto de paper/textura */}
                <div className="absolute inset-0 rounded-xl opacity-10 bg-gradient-to-br from-white to-transparent" />
                
                {/* Nombre del color en hover */}
                {hoveredColor === colorOption.id && (
                  <div className="absolute inset-x-0 bottom-0 p-2">
                    <div className="bg-black/70 text-white text-xs rounded px-2 py-1 text-center">
                      {colorOption.name}
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Footer con información */}
        <div className="p-4 border-t border-gray-100">
          <div className="text-xs text-gray-500 text-center">
            Haz clic en un color para crear tu nota
          </div>
        </div>
      </div>
    </>
  );
}