import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import advisoryRoutes from './routes/advisoryRoutes.js';
import { supabaseAdmin } from './lib/supabaseClient.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security & CORS Configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000'
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g., mobile apps, curl, Postman) or matched origins
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // Permissive during local development for ease of testing
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '5mb' }));

// Request Logging
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
});

// Health & System Info Route
app.get('/api/health', async (req, res) => {
  let dbStatus = 'untested';
  try {
    const { error } = await supabaseAdmin.from('profiles').select('id').limit(1);
    dbStatus = error ? `connected (table query note: ${error.message})` : 'healthy & connected';
  } catch (err) {
    dbStatus = `offline (${err.message})`;
  }

  res.json({
    status: 'ok',
    service: 'CropPilotAI Backend API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: {
      port: PORT,
      supabaseConfigured: Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY),
      geminiConfigured: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'placeholder-gemini-api-key')
    },
    databaseStatus: dbStatus
  });
});

// Register API Routes
app.use('/api/auth', authRoutes);
app.use('/api/advisories', advisoryRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: `API route ${req.method} ${req.path} does not exist.`
  });
});

// Central Error Handler
app.use((err, req, res, next) => {
  console.error('[Unhandled Server Error]:', err);
  res.status(err.status || 500).json({
    success: false,
    error: 'Internal Server Error',
    message: err.message || 'An unexpected error occurred.'
  });
});

app.listen(PORT, () => {
  console.log('==================================================');
  console.log(`🌾 CropPilotAI Server running on http://localhost:${PORT}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`🔒 Supabase Configured: ${Boolean(process.env.SUPABASE_URL)}`);
  console.log(`🤖 Gemini Configured: ${Boolean(process.env.GEMINI_API_KEY)}`);
  console.log('==================================================');
});

export default app;
