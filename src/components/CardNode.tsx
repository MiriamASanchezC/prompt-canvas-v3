'use client';

import { useState, useRef, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import { MessageSquare, StickyNote, FileText, Trash2, Plus } from 'lucide-react';

interface Message {
  id: string;
  question: string;
  answer: string;
  timestamp: Date;
}


interface CardNodeData {
  title: string;
  content: string;
  type: 'conversation' | 'note' | 'template' | 'question-hub';
  color?: string;
  messages?: Message[];
  question?: string;
  answer?: string;
  timestamp?: Date;
  onCreateQuestion?: (question: string) => void; // 👈 Agregamos esto
}

interface CardNodeProps {
  data: CardNodeData;
  id: string;
  selected?: boolean;
}

export default function CardNode({ data, id, selected }: CardNodeProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(data.title || '');
  const [content, setContent] = useState(data.content || '');
  const [messages, setMessages] = useState<Message[]>(data.messages || []);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [isLoadingResponse, setIsLoadingResponse] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isEditing]);

  const getIcon = () => {
    switch (data.type) {
      case 'conversation': return <MessageSquare className="w-4 h-4" />;
      case 'question-hub': return <Plus className="w-5 h-5" />;
      case 'note': return <StickyNote className="w-4 h-4" />;
      case 'template': return <FileText className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getTypeLabel = () => {
    switch (data.type) {
      case 'conversation': return 'Conversación';
      case 'note': return 'Nota';
      case 'template': return 'Template';
      case 'question-hub': return 'Centro de Preguntas';
      default: return 'Desconocido';
    }
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSave();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setTitle(data.title || '');
      setContent(data.content || '');
    }
  };

  const handleSubmitQuestion = async () => {
    if (!currentQuestion.trim() || !data.onCreateQuestion) return;
    
    setIsLoadingResponse(true);
    data.onCreateQuestion(currentQuestion); // 👈 Llamamos la función desde Canvas
    setCurrentQuestion('');
    setIsLoadingResponse(false);
  };

  const handleChatKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmitQuestion();
    }
  };

  // Card central para hacer preguntas (Question Hub) - PRIMERO EN EL ORDEN
  if (data.type === 'question-hub') {
    return (
      <div className="relative">
        <Handle
          type="source"
          position={Position.Right}
          className="w-4 h-4 bg-blue-500 border-2 border-white"
        />
        <Handle
          type="source"
          position={Position.Bottom}
          className="w-4 h-4 bg-blue-500 border-2 border-white"
        />
        <Handle
          type="source"
          position={Position.Left}
          className="w-4 h-4 bg-blue-500 border-2 border-white"
        />
        <Handle
          type="source"
          position={Position.Top}
          className="w-4 h-4 bg-blue-500 border-2 border-white"
        />
        
        <div
          className={`bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-lg border-2 transition-all duration-200 ${
            selected ? 'border-blue-500 shadow-xl' : 'border-blue-200 hover:border-blue-300'
          }`}
          style={{ 
            width: '700px',
            minHeight: '200px',
            borderRadius: '16px'
          }}
        >
          {/* Header */}
          <div className="p-4 border-b border-blue-200 bg-gradient-to-r from-blue-100 to-blue-200 rounded-t-xl ">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-blue-900">Centro de Preguntas</h3>
                <p className="text-sm text-blue-700">Escribe una pregunta para crear una nueva card</p>
              </div>
            </div>
          </div>

          {/* Input Area */}
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-sm text-blue-700">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="font-medium">Nueva pregunta</span>
              </div>
              
              <textarea
                value={currentQuestion}
                onChange={(e) => setCurrentQuestion(e.target.value)}
                onKeyDown={handleChatKeyPress}
                className="w-full p-4 border-2 border-blue-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                placeholder="¿Qué te gustaría saber?"
                rows={3}
                disabled={isLoadingResponse}
              />
              
              <button
                onClick={handleSubmitQuestion}
                disabled={!currentQuestion.trim() || isLoadingResponse}
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2 font-medium"
                type="button"
              >
                {isLoadingResponse ? (
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    <span>Crear Pregunta</span>
                  </>
                )}
              </button>
              
              
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Card individual de pregunta-respuesta (nueva versión simplificada)
  if (data.type === 'conversation') {
    // Calcular altura dinámica basada en el contenido
    const questionLength = data.question?.length || 0;
    const answerLength = data.answer?.length || 0;
    const estimatedHeight = Math.max(
      250, // altura mínima
      Math.min(600, 200 + (questionLength * 0.3) + (answerLength * 0.5)) // altura dinámica con máximo
    );

    return (
      <div className="relative">
        <Handle
          type="target"
          position={Position.Left}
          className="w-3 h-3 bg-gray-400 border-2 border-white"
        />
        <Handle
          type="source"
          position={Position.Right}
          className="w-3 h-3 bg-gray-400 border-2 border-white"
        />
        <Handle
          type="target"
          position={Position.Top}
          className="w-3 h-3 bg-gray-400 border-2 border-white"
        />
        <Handle
          type="source"
          position={Position.Bottom}
          className="w-3 h-3 bg-gray-400 border-2 border-white"
        />
        
        <div
          className={`bg-white rounded-lg shadow-md border transition-all duration-200 cursor-pointer group ${
            selected ? 'border-blue-400 shadow-lg' : 'border-gray-200 hover:border-gray-300'
          }`}
          style={{ 
            width: '400px', 
            height: `${estimatedHeight}px`,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* Header con la pregunta como título */}
          <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-lg flex-shrink-0">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-white">Q</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-blue-900 leading-tight break-words">
                  {data.question || data.title}
                </h3>
                {data.timestamp && (
                  <p className="text-xs text-blue-600 mt-1 opacity-75">
                    {data.timestamp.toLocaleString()}
                  </p>
                )}
              </div>
              <button
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 hover:bg-blue-200 rounded"
                onClick={(e) => {
                  e.stopPropagation();
                  // Función de eliminar
                }}
                type="button"
              >
                <Trash2 className="w-4 h-4 text-blue-600" />
              </button>
            </div>
          </div>

          {/* Answer Section */}
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-white">A</span>
              </div>
              <div className="flex-1 min-w-0">
                {data.answer ? (
                  <div className="text-sm text-gray-700 leading-relaxed space-y-2">
                    {data.answer.split('\n\n').map((paragraph, i) => (
                      <p key={i} className="whitespace-pre-wrap break-words">{paragraph}</p>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 text-gray-500 py-4">
                    <div className="animate-spin w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full"></div>
                    <span className="text-sm italic">Generando respuesta...</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ...resto del código para notes y templates igual...
  
  // Estilo específico para notas tipo post-it
  if (data.type === 'note') {
    return (
      <div className="relative">
        <Handle
          type="target"
          position={Position.Top}
          className="w-3 h-3 bg-gray-400 border-2 border-white"
        />
        <Handle
          type="source"
          position={Position.Bottom}
          className="w-3 h-3 bg-gray-400 border-2 border-white"
        />
        <Handle
          type="target"
          position={Position.Left}
          className="w-3 h-3 bg-gray-400 border-2 border-white"
        />
        <Handle
          type="source"
          position={Position.Right}
          className="w-3 h-3 bg-gray-400 border-2 border-white"
        />
        
        <div
          className={`relative w-full h-full shadow-lg transition-all duration-200 cursor-pointer group ${
            selected ? 'ring-2 ring-blue-400 ring-offset-2' : ''
          }`}
          style={{ 
            backgroundColor: data.color || '#FCD34D',
            transform: 'rotate(-1deg)',
            minWidth: '64px',
            minHeight: '64px',
          }}
          onDoubleClick={handleDoubleClick}
        >
          <div className="relative p-2 h-full flex flex-col">
            {isEditing ? (
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleSave}
                onKeyDown={handleKeyPress}
                className="bg-transparent border-none outline-none text-xs font-medium text-gray-800 placeholder-gray-500 w-full mb-1"
                placeholder="Título..."
                style={{ fontFamily: 'Comic Sans MS, cursive' }}
              />
            ) : (
              <h3 
                className="text-xs font-medium text-gray-800 mb-1 break-words overflow-hidden"
                style={{ fontFamily: 'Comic Sans MS, cursive' }}
              >
                {title || 'Nueva Nota'}
              </h3>
            )}
            
            {isEditing ? (
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onBlur={handleSave}
                onKeyDown={handleKeyPress}
                className="bg-transparent border-none outline-none resize-none flex-1 text-xs text-gray-700 placeholder-gray-500 min-h-0"
                placeholder="Nota..."
                style={{ fontFamily: 'Comic Sans MS, cursive' }}
              />
            ) : (
              <p 
                className="flex-1 text-xs text-gray-700 whitespace-pre-wrap break-words overflow-hidden"
                style={{ fontFamily: 'Comic Sans MS, cursive' }}
              >
                {content || 'Doble clic...'}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Template card
  return (
    <div
      className={`bg-white rounded-lg shadow-md border-2 transition-all duration-200 cursor-pointer group ${
        selected ? 'border-blue-400 shadow-lg' : 'border-gray-200 hover:border-gray-300'
      }`}
      onDoubleClick={handleDoubleClick}
      style={{ width: '300px', minHeight: '200px' }}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-gray-400 border-2 border-white"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-gray-400 border-2 border-white"
      />
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-gray-400 border-2 border-white"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-gray-400 border-2 border-white"
      />

      <div 
        className="flex items-center justify-between p-3 border-b"
        style={{ borderColor: data.color || '#e5e7eb' }}
      >
        <div className="flex items-center space-x-2">
          <div style={{ color: data.color }}>{getIcon()}</div>
          <span className="text-sm font-medium text-gray-600 capitalize">
            {getTypeLabel()}
          </span>
        </div>
        
        <button
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 hover:bg-gray-100 rounded"
          onClick={(e) => {
            e.stopPropagation();
          }}
          type="button"
        >
          <Trash2 className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      <div className="p-4">
        {isEditing ? (
          <div className="space-y-3">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyPress}
              className="w-full p-2 border border-gray-200 rounded-md text-sm font-medium"
              placeholder="Título..."
            />
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyPress}
              className="w-full p-2 border border-gray-200 rounded-md text-sm resize-none"
              rows={4}
              placeholder="Contenido..."
            />
          </div>
        ) : (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-800 break-words">
              {title || `Nueva ${getTypeLabel()}`}
            </h3>
            <p className="text-xs text-gray-600 whitespace-pre-wrap break-words">
              {content || 'Haz doble clic para editar...'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
