const express = require('express');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');
const { generateOTP, verifyOTP } = require('../utils/otp');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Request OTP
router.post('/otp/request', [
  body('phone').isMobilePhone('en-IN').withMessage('Valid Indian phone number required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { phone } = req.body;
    const otp = generateOTP(phone);

    res.json({ 
      message: 'OTP sent successfully',
      // For demo, include OTP in response (remove in production)
      otp: process.env.NODE_ENV === 'development' ? otp : undefined
    });
  } catch (error) {
    console.error('OTP request error:', error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

// Verify OTP and login/register
router.post('/otp/verify', [
  body('phone').isMobilePhone('en-IN').withMessage('Valid Indian phone number required'),
  body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { phone, otp, name } = req.body;

    // Verify OTP
    const verification = verifyOTP(phone, otp);
    if (!verification.valid) {
      return res.status(400).json({ error: verification.error });
    }

    // Check if user exists
    let userResult = await pool.query('SELECT * FROM users WHERE phone = $1', [phone]);

    let user;
    if (userResult.rows.length === 0) {
      // Create new user
      const insertResult = await pool.query(
        'INSERT INTO users (name, phone, role) VALUES ($1, $2, $3) RETURNING *',
        [name || 'User', phone, 'buyer']
      );
      user = insertResult.rows[0];
    } else {
      user = userResult.rows[0];
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, phone: user.phone, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    // Remove sensitive data
    delete user.phone;

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        verified: user.verified,
        trust_score: user.trust_score
      }
    });
  } catch (error) {
    console.error('OTP verify error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

module.exports = router;
