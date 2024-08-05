import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { authorizeRole } from '../middleware/roles.js';
import { uploadFile, upload, listFiles, downloadFile } from '../controllers/file.controller.js';

const router = express.Router();


router.post('/upload', authenticateToken, authorizeRole('admin'), upload, uploadFile);


router.get('/list', authenticateToken, listFiles);


router.get('/download/:id', authenticateToken, downloadFile);

export default router;
