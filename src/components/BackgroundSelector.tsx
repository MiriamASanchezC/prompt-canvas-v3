'use client';

import { useState } from 'react';
import { 
  Palette, 
  Circle, 
  Square, 
  Minus, 
  Grid3X3, 
  Layers,
  Moon,
  Sun
} from 'lucide-react';

export type BackgroundColor = 'white' | 'black' | 'cream' | 'gray';
export type BackgroundStyle = 'solid' | 'notebook' | 'dots' | 'grid';

export type BackgroundType = `${BackgroundColor}-${BackgroundStyle}`;

interface BackgroundSelectorProps {
  currentBackground: BackgroundType;
  onBackgroundChange: (background: BackgroundType) => void;
}

const BACKGROUND_COLORS = [
  {
    id: 'white' as BackgroundColor,
    name: 'Blanco',
    icon: Sun,
    description: 'Fondo blanco limpio',
    color: '#ffffff'
  },
  {
    id: 'cream' as BackgroundColor,
    name: 'Cremoso',
    icon: Circle,
    description: 'Tono papel natural',
    color: '#f8f6f0'
  },
  {
    id: 'gray' as BackgroundColor,
    name: 'Gris',
    icon: Square,
    description: 'Gris suave',
    color: '#f5f5f5'
  },
  {
    id: 'black' as BackgroundColor,
    name: 'Negro',
    icon: Moon,
    description: 'Fondo oscuro',
    color: '#1a1a1a'
  }
];

const BACKGROUND_STYLES = [
  {
    id: 'solid' as BackgroundStyle,
    name: 'Liso',
    icon: Square,
    description: 'Sin patrón',
    className: 'solid'
  },
  {
    id: 'notebook' as BackgroundStyle,
    name: 'Cuaderno',
    icon: Minus,
    description: 'Rayas horizontales',
    className: 'notebook'
  },
  {
    id: 'dots' as BackgroundStyle,
    name: 'Puntos',
    icon: Circle,
    description: 'Patrón de puntos',
    className: 'dots'
  },
  {
    id: 'grid' as BackgroundStyle,
    name: 'Cuadrícula',
    icon: Grid3X3,
    description: 'Grid fino',
    className: 'grid'
  }
];

export default function BackgroundSelector({ 
  currentBackground, 
  onBackgroundChange 
}: BackgroundSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentColor, setCurrentColor] = useState<BackgroundColor>('white');
  const [currentStyle, setCurrentStyle] = useState<BackgroundStyle>('solid');

  // Parse current background
  const [bgColor, bgStyle] = currentBackground.split('-') as [BackgroundColor, BackgroundStyle];

  const handleColorChange = (color: BackgroundColor) => {
    setCurrentColor(color);
    onBackgroundChange(`${color}-${bgStyle}` as BackgroundType);
  };

  const handleStyleChange = (style: BackgroundStyle) => {
    setCurrentStyle(style);
    onBackgroundChange(`${bgColor}-${style}` as BackgroundType);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        title="Cambiar fondo"
      >
        <Palette className="w-4 h-4" />
        <span className="text-sm font-medium">Fondo</span>
      </button>

      {isOpen && (
        <>
          {/* Overlay para cerrar */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Selector */}
          <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-20">
            {/* Colores */}
            <div className="px-3 py-2 border-b border-gray-100">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Color de fondo</h3>
              <div className="grid grid-cols-2 gap-2">
                {BACKGROUND_COLORS.map((color) => {
                  const Icon = color.icon;
                  const isSelected = bgColor === color.id;
                  
                  return (
                    <button
                      key={color.id}
                      onClick={() => handleColorChange(color.id)}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm transition-colors ${
                        isSelected
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <div 
                        className="w-4 h-4 rounded-full border border-gray-300"
                        style={{ backgroundColor: color.color }}
                      />
                      <div className="flex-1 text-left">
                        <div className="font-medium">{color.name}</div>
                        <div className="text-xs text-gray-500">{color.description}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Estilos */}
            <div className="px-3 py-2">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Estilo de fondo</h3>
              <div className="grid grid-cols-2 gap-2">
                {BACKGROUND_STYLES.map((style) => {
                  const Icon = style.icon;
                  const isSelected = bgStyle === style.id;
                  
                  return (
                    <button
                      key={style.id}
                      onClick={() => handleStyleChange(style.id)}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm transition-colors ${
                        isSelected
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <div className="flex-1 text-left">
                        <div className="font-medium">{style.name}</div>
                        <div className="text-xs text-gray-500">{style.description}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
