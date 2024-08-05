// routes/enrollment.routes.js
import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import Enrollment from '../models/Enrollment.js';
import Class from '../models/Class.js';

const router = express.Router();

// Route to enroll in a class
router.post('/enroll', authenticateToken, async (req, res) => {
  try {
    const { classId } = req.body;
    const classExists = await Class.findById(classId);

    if (!classExists) {
      return res.status(404).json({ message: 'Class not found' });
    }

    const newEnrollment = new Enrollment({ user: req.user._id, class: classId });
    await newEnrollment.save();

    res.status(201).json({ message: 'Enrolled successfully', enrollment: newEnrollment });
  } catch (error) {
    res.status(500).json({ message: 'Error enrolling in class', error: error.message });
  }
});

// Route to list enrollments for a user
router.get('/my-enrollments', authenticateToken, async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ user: req.user._id }).populate('class');
    res.status(200).json({ enrollments });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching enrollments', error: error.message });
  }
});

export default router;
