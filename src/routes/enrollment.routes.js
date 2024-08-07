import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import Enrollment from '../models/Enrollment.js';
import Class from '../models/Class.js';

const router = express.Router();


router.post('/enroll', authenticateToken, async (req, res) => {
  try {
    const { classId } = req.body;    
    if (!classId || !classId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid class ID' });
    }

   
    const classExists = await Class.findById(classId);
    if (!classExists) {
      return res.status(404).json({ message: 'Class not found' });
    }

    
    const existingEnrollment = await Enrollment.findOne({ user: req.user._id, class: classId });
    if (existingEnrollment) {
      return res.status(400).json({ message: 'Already enrolled in this class' });
    }

    
    const newEnrollment = new Enrollment({ user: req.user._id, class: classId });
    await newEnrollment.save();
    res.status(201).json({ message: 'Enrolled successfully', enrollment: newEnrollment });
  } catch (error) {
    console.error('Enrollment error:', error); // Add logging for debugging
    res.status(500).json({ message: 'Error enrolling in class', error: error.message });
  }
});

router.get('/my-enrollments', authenticateToken, async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ user: req.user._id }).populate('class');
    res.status(200).json({ enrollments });
  } catch (error) {
    console.error('Fetch enrollments error:', error); // Add logging for debugging
    res.status(500).json({ message: 'Error fetching enrollments', error: error.message });
  }
});

export default router;
