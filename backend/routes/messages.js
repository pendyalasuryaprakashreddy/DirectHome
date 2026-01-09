const express = require('express');
const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const { detectSpam } = require('../services/ai');

const router = express.Router();

// Get conversations for current user
router.get('/conversations', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT DISTINCT 
        CASE 
          WHEN m.from_user_id = $1 THEN m.to_user_id 
          ELSE m.from_user_id 
        END as other_user_id,
        u.name as other_user_name,
        u.verified as other_user_verified,
        (SELECT content FROM messages 
         WHERE (from_user_id = $1 AND to_user_id = CASE WHEN m.from_user_id = $1 THEN m.to_user_id ELSE m.from_user_id END)
            OR (to_user_id = $1 AND from_user_id = CASE WHEN m.from_user_id = $1 THEN m.to_user_id ELSE m.from_user_id END)
         ORDER BY created_at DESC LIMIT 1) as last_message,
        (SELECT created_at FROM messages 
         WHERE (from_user_id = $1 AND to_user_id = CASE WHEN m.from_user_id = $1 THEN m.to_user_id ELSE m.from_user_id END)
            OR (to_user_id = $1 AND from_user_id = CASE WHEN m.from_user_id = $1 THEN m.to_user_id ELSE m.from_user_id END)
         ORDER BY created_at DESC LIMIT 1) as last_message_time,
        (SELECT COUNT(*) FROM messages 
         WHERE to_user_id = $1 AND from_user_id = CASE WHEN m.from_user_id = $1 THEN m.to_user_id ELSE m.from_user_id END
         AND read = false) as unread_count
       FROM messages m
       JOIN users u ON u.id = CASE WHEN m.from_user_id = $1 THEN m.to_user_id ELSE m.from_user_id END
       WHERE m.from_user_id = $1 OR m.to_user_id = $1
       ORDER BY last_message_time DESC`,
      [req.user.id]
    );

    res.json({ conversations: result.rows });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
});

// Get messages with a specific user
router.get('/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const { propertyId } = req.query;

    let query = `
      SELECT m.*, 
        u1.name as from_user_name,
        u2.name as to_user_name,
        p.title as property_title
      FROM messages m
      JOIN users u1 ON m.from_user_id = u1.id
      JOIN users u2 ON m.to_user_id = u2.id
      LEFT JOIN properties p ON m.property_id = p.id
      WHERE (m.from_user_id = $1 AND m.to_user_id = $2) 
         OR (m.from_user_id = $2 AND m.to_user_id = $1)
    `;
    const params = [req.user.id, userId];

    if (propertyId) {
      query += ` AND m.property_id = $3`;
      params.push(propertyId);
    }

    query += ` ORDER BY m.created_at ASC`;

    const result = await pool.query(query, params);

    // Mark messages as read
    await pool.query(
      'UPDATE messages SET read = true WHERE to_user_id = $1 AND from_user_id = $2 AND read = false',
      [req.user.id, userId]
    );

    res.json({ messages: result.rows });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Send message
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { to_user_id, property_id, content } = req.body;

    if (!to_user_id || !content) {
      return res.status(400).json({ error: 'to_user_id and content are required' });
    }

    // Detect spam
    const spamScore = detectSpam(content);

    // Insert message
    const result = await pool.query(
      `INSERT INTO messages (from_user_id, to_user_id, property_id, content, spam_score)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [req.user.id, to_user_id, property_id || null, content, spamScore]
    );

    res.status(201).json({ message: result.rows[0] });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

module.exports = router;
