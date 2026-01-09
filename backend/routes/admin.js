const express = require('express');
const pool = require('../config/database');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// All admin routes require admin role
router.use(authenticateToken);
router.use(requireRole('admin'));

// Get dashboard stats
router.get('/dashboard', async (req, res) => {
  try {
    const [
      totalUsers,
      totalProperties,
      pendingProperties,
      pendingVerifications,
      recentMessages
    ] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM users'),
      pool.query('SELECT COUNT(*) FROM properties'),
      pool.query("SELECT COUNT(*) FROM properties WHERE status = 'pending_review'"),
      pool.query('SELECT COUNT(*) FROM documents WHERE verified = false'),
      pool.query('SELECT COUNT(*) FROM messages WHERE created_at > NOW() - INTERVAL \'24 hours\'')
    ]);

    res.json({
      stats: {
        totalUsers: parseInt(totalUsers.rows[0].count),
        totalProperties: parseInt(totalProperties.rows[0].count),
        pendingProperties: parseInt(pendingProperties.rows[0].count),
        pendingVerifications: parseInt(pendingVerifications.rows[0].count),
        recentMessages: parseInt(recentMessages.rows[0].count)
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;
    const result = await pool.query(
      'SELECT id, name, phone, email, role, verified, trust_score, created_at FROM users ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [parseInt(limit), parseInt(offset)]
    );
    res.json({ users: result.rows });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get pending properties
router.get('/properties/pending', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, u.name as seller_name, u.verified as seller_verified
       FROM properties p
       JOIN users u ON p.user_id = u.id
       WHERE p.status = 'pending_review'
       ORDER BY p.created_at DESC`
    );
    res.json({ properties: result.rows });
  } catch (error) {
    console.error('Get pending properties error:', error);
    res.status(500).json({ error: 'Failed to fetch pending properties' });
  }
});

// Approve/reject property
router.put('/properties/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['active', 'inactive', 'pending_review'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const result = await pool.query(
      'UPDATE properties SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }

    res.json({ property: result.rows[0] });
  } catch (error) {
    console.error('Update property status error:', error);
    res.status(500).json({ error: 'Failed to update property status' });
  }
});

// Get pending verifications
router.get('/verifications/pending', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT d.*, u.name as user_name, u.phone as user_phone, p.title as property_title
       FROM documents d
       JOIN users u ON d.user_id = u.id
       LEFT JOIN properties p ON d.property_id = p.id
       WHERE d.verified = false
       ORDER BY d.created_at DESC`
    );
    res.json({ documents: result.rows });
  } catch (error) {
    console.error('Get pending verifications error:', error);
    res.status(500).json({ error: 'Failed to fetch pending verifications' });
  }
});

// Approve/reject verification
router.put('/verifications/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { verified } = req.body;

    const result = await pool.query(
      `UPDATE documents 
       SET verified = $1, verified_at = CASE WHEN $1 = true THEN CURRENT_TIMESTAMP ELSE NULL END, verified_by = $2
       WHERE id = $3
       RETURNING *`,
      [verified, req.user.id, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Document not found' });
    }

    const doc = result.rows[0];

    // If ID proof is verified, update user verification status
    if (doc.type === 'id_proof' && verified) {
      await pool.query(
        'UPDATE users SET verified = true, trust_score = GREATEST(trust_score, 50) WHERE id = $1',
        [doc.user_id]
      );
    }

    res.json({ document: doc });
  } catch (error) {
    console.error('Update verification error:', error);
    res.status(500).json({ error: 'Failed to update verification' });
  }
});

module.exports = router;
