import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { authorizeRole } from '../middleware/roles.js';
import Withdrawal from '../models/Withdrawal.js';
import Enrollment from '../models/Enrollment.js';

const router = express.Router();

// Route to request a withdrawal from a class
router.post('/request', authenticateToken, async (req, res) => {
  try {
    const { enrollmentId } = req.body;
    const enrollment = await Enrollment.findById(enrollmentId);

    if (!enrollment || enrollment.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    const newWithdrawal = new Withdrawal({ user: req.user._id, class: enrollment.class, status: 'pending' });
    await newWithdrawal.save();

    res.status(201).json({ message: 'Withdrawal request submitted', withdrawal: newWithdrawal });
  } catch (error) {
    res.status(500).json({ message: 'Error requesting withdrawal', error: error.message });
  }
});


router.patch('/:id/status', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const withdrawal = await Withdrawal.findByIdAndUpdate(id, { status }, { new: true });

    if (!withdrawal) {
      return res.status(404).json({ message: 'Withdrawal request not found' });
    }

    res.status(200).json({ message: 'Withdrawal status updated', withdrawal });
  } catch (error) {
    res.status(500).json({ message: 'Error updating withdrawal status', error: error.message });
  }
});

export default router;
