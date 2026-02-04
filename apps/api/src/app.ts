import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/authRoutes.js';
import toolRoutes from './routes/toolRoutes.js';
import { apiLimiter } from './middleware/rateLimit.js';

const app: Application = express();

// Sicherheits-Middleware
// Fix: Cast middleware to any to satisfy Express types
app.use(helmet() as any);

// CORS Konfiguration (Erlaubt Frontend Zugriff)
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? false : 'http://localhost:5173', // Vite Default Port
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}) as any);

// Rate Limiting global für alle API Routen
// Schützt vor Brute-Force und DoS
app.use('/api', apiLimiter as any);

// Body Parser
// Fix: Cast express.json() to any
app.use(express.json() as any);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tools', toolRoutes);

// Basis Route / Health Check
app.get('/health', (req: Request, res: Response) => {
  // Fix: Cast res to any to avoid "status does not exist" error
  (res as any).status(200).json({
    status: 'ok',
    message: 'System läuft stabil',
    timestamp: new Date().toISOString()
  });
});

export default app;