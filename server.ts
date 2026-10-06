import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import connectDB from './taskflow/backend/config/db.js';
import authRoutes from './taskflow/backend/routes/authRoutes.js';
import taskRoutes from './taskflow/backend/routes/taskRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Initialize database connection
  await connectDB();

  // Basic Middlewares
  app.use(cors());
  app.use(express.json());

  // Mount API Endpoints
  app.use('/api/auth', authRoutes);
  app.use('/api/tasks', taskRoutes);

  // Health endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', app: 'TaskFlow' });
  });

  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    // Mount Vite middleware for fast SPA development on port 3000
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static production build files
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`TaskFlow server listening on port ${PORT}`);
  });
}

startServer();
