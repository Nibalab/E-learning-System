import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import cors from 'cors';
import usersRoutes from './src/routes/user.routes.js';
import classRoutes from './src/routes/class.routes.js';
import enrollmentRoutes from './src/routes/enrollment.routes.js';
import withdrawalRoutes from './src/routes/withdrawal.routes.js';
import fileRoutes from './src/routes/file.routes.js';
import connectToDatabase from './src/database/connection.js';


dotenv.config();


const app = express();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(express.json());


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(cors({
    origin: 'http://localhost:3000', // Specify allowed origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
    credentials: true,
  }));

  app.options('*', cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use('/users', usersRoutes);
app.use('/classes', classRoutes);
app.use('/enrollments', enrollmentRoutes);
app.use('/withdrawals', withdrawalRoutes);
app.use('/files', fileRoutes);


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});


connectToDatabase().then(() => {
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(error => {
  console.error('Database connection failed:', error);
  process.exit(1);
});
