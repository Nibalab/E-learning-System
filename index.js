import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import usersRoutes from './src/routes/user.routes.js';
import classRoutes from './src/routes/class.routes.js';
import enrollmentRoutes from './src/routes/enrollment.routes.js';
import withdrawalRoutes from './src/routes/withdrawal.js';
import fileRoutes from './src/routes/file.routes.js';
import connectToDatabase from './src/database/connection.js';

// Load environment variables from .env file
dotenv.config();

// Create an Express application
const app = express();

// Set up the __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use JSON middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Set up routes
app.use('/users', usersRoutes);
app.use('/classes', classRoutes);
app.use('/enrollments', enrollmentRoutes);
app.use('/withdrawals', withdrawalRoutes);
app.use('/files', fileRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Connect to the database and start the server
connectToDatabase().then(() => {
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(error => {
  console.error('Database connection failed:', error);
  process.exit(1);
});
