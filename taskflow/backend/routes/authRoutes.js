import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';

const router = express.Router();

// Public routes for user registration and login
router.post('/signup', registerUser);
router.post('/login', loginUser);

export default router;
