// In server/routes/cardRoutes.js

import express from 'express';
import { createCard, moveCard,deleteCard } from '../controllers/cardController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, createCard);
router.route('/move').put(protect, moveCard);
// In server/routes/cardRoutes.js
router.route('/:id').delete(protect, deleteCard);

export default router;