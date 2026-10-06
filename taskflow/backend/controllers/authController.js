import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Generate JWT token for an authenticated user
 */
const generateToken = (id, email) => {
  const secret = process.env.JWT_SECRET || 'taskflow_super_secret_jwt_key_2026';
  return jwt.sign({ id, email }, secret, {
    expiresIn: '7d', // Token valid for 7 days
  });
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/signup
 * @access  Public
 */
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate inputs
    if (!name || name.trim() === '') {
      return res.status(400).json({ message: 'Please enter your name' });
    }

    if (!email || email.trim() === '') {
      return res.status(400).json({ message: 'Please enter a valid email' });
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Please enter a valid email format' });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }

    // Hash the password with bcryptjs
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create and save new user
    const newUser = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
    });

    // Generate JWT token
    const token = generateToken(newUser._id, newUser.email);

    // Send response without password
    return res.status(201).json({
      message: 'Account created successfully',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ message: 'Something went wrong. Please try again later.' });
  }
};

/**
 * @desc    Authenticate existing user and get token
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate inputs
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide both email and password' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = generateToken(user._id, user.email);

    return res.status(200).json({
      message: 'Logged in successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Something went wrong. Please try again later.' });
  }
};
