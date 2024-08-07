import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { authorizeRole } from '../middleware/roles.js';
import Class from '../models/Class.js';  

const router = express.Router();

router.post('/create', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const { name, description } = req.body;
    const newClass = new Class({ name, description });
    await newClass.save();
    res.status(201).json({ message: 'Class created successfully', class: newClass });
  } catch (error) {
    res.status(500).json({ message: 'Error creating class', error: error.message });
  }
});


router.get('/list', authenticateToken, async (req, res) => {
  try {
    const classes = await Class.find();
    res.status(200).json({ classes });
  } catch (error) {
    console.error('Error fetching classes:', error);
    res.status(500).json({ message: 'Error fetching classes', error: error.message });
  }
});

export default router;
