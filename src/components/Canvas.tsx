'use client';

import { useState, useCallback, useEffect } from 'react';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  BackgroundVariant,
  MiniMap,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { User } from '@supabase/supabase-js';
import CardNode from './CardNode';
import Toolbar from './Toolbar';
import ThemeSelector from './ThemeSelector';
import { BackgroundType } from './BackgroundSelector';
import Sidebar from '@/components/Sidebar';
import Settings from '@/components/Settings';
import { Plus } from 'lucide-react';
import ModeToggle from './ModeToggle';

// 👈 Asegúrate de que THEMES esté definido correctamente
export const THEMES = {
  general: { name: 'General', color: '#6B7280', icon: '💭' },
  programming: { name: 'Programación', color: '#3B82F6', icon: '💻' },
  design: { name: 'Diseño', color: '#10B981', icon: '🎨' },
  research: { name: 'Investigación', color: '#F59E0B', icon: '🔍' },
  ideas: { name: 'Ideas', color: '#8B5CF6', icon: '💡' },
  tasks: { name: 'Tareas', color: '#EF4444', icon: '✅' },
} as const;

export type ThemeKey = keyof typeof THEMES;

const nodeTypes = {
  card: CardNode,
};

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'card',
    position: { x: 250, y: 25 },
    data: {
      title: 'Bienvenido a Prompt Canvas',
      content: 'Haz clic en el botón + para crear tu primera tarjeta de conversación',
      type: 'note',
      color: '#3B82F6',
    },
  },
];

const initialEdges: Edge[] = [];

interface CanvasProps {
  user: User;
}

interface CanvasData {
  id: string;
  name: string;
  nodes: Node[];
  edges: Edge[];
  createdAt: Date;
  updatedAt: Date;
}

export default function Canvas({ user }: CanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [pendingConnection, setPendingConnection] = useState<Connection | null>(null);
  const [backgroundType, setBackgroundType] = useState<BackgroundType>('white-solid');
  const [showSettings, setShowSettings] = useState(false);
  const [questionCounter, setQuestionCounter] = useState(1);
  
  // 👈 NUEVA LÍNEA - Estado para el modo de diseño
  const [isModernMode, setIsModernMode] = useState(false);

  const [canvases, setCanvases] = useState<CanvasData[]>([]);
  const [currentCanvasId, setCurrentCanvasId] = useState<string | null>(null);
  const [showCanvasList, setShowCanvasList] = useState(false);

  const currentCanvas = canvases.find(c => c.id === currentCanvasId);

  const createNewCanvas = () => {
    const newCanvas: CanvasData = {
      id: Date.now().toString(),
      name: `Chat ${canvases.length + 1}`,
      nodes: [],
      edges: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setCanvases(prev => [...prev, newCanvas]);
    setCurrentCanvasId(newCanvas.id);
    setNodes([]);
    setEdges([]);
  };

  const switchCanvas = (canvasId: string) => {
    const canvas = canvases.find(c => c.id === canvasId);
    if (canvas) {
      setCurrentCanvasId(canvasId);
      setNodes(canvas.nodes);
      setEdges(canvas.edges);
    }
  };

  const saveCurrentCanvas = () => {
    if (currentCanvasId) {
      setCanvases(prev => 
        prev.map(canvas => 
          canvas.id === currentCanvasId
            ? { ...canvas, nodes, edges, updatedAt: new Date() }
            : canvas
        )
      );
    }
  };

  // Auto-save when nodes or edges change
  useEffect(() => {
    if (currentCanvasId) {
      saveCurrentCanvas();
    }
  }, [nodes, edges]);

  // Initialize with first canvas
  useEffect(() => {
    if (canvases.length === 0) {
      createNewCanvas();
    }
  }, []);

  const onConnect = useCallback(
    (params: Connection) => {
      setPendingConnection(params);
    },
    []
  );

  const handleThemeSelect = useCallback((theme: ThemeKey) => {
    if (pendingConnection && pendingConnection.source && pendingConnection.target) {
      const newEdge: Edge = {
        id: `edge-${Date.now()}`,
        source: pendingConnection.source,
        target: pendingConnection.target,
        sourceHandle: pendingConnection.sourceHandle,
        targetHandle: pendingConnection.targetHandle,
        data: { theme },
        style: { stroke: THEMES[theme].color, strokeWidth: 2 },
        type: 'smoothstep',
      };
      setEdges((eds) => [...eds, newEdge]);
      setPendingConnection(null);
    }
  }, [pendingConnection, setEdges]);

  const handleThemeCancel = useCallback(() => {
    setPendingConnection(null);
  }, []);

  // Función para crear cards de preguntas desde el question hub
  const createQuestionCard = useCallback((question: string, hubNodeId?: string) => {
    const newNodeId = `question-${Date.now()}`;
    
    // Buscar el nodo hub que creó la pregunta
    const hubNode = hubNodeId ? nodes.find(n => n.id === hubNodeId) : null;
    
    // Calcular posición alrededor del hub o posición aleatoria
    let newX, newY;
    if (hubNode) {
      const angle = (questionCounter - 1) * (Math.PI / 3); // 60 grados entre cada card
      const radius = 350;
      newX = hubNode.position.x + Math.cos(angle) * radius;
      newY = hubNode.position.y + Math.sin(angle) * radius;
    } else {
      newX = Math.random() * 400 + 200;
      newY = Math.random() * 300 + 200;
    }

    const newNode: Node = {
      id: newNodeId,
      type: 'card',
      position: { x: newX, y: newY },
      data: {
        title: question,
        content: '',
        type: 'conversation',
        color: '#10B981',
        question: question,
        answer: '',
        timestamp: new Date()
      },
    };

    setNodes((nds) => [...nds, newNode]);
    setQuestionCounter(prev => prev + 1);

    // Crear conexión automática si hay un hub
    if (hubNode) {
      const newEdge: Edge = {
        id: `hub-${newNodeId}`,
        source: hubNodeId!,
        target: newNodeId,
        type: 'smoothstep',
        style: { stroke: '#3b82f6', strokeWidth: 2 },
        animated: true,
      };
      setEdges((eds) => [...eds, newEdge]);
    }

    // Simular respuesta después de un delay
    setTimeout(() => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === newNodeId
            ? {
                ...node,
                data: {
                  ...node.data,
                  answer: `Respuesta detallada para: "${question}"\n\nEsta es una respuesta simulada que demuestra cómo se adaptaría el contenido al tamaño de la card. La respuesta incluye información relevante y se ajusta automáticamente.\n\nLa card se redimensiona según la cantidad de contenido para mantener todo visible sin scroll excesivo.`
                }
              }
            : node
        )
      );
    }, 2000);
  }, [nodes, setNodes, setEdges, questionCounter]);

  const addCard = useCallback((type: 'conversation' | 'note' | 'template' | 'question-hub' = 'conversation', color?: string) => {
    console.log('🎯 Creando card de tipo:', type); // Para debug
    
    const getCardColor = () => {
      if (type === 'conversation') return '#10B981';
      if (type === 'note') return color || '#FCD34D';
      if (type === 'question-hub') return '#3B82F6';
      return '#8B5CF6';
    };
  
    const newNodeId = `card-${Date.now()}`;
    const newNode: Node = {
      id: newNodeId,
      type: 'card',
      position: { 
        x: Math.random() * 400 + 100, 
        y: Math.random() * 300 + 100 
      },
      data: {
        title: type === 'conversation' ? '' : 
              type === 'note' ? 'Nueva Nota' : 
              type === 'question-hub' ? 'Centro de Preguntas' :
              'Nuevo Template',
        content: '',
        type: type,
        color: getCardColor(),
        onCreateQuestion: type === 'question-hub' ? 
          (question: string) => createQuestionCard(question, newNodeId) : undefined,
      },
    };
    
    setNodes((nds) => [...nds, newNode]);
  }, [setNodes, createQuestionCard]);

  const handleCreateCard = (type: 'conversation' | 'note' | 'template' | 'question-hub', color?: string) => {
    console.log('🚀 handleCreateCard llamado con:', type); // Para debug
    addCard(type, color);
  };

  // Actualizar nodos existentes para pasar la función onCreateQuestion
  const nodesWithCallbacks = nodes.map(node => ({
    ...node,
    data: {
      ...node.data,
      // Para question-hub: función de crear preguntas
      ...(node.data?.type === 'question-hub' && {
        onCreateQuestion: (question: string) => createQuestionCard(question, node.id)
      }),
      // Para TODOS los nodos: función de eliminar
      onDelete: () => deleteNode(node.id)
    }
  }));

  const updateNodeData = useCallback((nodeId: string, newData: any) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...newData } }
          : node
      )
    );
  }, [setNodes]);

  const deleteNode = useCallback((nodeId: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter((edge) => 
      edge.source !== nodeId && edge.target !== nodeId
    ));
  }, [setNodes, setEdges]);

  const getBackgroundClass = () => {
    return `bg-${backgroundType}`;
  };

  // 👈 AGREGAR DEBUG
  console.log('🎯 Canvas renderizado - isModernMode:', isModernMode);

  return (
    <div className={`relative h-screen ${getBackgroundClass()}`}>
      <Sidebar 
        onCreateCard={handleCreateCard} 
        onOpenSettings={() => setShowSettings(true)}
        isModernMode={isModernMode} // 👈 VERIFICAR QUE ESTO ESTÁ PASANDO
      />
      
      <ModeToggle 
        isModernMode={isModernMode}
        onToggle={setIsModernMode}
        position="top-left"
      />
      
      {/* 👈 DEBUG TEMPORAL - MOSTRAR EL ESTADO ACTUAL */}
      <div className="fixed top-20 left-4 z-[9998] bg-red-500 text-white p-2 rounded">
        MODE: {isModernMode ? 'MODERNO' : 'MINIMAL'}
      </div>

      <div className="absolute top-4 left-20 z-50">
        <div className="bg-white rounded-lg shadow-md border p-2">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowCanvasList(!showCanvasList)}
              className="flex items-center space-x-2 px-3 py-1 hover:bg-gray-100 rounded"
            >
              <span className="text-sm font-medium">
                {currentCanvas?.name || 'Chat 1'}
              </span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            <button
              onClick={createNewCanvas}
              className="p-1 hover:bg-gray-100 rounded"
              title="Nuevo Chat"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {showCanvasList && (
            <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg min-w-48 max-h-64 overflow-y-auto">
              {canvases.map(canvas => (
                <button
                  key={canvas.id}
                  onClick={() => {
                    switchCanvas(canvas.id);
                    setShowCanvasList(false);
                  }}
                  className={`w-full text-left px-3 py-2 hover:bg-gray-100 border-b last:border-b-0 ${
                    canvas.id === currentCanvasId ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="font-medium text-sm">{canvas.name}</div>
                  <div className="text-xs text-gray-500">
                    {canvas.nodes.length} tarjetas • {canvas.updatedAt.toLocaleDateString()}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="ml-16 h-full">
        <Toolbar 
          selectedNode={selectedNode}
          onDeleteNode={deleteNode}
          user={user}
          onOpenSettings={() => setShowSettings(true)}
        />

        <Settings
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          currentBackground={backgroundType}
          onBackgroundChange={setBackgroundType}
        />
        
        <ReactFlow
          nodes={nodesWithCallbacks}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={(_, node) => setSelectedNode(node.id)}
          onPaneClick={() => setSelectedNode(null)}
          nodeTypes={nodeTypes}
          fitView
          attributionPosition="bottom-left"
        >
          <Controls />
          <MiniMap 
            nodeColor={(node) => {
              switch (node.data?.type) {
                case 'conversation': return '#10B981';
                case 'note': return '#F59E0B';
                case 'template': return '#8B5CF6';
                case 'question-hub': return '#3B82F6';
                default: return '#6B7280';
              }
            }}
            nodeStrokeWidth={3}
            zoomable
            pannable
          />
          {backgroundType.includes('dots') && (
            <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
          )}
        </ReactFlow>
      </div>

      {pendingConnection && (
        <ThemeSelector
          onThemeSelect={(theme: any) => handleThemeSelect(theme)}
          onCancel={handleThemeCancel}
          position={{ x: 400, y: 300 }} // 👈 AGREGAR ESTA LÍNEAon={{ x: 400, y: 300 }} // 👈 AGREGAR ESTA LÍNEA
        />
      )}
    </div>
  ); 
}

