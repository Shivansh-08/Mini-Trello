// In server/routes/listRoutes.js

import express from 'express';
import { createList, deleteList } from '../controllers/listController.js'; // <-- Add deleteList
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, createList);
router.route('/:id').delete(protect, deleteList); // <-- This line will now work

export default router;