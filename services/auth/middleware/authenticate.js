const jwt = require('jsonwebtoken');
const secretKey = 'secret';

function authenticateToken(req, res, next) {
  const token = req.header('Authorization');
  console.log('token', token);

  if (!token) {
    return res.status(401).json({ message: 'Authorization token not provided' });
  }

  jwt.verify(token.split(' ')[1] , secretKey, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.userId = decoded.id;
    next();
  });
}

module.exports = authenticateToken;
