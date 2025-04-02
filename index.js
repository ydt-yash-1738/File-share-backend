import express from 'express';
import DBConnection from './db/db.js';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import router from './routes/routes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

dotenv.config();

// Connect to database
DBConnection();

// Get proper __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Configure CORS
// app.use(cors({
//   origin: ['https://filexchange-ydt.vercel.app', 'http://localhost:5173'],
//   credentials: true,
// }));

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow specific domains
    const allowedOrigins = [
      'https://filexchange-ydt.vercel.app', 
      'http://localhost:5173'
    ];
    
    // Check for specific domains
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // Allow all GitHub dev domains
    if (origin.includes('.github.dev')) {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json());
app.use(cookieParser());

// Create uploads directory with absolute path
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log(`Created uploads directory at: ${uploadsDir}`);
}

// Set environment variable for uploads path
process.env.UPLOAD_DIR = uploadsDir;
console.log(`Upload directory set to: ${uploadsDir}`);

// Set base URL for file downloads
process.env.BASE_URL = process.env.BASE_URL || 'https://file-share-backend-iha5.onrender.com';
console.log(`Base URL set to: ${process.env.BASE_URL}`);

// API routes
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/files', router);

// Static file serving for uploads directory
// This ensures uploads can be accessed via HTTP
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Simple health check route
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'Server is running',
    message: 'API available at /api endpoints',
    uploadDir: uploadsDir,
    baseUrl: process.env.BASE_URL
  });
});

// Debug route to check environment
app.get('/api/debug', (req, res) => {
  res.json({
    environment: process.env.NODE_ENV,
    serverTime: new Date().toISOString(),
    message: 'Backend server is running correctly',
    uploadDir: uploadsDir,
    baseUrl: process.env.BASE_URL,
    uploadsExists: fs.existsSync(uploadsDir),
    uploadsWritable: fs.accessSync(uploadsDir, fs.constants.W_OK, (err) => !err)
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler caught:', err);
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  console.log(`Server running at ${process.env.BASE_URL || 'http://localhost:' + PORT}`);
});
