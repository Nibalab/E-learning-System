import express from 'express';
import { register, login } from '../controllers/user.controller.js';
import { authenticateToken } from '../middleware/auth.js';
import { authorizeRole } from '../middleware/roles.js';

const router = express.Router();


router.post('/register', register);


router.post('/login', login);


router.get('/profile', authenticateToken, async (req, res) => {
  try {
    // Accessing the user info attached by the authenticateToken middleware
    const user = req.user;
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user profile', error: error.message });
  }
});

router.get('/all-users', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    
    const users = await User.find();
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

export default router;
