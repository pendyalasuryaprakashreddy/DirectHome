const express = require('express');
const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/documents');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'doc-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only images and PDF files are allowed'));
  }
});

// Get current user profile
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, phone, email, role, verified, trust_score, created_at FROM users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Update user profile
router.put('/me', authenticateToken, async (req, res) => {
  try {
    const { name, email } = req.body;
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (name) {
      updates.push(`name = $${paramCount++}`);
      values.push(name);
    }
    if (email) {
      updates.push(`email = $${paramCount++}`);
      values.push(email);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    values.push(req.user.id);
    const query = `UPDATE users SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${paramCount} RETURNING id, name, phone, email, role, verified, trust_score`;
    
    const result = await pool.query(query, values);
    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Upload ID document for verification
router.post('/verify/upload-id', authenticateToken, upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Document file required' });
    }

    const filePath = `/uploads/documents/${req.file.filename}`;
    
    const result = await pool.query(
      'INSERT INTO documents (user_id, type, file_path) VALUES ($1, $2, $3) RETURNING *',
      [req.user.id, 'id_proof', filePath]
    );

    res.json({ 
      message: 'Document uploaded successfully',
      document: result.rows[0]
    });
  } catch (error) {
    console.error('Upload document error:', error);
    res.status(500).json({ error: 'Failed to upload document' });
  }
});

// Get user documents
router.get('/documents', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM documents WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );

    res.json({ documents: result.rows });
  } catch (error) {
    console.error('Get documents error:', error);
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});

module.exports = router;
