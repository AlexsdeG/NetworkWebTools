import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/authRoutes.js';
import toolRoutes from './routes/toolRoutes.js';
import { apiLimiter } from './middleware/rateLimit.js';

const app: Application = express();

// If the app is behind a proxy (nginx/load balancer), trust the proxy so
// Express and middleware like express-rate-limit can read the correct client IP
// from the `X-Forwarded-For` header. Set to `true` to trust the first proxy.
app.set('trust proxy', true);

// Sicherheits-Middleware
// Fix: Cast middleware to any to satisfy Express types
app.use(helmet() as any);

// CORS Konfiguration (Erlaubt Frontend Zugriff)
// Parse allowed origins from env (comma-separated) and validate at runtime so
// the server responds with a single matching Access-Control-Allow-Origin value.
const rawCors = process.env.CORS_ORIGIN || 'http://localhost:3000';
const allowedOrigins = rawCors.split(',').map(s => s.trim()).filter(Boolean);

app.use(cors({
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow non-browser requests (e.g., curl, server-to-server) with no Origin
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
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