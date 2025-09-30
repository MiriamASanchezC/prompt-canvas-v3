import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import jwt from '@fastify/jwt';
import cookie from '@fastify/cookie';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const fastify = Fastify({
  logger: {
    level: process.env.NODE_ENV === 'development' ? 'info' : 'warn',
  },
});

// Register plugins
async function registerPlugins() {
  await fastify.register(helmet, {
    contentSecurityPolicy: false,
  });

  await fastify.register(cors, {
    origin: process.env.NODE_ENV === 'development' 
      ? ['http://localhost:3000', 'http://localhost:3001']
      : ['https://your-domain.com'],
    credentials: true,
  });

  await fastify.register(cookie, {
    secret: process.env.JWT_SECRET,
  });

  await fastify.register(jwt, {
    secret: process.env.JWT_SECRET || 'your-secret-key',
  });
}

// Register routes
async function registerRoutes() {
  // Health check
  fastify.get('/health', async (request, reply) => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  });

  // API routes will be added here
  fastify.get('/api/health', async (request, reply) => {
    return { 
      message: 'Prompt Canvas API is running!',
      version: '1.0.0',
      timestamp: new Date().toISOString()
    };
  });
}

// Start server
async function start() {
  try {
    await registerPlugins();
    await registerRoutes();

    const port = Number(process.env.PORT) || 3001;
    const host = '0.0.0.0';

    await fastify.listen({ port, host });
    
    console.log(`🚀 Prompt Canvas API running on http://${host}:${port}`);
    console.log(`📊 Health check: http://${host}:${port}/health`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('🛑 Shutting down server...');
  await fastify.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('🛑 Shutting down server...');
  await fastify.close();
  process.exit(0);
});

start();
