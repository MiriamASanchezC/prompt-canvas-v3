'use client';

import { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { 
  Trash2, 
  User as UserIcon,
  LogOut,
  Settings,
  Save,
  Download
} from 'lucide-react';

interface ToolbarProps {
  selectedNode: any;
  onDeleteNode: (node: any) => void;
  user: User;
  onOpenSettings: () => void;
}

export default function Toolbar({ selectedNode, onDeleteNode, user, onOpenSettings }: ToolbarProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log('Saving canvas...');
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Exporting canvas...');
  };

  return (
    <div className="absolute top-0 left-0 right-0 z-10 bg-white/90 backdrop-blur-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Logo and Title */}
        <div className="flex items-center space-x-3">
          <div className="text-2xl">🎨</div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Prompt Canvas</h1>
            <p className="text-xs text-gray-500">Organiza tus conversaciones con IA</p>
          </div>
        </div>

        {/* Main Actions */}
        <div className="flex items-center space-x-2">
          {/* Action Buttons */}
          <div className="flex items-center space-x-1">
            <button
              onClick={handleSave}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              title="Guardar"
            >
              <Save className="w-4 h-4" />
            </button>
            <button
              onClick={handleExport}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              title="Exportar"
            >
              <Download className="w-4 h-4" />
            </button>
            <button 
              onClick={onOpenSettings}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors" 
              title="Configuración"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>

          {/* Selected Node Actions */}
          {selectedNode && (
            <div className="flex items-center space-x-1 border-l border-gray-200 pl-2">
              <button
                onClick={() => onDeleteNode(selectedNode)}
                className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                title="Eliminar tarjeta"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                {user.email?.charAt(0).toUpperCase()}
              </div>
              <UserIcon className="w-4 h-4" />
            </button>

            {showUserMenu && (
              <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                <div className="px-4 py-2 border-b border-gray-100">
                  <div className="font-medium text-gray-900">{user.email}</div>
                  <div className="text-xs text-gray-500">Usuario</div>
                </div>
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center space-x-3 px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
