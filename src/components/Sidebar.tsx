'use client';

import { useState } from 'react';
import { MessageSquare, StickyNote, FileText, Settings, Plus } from 'lucide-react';

interface SidebarProps {
  onCreateCard: (type: 'conversation' | 'note' | 'template' | 'question-hub', color?: string) => void;
  onOpenSettings: () => void;
  isModernMode?: boolean; // 👈 PROP CLAVE
}

export default function Sidebar({ onCreateCard, onOpenSettings, isModernMode = false }: SidebarProps) {
  console.log('🔥 Sidebar renderizado - isModernMode:', isModernMode);
  
  const [showNoteColors, setShowNoteColors] = useState(false);

  const noteColors = [
    { name: 'Amarillo', color: '#FCD34D' },
    { name: 'Verde', color: '#10B981' },
    { name: 'Azul', color: '#3B82F6' },
    { name: 'Rosa', color: '#F472B6' },
    { name: 'Púrpura', color: '#8B5CF6' },
    { name: 'Naranja', color: '#F59E0B' },
  ];

  return (
    <div 
      className={`fixed left-0 top-0 h-full border-r flex flex-col items-center py-6 space-y-6 z-40 transition-all duration-300`}
      style={{
        width: isModernMode ? '80px' : '64px',
        backgroundColor: isModernMode ? '#111827' : '#ffffff',
        borderColor: isModernMode ? '#374151' : '#e5e7eb'
      }}
    >
      {/* Logo */}
      <div 
        className="w-10 h-10 rounded-lg flex items-center justify-center mb-6 transition-all duration-300"
        style={{
          backgroundColor: isModernMode ? '#2563eb' : '#2563eb',
          boxShadow: isModernMode ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)' : 'none'
        }}
      >
        <span className="text-white font-bold text-lg">P</span>
      </div>

      {/* 🔵 BOTÓN CENTRO DE PREGUNTAS */}
      <button
        onClick={() => onCreateCard('question-hub')}
        className="w-12 h-12 rounded-lg transition-all duration-200 flex items-center justify-center group relative"
        style={{
          backgroundColor: '#2563eb' ,
          color: isModernMode ? '#ffffff' : '#1d4ed8',
          boxShadow: isModernMode ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none'
        }}
        title="Centro de Preguntas"
        onMouseEnter={(e) => {
          if (isModernMode) {
            e.currentTarget.style.backgroundColor = '#1d4ed8';
            e.currentTarget.style.transform = 'scale(1.05)';
          } else {
            e.currentTarget.style.backgroundColor = '#bfdbfe';
          }
        }}
        onMouseLeave={(e) => {
          if (isModernMode) {
            e.currentTarget.style.backgroundColor = '#2563eb';
            e.currentTarget.style.transform = 'scale(1)';
          } else {
            e.currentTarget.style.backgroundColor = '#dbeafe';
          }
        }}
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* 🟢 Chat/Conversación */}
      <button
        onClick={() => onCreateCard('conversation')}
        className="w-12 h-12 rounded-lg transition-all duration-200 flex items-center justify-center group relative"
        style={{
          backgroundColor: isModernMode ? '#059669' : '#dcfce7',
          color: isModernMode ? '#ffffff' : '#166534',
          boxShadow: isModernMode ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none'
        }}
        title="Nueva Conversación"
        onMouseEnter={(e) => {
          if (isModernMode) {
            e.currentTarget.style.backgroundColor = '#047857';
            e.currentTarget.style.transform = 'scale(1.05)';
          } else {
            e.currentTarget.style.backgroundColor = '#bbf7d0';
          }
        }}
        onMouseLeave={(e) => {
          if (isModernMode) {
            e.currentTarget.style.backgroundColor = '#059669';
            e.currentTarget.style.transform = 'scale(1)';
          } else {
            e.currentTarget.style.backgroundColor = '#dcfce7';
          }
        }}
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      {/* 🟡 Nota con selector de colores */}
      <div className="relative">
        <button
          onClick={() => setShowNoteColors(!showNoteColors)}
          className="w-12 h-12 rounded-lg transition-all duration-200 flex items-center justify-center group"
          style={{
            backgroundColor: isModernMode ? '#eab308' : '#fef3c7',
            color: isModernMode ? '#ffffff' : '#a16207',
            boxShadow: isModernMode ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none'
          }}
          title="Nueva Nota"
          onMouseEnter={(e) => {
            if (isModernMode) {
              e.currentTarget.style.backgroundColor = '#ca8a04';
              e.currentTarget.style.transform = 'scale(1.05)';
            } else {
              e.currentTarget.style.backgroundColor = '#fde68a';
            }
          }}
          onMouseLeave={(e) => {
            if (isModernMode) {
              e.currentTarget.style.backgroundColor = '#eab308';
              e.currentTarget.style.transform = 'scale(1)';
            } else {
              e.currentTarget.style.backgroundColor = '#fef3c7';
            }
          }}
        >
          <StickyNote className="w-6 h-6" />
        </button>

        {showNoteColors && (
          <div 
            className="absolute left-16 top-0 border rounded-lg shadow-lg p-2 z-50"
            style={{
              backgroundColor: isModernMode ? '#1f2937' : '#ffffff',
              borderColor: isModernMode ? '#4b5563' : '#e5e7eb'
            }}
          >
            <div className="grid grid-cols-2 gap-2">
              {noteColors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => {
                    onCreateCard('note', color.color);
                    setShowNoteColors(false);
                  }}
                  className="w-8 h-8 rounded border-2 border-white shadow-sm hover:scale-110 transition-transform"
                  style={{ backgroundColor: color.color }}
                  title={color.name}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 🟣 Template */}
      <button
        onClick={() => onCreateCard('template')}
        className="w-12 h-12 rounded-lg transition-all duration-200 flex items-center justify-center group relative"
        style={{
          backgroundColor: isModernMode ? '#9333ea' : '#f3e8ff',
          color: isModernMode ? '#ffffff' : '#7c3aed',
          boxShadow: isModernMode ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none'
        }}
        title="Nuevo Template"
        onMouseEnter={(e) => {
          if (isModernMode) {
            e.currentTarget.style.backgroundColor = '#7c3aed';
            e.currentTarget.style.transform = 'scale(1.05)';
          } else {
            e.currentTarget.style.backgroundColor = '#e9d5ff';
          }
        }}
        onMouseLeave={(e) => {
          if (isModernMode) {
            e.currentTarget.style.backgroundColor = '#9333ea';
            e.currentTarget.style.transform = 'scale(1)';
          } else {
            e.currentTarget.style.backgroundColor = '#f3e8ff';
          }
        }}
      >
        <FileText className="w-6 h-6" />
      </button>

      {/* Espaciador */}
      <div className="flex-1"></div>

      {/* ⚙️ Settings */}
      <button
        onClick={onOpenSettings}
        className="w-12 h-12 rounded-lg transition-all duration-200 flex items-center justify-center group relative"
        style={{
          backgroundColor: isModernMode ? '#4b5563' : '#f3f4f6',
          color: isModernMode ? '#ffffff' : '#374151',
          boxShadow: isModernMode ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none'
        }}
        title="Configuración"
        onMouseEnter={(e) => {
          if (isModernMode) {
            e.currentTarget.style.backgroundColor = '#374151';
            e.currentTarget.style.transform = 'scale(1.05)';
          } else {
            e.currentTarget.style.backgroundColor = '#e5e7eb';
          }
        }}
        onMouseLeave={(e) => {
          if (isModernMode) {
            e.currentTarget.style.backgroundColor = '#4b5563';
            e.currentTarget.style.transform = 'scale(1)';
          } else {
            e.currentTarget.style.backgroundColor = '#f3f4f6';
          }
        }}
      >
        <Settings className="w-6 h-6" />
      </button>

      {/* Cerrar selector de colores */}
      {showNoteColors && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowNoteColors(false)}
        />
      )}
    </div>
  );
}