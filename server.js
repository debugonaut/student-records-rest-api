import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { connectDB, getDBStatus } from './config/db.js';
import recordRoutes from './routes/recordRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Global Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Handle Malformed JSON Payloads gracefully
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      error: 'MalformedJSONError',
      message: 'The request body contains invalid, malformed JSON syntax.',
      details: err.message,
    });
  }
  next(err);
});

// Telemetry / Health Check Endpoint
app.get('/api/health', (req, res) => {
  const dbStatus = getDBStatus();
  res.status(200).json({
    success: true,
    statusCode: 200,
    service: 'Student Records RESTful API',
    status: 'healthy',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    database: dbStatus,
    endpoints: {
      getAllRecords: 'GET /api/records',
      createRecord: 'POST /api/records',
      getRecordById: 'GET /api/records/:id',
      updateRecord: 'PUT /api/records/:id',
      patchRecord: 'PATCH /api/records/:id',
      deleteRecord: 'DELETE /api/records/:id',
      databaseStats: 'GET /api/stats',
      seedDatabase: 'POST /api/records/seed',
    },
  });
});

// Mount CRUD REST Routes
app.use('/api', recordRoutes);

// Serve static frontend assets
const publicPath = path.resolve(__dirname, 'public');
app.use(express.static(publicPath));

// Fallback for API routes (404)
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    error: 'EndpointNotFound',
    message: `API route '${req.originalUrl}' does not exist on this server.`,
    availableRoutes: '/api/health',
  });
});

// Fallback for SPA frontend routing
app.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

// Global Exception Handler
app.use((err, req, res, next) => {
  console.error('[InternalServerError]', err);
  res.status(500).json({
    success: false,
    statusCode: 500,
    error: 'InternalServerError',
    message: 'An unexpected internal server error occurred while processing the request.',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Start Server when run directly
if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`[Server] RESTful API running on http://localhost:${PORT}`);
    console.log(`[Server] Health Check available at http://localhost:${PORT}/api/health`);
    console.log(`[Server] Records endpoint available at http://localhost:${PORT}/api/records`);
  });
}

export default app;
