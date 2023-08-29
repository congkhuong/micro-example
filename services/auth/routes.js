const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const authenticateToken = require('./middleware/authenticate');

const secretKey = 'secret';

router.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'This is a protected route', userId: req.userId });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // TODO: Verify with real data
  if (!username || username !== 'admin') {
    return res.status(401).json({ message: 'Authentication failed' });
  }

  // Generate JWT token
  const token = jwt.sign({ id: 1 }, secretKey, { expiresIn: '1w' });

  res.json({ token });
});

module.exports = router;
