// In server/routes/authRoutes.js

import express from 'express';
import { 
  registerUser, 
  loginUser, 
  getUserProfile // Import the new controller
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js'; // Import the middleware

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

// Add the protected route
router.route('/profile').get(protect, getUserProfile);

export default router;