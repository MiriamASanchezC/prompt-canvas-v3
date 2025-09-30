# 🎨 Prompt Canvas

**Infinite Canvas for AI Conversations** - Organize your AI conversations visually and intuitively.

## 🚀 What is Prompt Canvas?

Prompt Canvas solves the context loss problem in long AI conversations. It allows you to organize your conversations on an infinite canvas where you can:

- 📝 Create organizable conversation cards
- 🔗 Visually connect related ideas
- 🎯 Maintain context across multiple conversations
- 👥 Collaborate with other users
- 🎨 Customize your cards' appearance
- 📊 Export your conversations

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Static typing
- **Tailwind CSS** - Utility-first CSS
- **React Flow** - Infinite canvas and connections
- **Supabase** - Authentication and database

### Backend
- **Fastify** - Fast and modern API
- **TypeScript** - Static typing
- **Supabase** - PostgreSQL database
- **OpenAI API** - GPT integration
- **Anthropic API** - Claude integration

## 📁 Project Structure

```
prompt-canvas/
├── apps/
│   ├── web/                 # Next.js Frontend
│   └── api/                 # Fastify Backend
├── packages/                # Shared libraries (future)
└── package.json             # Monorepo configuration
```

## 🚀 Installation

### Prerequisites
- Node.js 18+
- npm 8+
- Supabase account
- OpenAI account (optional)
- Anthropic account (optional)

### Setup
1. Clone the repository
2. Install dependencies: `npm install`
3. Create a Supabase project and setup the database
4. Configure environment variables (see `.env.example` files)
5. Run development: `npm run dev`

## 🎯 Key Features

- **Infinite Canvas** - Unlimited zoom and pan with optional grid
- **Conversation Cards** - Drag & drop organization with custom colors
- **Visual Connections** - Connect related cards with animated lines
- **AI Integration** - Multiple providers with persistent context
- **Real-time Collaboration** - Shared canvas with live editing

## 🔧 Available Scripts

```bash
npm run dev          # Run everything in development
npm run build        # Build for production
npm run lint         # Lint entire project
npm run type-check   # Type checking
```

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
