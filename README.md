# 🎨 Prompt Canvas

**Infinite Canvas para Conversaciones con IA** - Organiza tus conversaciones con IA de manera visual e intuitiva.

## 🚀 ¿Qué es Prompt Canvas?

Prompt Canvas es una aplicación que resuelve el problema de pérdida de contexto en conversaciones largas con IA. Te permite organizar tus conversaciones en un canvas infinito donde puedes:

- 📝 Crear tarjetas de conversación organizables
- 🔗 Conectar ideas relacionadas visualmente
- 🎯 Mantener el contexto de múltiples conversaciones
- 👥 Colaborar con otros usuarios
- 🎨 Personalizar la apariencia de tus tarjetas
- 📊 Exportar tus conversaciones

## 🛠️ Stack Tecnológico

### Frontend
- **Next.js 14** - Framework React con App Router
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos utilitarios
- **React Flow** - Canvas infinito y conexiones
- **Framer Motion** - Animaciones suaves
- **Zustand** - Manejo de estado
- **React Query** - Cache y sincronización
- **Supabase** - Autenticación y base de datos

### Backend
- **Fastify** - API rápida y moderna
- **TypeScript** - Tipado estático
- **Supabase** - Base de datos PostgreSQL
- **JWT** - Autenticación
- **OpenAI API** - Integración con GPT
- **Anthropic API** - Integración con Claude

## 📁 Estructura del Proyecto

```
prompt-canvas/
├── apps/
│   ├── web/                 # Frontend Next.js
│   └── api/                 # Backend Fastify
├── packages/                # Librerías compartidas (futuro)
├── supabase-schema.sql      # Esquema de base de datos
├── package.json             # Configuración del monorepo
└── turbo.json              # Configuración de Turbo
```

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18+
- npm 8+
- Cuenta de Supabase
- Cuenta de OpenAI (opcional)
- Cuenta de Anthropic (opcional)

### 1. Clonar el repositorio
```bash
git clone <tu-repo>
cd prompt-canvas
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar Supabase
1. Crea un nuevo proyecto en [Supabase](https://supabase.com)
2. Ejecuta el esquema SQL en el SQL Editor:
   ```sql
   -- Copia y pega el contenido de supabase-schema.sql
   ```
3. Obtén las credenciales de tu proyecto

### 4. Configurar variables de entorno

#### Backend (apps/api/.env)
```env
SUPABASE_URL=tu_supabase_url
SUPABASE_ANON_KEY=tu_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_supabase_service_role_key
JWT_SECRET=tu_jwt_secret
OPENAI_API_KEY=tu_openai_api_key
ANTHROPIC_API_KEY=tu_anthropic_api_key
PORT=3001
NODE_ENV=development
```

#### Frontend (apps/web/.env.local)
```env
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 5. Ejecutar en desarrollo
```bash
# Ejecutar todo el proyecto
npm run dev

# O ejecutar por separado:
# Backend
cd apps/api && npm run dev

# Frontend
cd apps/web && npm run dev
```

## 🎯 Características Principales

### Canvas Infinito
- Zoom y pan ilimitados
- Grid opcional para alineación
- Múltiples vistas (mini-mapa, vista general)

### Tarjetas de Conversación
- Drag & drop para reorganizar
- Diferentes tipos: conversación, nota, template
- Colores personalizables
- Tamaños ajustables

### Conexiones Visuales
- Líneas que conectan tarjetas relacionadas
- Diferentes tipos de conexión
- Animaciones suaves

### Integración con IA
- Múltiples proveedores (OpenAI, Anthropic)
- Diferentes modelos (GPT-4, Claude-3, etc.)
- Contexto persistente por tarjeta

### Colaboración
- Canvas compartidos
- Edición en tiempo real
- Comentarios y sugerencias

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Ejecutar todo en desarrollo
npm run build        # Construir todo para producción
npm run lint         # Linter en todo el proyecto
npm run type-check   # Verificación de tipos
npm run clean        # Limpiar archivos generados
```

## 📚 Documentación

- [Guía de Contribución](./CONTRIBUTING.md)
- [API Documentation](./docs/api.md)
- [Componentes](./docs/components.md)
- [Base de Datos](./docs/database.md)

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](./LICENSE) para más detalles.

## 🙏 Agradecimientos

- [Supabase](https://supabase.com) por la excelente plataforma
- [React Flow](https://reactflow.dev) por el canvas infinito
- [Next.js](https://nextjs.org) por el framework
- [Tailwind CSS](https://tailwindcss.com) por los estilos

---

**¿Tienes preguntas?** Abre un issue o contacta al equipo de desarrollo.
