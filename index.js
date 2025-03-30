// import express from 'express';
// import DBConnection from './db/db.js';
// import dotenv from 'dotenv';
// import userRoutes from './routes/user.route.js';
// import authRoutes from './routes/auth.route.js';
// import router from './routes/routes.js';
// import cookieParser from 'cookie-parser';
// import cors from 'cors';
// import path from 'path';
// import { fileURLToPath } from 'url';

// dotenv.config();
// DBConnection();

// // Get proper __dirname in ES module
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const app = express();

// app.use(cors({
//   origin: ['https://filexchange-ydt.vercel.app', 'http://localhost:5173'],
//   credentials: true,
// }));

// app.use(express.json());
// app.use(cookieParser());

// // API routes
// app.use('/api/user', userRoutes);
// app.use('/api/auth', authRoutes);
// app.use('/api/files', router);

// // Create uploads directory if it doesn't exist
// import fs from 'fs';
// if (!fs.existsSync('./uploads')) {
//   fs.mkdirSync('./uploads');
// }

// // Catch-all route (make sure path is correct)
// app.get('*', (req, res) => {
//   const indexPath = path.join(__dirname, 'client', 'dist', 'index.html');
//   if (fs.existsSync(indexPath)) {
//     res.sendFile(indexPath);
//   } else {
//     res.status(404).send(`Frontend file not found. Looking for: ${indexPath}`);
//   }
// });

// // Global error handler
// app.use((err, req, res, next) => {
//   const statusCode = err.statusCode || 500;
//   const message = err.message || 'Internal Server Error';
//   return res.status(statusCode).json({
//     success: false,
//     message,
//     statusCode,
//   });
// });

// app.listen(3000, () => {
//   console.log('Server listening on port 3000');
// });


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
DBConnection();

// Get proper __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Configure CORS to allow requests from Vercel frontend and localhost
app.use(cors({
  origin: ['https://filexchange-ydt.vercel.app', 'http://localhost:5173'],
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// API routes
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/files', router);

// Create uploads directory if it doesn't exist
if (!fs.existsSync('./uploads')) {
  fs.mkdirSync('./uploads');
}

// Simple health check route
app.get('/', (req, res) => {
  res.status(200).send('Server is running. API available at /api endpoints.');
});

// Debug route to check environment
app.get('/api/debug', (req, res) => {
  res.json({
    environment: process.env.NODE_ENV,
    serverTime: new Date().toISOString(),
    message: 'Backend server is running correctly'
  });
});

// Global error handler
app.use((err, req, res, next) => {
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
});
