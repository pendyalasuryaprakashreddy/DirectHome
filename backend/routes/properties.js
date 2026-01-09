const express = require('express');
const pool = require('../config/database');
const { authenticateToken, requireRole } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { calculateFraudRiskScore, recommendPrice } = require('../services/ai');

const router = express.Router();

// Configure multer for property images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/properties');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'prop-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed'));
  }
});

// Get all properties (public)
router.get('/', async (req, res) => {
  try {
    const { status = 'active', limit = 50, offset = 0 } = req.query;
    
    const result = await pool.query(
      `SELECT p.*, u.name as seller_name, u.verified as seller_verified, u.trust_score as seller_trust_score,
       (SELECT file_path FROM property_media WHERE property_id = p.id AND is_primary = true LIMIT 1) as primary_image
       FROM properties p
       JOIN users u ON p.user_id = u.id
       WHERE p.status = $1
       ORDER BY p.created_at DESC
       LIMIT $2 OFFSET $3`,
      [status, parseInt(limit), parseInt(offset)]
    );

    const countResult = await pool.query(
      'SELECT COUNT(*) FROM properties WHERE status = $1',
      [status]
    );

    res.json({
      properties: result.rows,
      total: parseInt(countResult.rows[0].count),
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    console.error('Get properties error:', error);
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

// Get single property
router.get('/:id', async (req, res) => {
  try {
    const propertyResult = await pool.query(
      `SELECT p.*, u.name as seller_name, u.phone as seller_phone, u.verified as seller_verified, 
       u.trust_score as seller_trust_score
       FROM properties p
       JOIN users u ON p.user_id = u.id
       WHERE p.id = $1`,
      [req.params.id]
    );

    if (propertyResult.rows.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }

    const mediaResult = await pool.query(
      'SELECT * FROM property_media WHERE property_id = $1 ORDER BY is_primary DESC, created_at ASC',
      [req.params.id]
    );

    const property = propertyResult.rows[0];
    property.media = mediaResult.rows;

    res.json({ property });
  } catch (error) {
    console.error('Get property error:', error);
    res.status(500).json({ error: 'Failed to fetch property' });
  }
});

// Create property (seller only)
router.post('/', authenticateToken, requireRole('seller', 'admin'), upload.array('images', 10), async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      bhk,
      city,
      state,
      address,
      lat,
      lng,
      amenities
    } = req.body;

    // Get user details for risk calculation
    const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [req.user.id]);
    const user = userResult.rows[0];

    // Parse amenities
    let amenitiesArray = [];
    if (amenities) {
      amenitiesArray = typeof amenities === 'string' ? JSON.parse(amenities) : amenities;
    }

    // Create property
    const propertyResult = await pool.query(
      `INSERT INTO properties (user_id, title, description, price, bhk, city, state, address, lat, lng, amenities, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'pending_review')
       RETURNING *`,
      [req.user.id, title, description, parseFloat(price), parseInt(bhk), city, state, address, 
       lat ? parseFloat(lat) : null, lng ? parseFloat(lng) : null, JSON.stringify(amenitiesArray)]
    );

    const property = propertyResult.rows[0];

    // Calculate risk score
    const riskScore = calculateFraudRiskScore(property, user);
    await pool.query('UPDATE properties SET risk_score = $1 WHERE id = $2', [riskScore, property.id]);
    property.risk_score = riskScore;

    // Upload images
    if (req.files && req.files.length > 0) {
      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        const filePath = `/uploads/properties/${file.filename}`;
        await pool.query(
          'INSERT INTO property_media (property_id, file_path, media_type, is_primary) VALUES ($1, $2, $3, $4)',
          [property.id, filePath, 'image', i === 0]
        );
      }
    }

    res.status(201).json({ property });
  } catch (error) {
    console.error('Create property error:', error);
    res.status(500).json({ error: 'Failed to create property' });
  }
});

// Update property
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    // Check ownership or admin
    const propertyResult = await pool.query('SELECT user_id FROM properties WHERE id = $1', [req.params.id]);
    if (propertyResult.rows.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }

    if (propertyResult.rows[0].user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const {
      title,
      description,
      price,
      bhk,
      city,
      state,
      address,
      lat,
      lng,
      amenities,
      status
    } = req.body;

    const updates = [];
    const values = [];
    let paramCount = 1;

    if (title) { updates.push(`title = $${paramCount++}`); values.push(title); }
    if (description !== undefined) { updates.push(`description = $${paramCount++}`); values.push(description); }
    if (price) { updates.push(`price = $${paramCount++}`); values.push(parseFloat(price)); }
    if (bhk) { updates.push(`bhk = $${paramCount++}`); values.push(parseInt(bhk)); }
    if (city) { updates.push(`city = $${paramCount++}`); values.push(city); }
    if (state) { updates.push(`state = $${paramCount++}`); values.push(state); }
    if (address) { updates.push(`address = $${paramCount++}`); values.push(address); }
    if (lat) { updates.push(`lat = $${paramCount++}`); values.push(parseFloat(lat)); }
    if (lng) { updates.push(`lng = $${paramCount++}`); values.push(parseFloat(lng)); }
    if (amenities) {
      const amenitiesArray = typeof amenities === 'string' ? JSON.parse(amenities) : amenities;
      updates.push(`amenities = $${paramCount++}`);
      values.push(JSON.stringify(amenitiesArray));
    }
    if (status && req.user.role === 'admin') {
      updates.push(`status = $${paramCount++}`);
      values.push(status);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    values.push(req.params.id);
    const query = `UPDATE properties SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${paramCount} RETURNING *`;
    
    const result = await pool.query(query, values);
    res.json({ property: result.rows[0] });
  } catch (error) {
    console.error('Update property error:', error);
    res.status(500).json({ error: 'Failed to update property' });
  }
});

// Delete property
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const propertyResult = await pool.query('SELECT user_id FROM properties WHERE id = $1', [req.params.id]);
    if (propertyResult.rows.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }

    if (propertyResult.rows[0].user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await pool.query('DELETE FROM properties WHERE id = $1', [req.params.id]);
    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Delete property error:', error);
    res.status(500).json({ error: 'Failed to delete property' });
  }
});

// Get price recommendation
router.post('/price-recommendation', authenticateToken, async (req, res) => {
  try {
    const { city, bhk, amenities } = req.body;
    const recommendation = recommendPrice({ city, bhk: parseInt(bhk), amenities: amenities || [] });
    res.json({ recommendation });
  } catch (error) {
    console.error('Price recommendation error:', error);
    res.status(500).json({ error: 'Failed to get price recommendation' });
  }
});

module.exports = router;
