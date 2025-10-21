'use client';

import { useState } from 'react';
import { 
  X, 
  Palette, 
  Circle, 
  Square, 
  Minus, 
  Grid3X3, 
  Moon,
  Sun,
  Paintbrush,
  Layout
} from 'lucide-react';
import { BackgroundType, BackgroundColor, BackgroundStyle } from './BackgroundSelector';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
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

export default function Settings({ 
  isOpen, 
  onClose, 
  currentBackground, 
  onBackgroundChange 
}: SettingsProps) {
  if (!isOpen) return null;

  const [bgColor, bgStyle] = currentBackground.split('-') as [BackgroundColor, BackgroundStyle];
  const [activeTab, setActiveTab] = useState<'color' | 'style'>('color');

  const handleColorChange = (color: BackgroundColor) => {
    const newBackground = `${color}-${bgStyle}` as BackgroundType;
    onBackgroundChange(newBackground);
  };

  const handleStyleChange = (style: BackgroundStyle) => {
    const newBackground = `${bgColor}-${style}` as BackgroundType;
    onBackgroundChange(newBackground);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-lg shadow-xl border border-gray-200 w-full max-w-5xl mx-4 max-h-[90vh] overflow-hidden flex">
        
        {/* Sidebar vertical */}
        <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col">
          {/* Header del sidebar */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Palette className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Configuración</h2>
                <p className="text-xs text-gray-500">Personaliza tu experiencia</p>
              </div>
            </div>
          </div>

          {/* Tabs verticales */}
          <div className="flex-1 p-2">
            <button
              onClick={() => setActiveTab('color')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors mb-1 ${
                activeTab === 'color'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Paintbrush className="w-4 h-4" />
              <span className="text-sm font-medium">Color de fondo</span>
            </button>
            
            <button
              onClick={() => setActiveTab('style')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                activeTab === 'style'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Layout className="w-4 h-4" />
              <span className="text-sm font-medium">Estilo de fondo</span>
            </button>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="flex-1 flex flex-col">
          {/* Header principal */}
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {activeTab === 'color' ? 'Color de fondo' : 'Estilo de fondo'}
              </h3>
              <p className="text-sm text-gray-500">
                {activeTab === 'color' 
                  ? 'Selecciona el color base para el fondo' 
                  : 'Elige el patrón o estilo del fondo'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Contenido de las tabs */}
          <div className="flex-1 p-6 overflow-y-auto">
            {activeTab === 'color' && (
              <div className="grid grid-cols-2 gap-4">
                {BACKGROUND_COLORS.map((color) => {
                  const Icon = color.icon;
                  const isSelected = bgColor === color.id;

                  return (
                    <button
                      key={color.id}
                      onClick={() => handleColorChange(color.id)}
                      className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div 
                        className="w-8 h-8 rounded-full border-2 border-gray-300 shadow-sm"
                        style={{ backgroundColor: color.color }}
                      />
                      <div className="flex-1 text-left">
                        <div className="font-medium text-gray-900">{color.name}</div>
                        <div className="text-sm text-gray-500">{color.description}</div>
                      </div>
                      {isSelected && (
                        <div className="w-3 h-3 bg-blue-600 rounded-full" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {activeTab === 'style' && (
              <div className="grid grid-cols-2 gap-4">
                {BACKGROUND_STYLES.map((style) => {
                  const Icon = style.icon;
                  const isSelected = bgStyle === style.id;

                  return (
                    <button
                      key={style.id}
                      onClick={() => handleStyleChange(style.id)}
                      className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Icon className="w-4 h-4 text-gray-600" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-medium text-gray-900">{style.name}</div>
                        <div className="text-sm text-gray-500">{style.description}</div>
                      </div>
                      {isSelected && (
                        <div className="w-3 h-3 bg-blue-600 rounded-full" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
