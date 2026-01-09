const express = require('express');
const pool = require('../config/database');

const router = express.Router();

// Search properties with filters
router.get('/', async (req, res) => {
  try {
    const {
      city,
      state,
      minPrice,
      maxPrice,
      bhk,
      amenities,
      status = 'active',
      limit = 20,
      offset = 0
    } = req.query;

    let query = `
      SELECT p.*, u.name as seller_name, u.verified as seller_verified, u.trust_score as seller_trust_score,
      (SELECT file_path FROM property_media WHERE property_id = p.id AND is_primary = true LIMIT 1) as primary_image
      FROM properties p
      JOIN users u ON p.user_id = u.id
      WHERE p.status = $1
    `;

    const params = [status];
    let paramCount = 2;

    if (city) {
      query += ` AND p.city ILIKE $${paramCount++}`;
      params.push(`%${city}%`);
    }

    if (state) {
      query += ` AND p.state ILIKE $${paramCount++}`;
      params.push(`%${state}%`);
    }

    if (minPrice) {
      query += ` AND p.price >= $${paramCount++}`;
      params.push(parseFloat(minPrice));
    }

    if (maxPrice) {
      query += ` AND p.price <= $${paramCount++}`;
      params.push(parseFloat(maxPrice));
    }

    if (bhk) {
      query += ` AND p.bhk = $${paramCount++}`;
      params.push(parseInt(bhk));
    }

    if (amenities) {
      const amenityArray = Array.isArray(amenities) ? amenities : [amenities];
      amenityArray.forEach((amenity, index) => {
        query += ` AND p.amenities::text ILIKE $${paramCount++}`;
        params.push(`%${amenity}%`);
      });
    }

    query += ` ORDER BY p.created_at DESC LIMIT $${paramCount++} OFFSET $${paramCount++}`;
    params.push(parseInt(limit), parseInt(offset));

    const result = await pool.query(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) FROM properties p WHERE p.status = $1';
    const countParams = [status];
    let countParamCount = 2;

    if (city) {
      countQuery += ` AND p.city ILIKE $${countParamCount++}`;
      countParams.push(`%${city}%`);
    }
    if (state) {
      countQuery += ` AND p.state ILIKE $${countParamCount++}`;
      countParams.push(`%${state}%`);
    }
    if (minPrice) {
      countQuery += ` AND p.price >= $${countParamCount++}`;
      countParams.push(parseFloat(minPrice));
    }
    if (maxPrice) {
      countQuery += ` AND p.price <= $${countParamCount++}`;
      countParams.push(parseFloat(maxPrice));
    }
    if (bhk) {
      countQuery += ` AND p.bhk = $${countParamCount++}`;
      countParams.push(parseInt(bhk));
    }

    const countResult = await pool.query(countQuery, countParams);

    res.json({
      properties: result.rows,
      total: parseInt(countResult.rows[0].count),
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

// Get cities with property counts
router.get('/cities', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT city, state, COUNT(*) as count 
       FROM properties 
       WHERE status = 'active' 
       GROUP BY city, state 
       ORDER BY count DESC`
    );
    res.json({ cities: result.rows });
  } catch (error) {
    console.error('Get cities error:', error);
    res.status(500).json({ error: 'Failed to fetch cities' });
  }
});

module.exports = router;
