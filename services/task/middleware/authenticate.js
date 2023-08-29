const { authStub } = require('../stub');

function authenticateToken(req, res, next) {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Authorization token not provided' });
  }

  authStub.IntrospectToken({ token: token.split(' ')[1] }, (err, payload) => {
    if(err) {
      return res.status(401).json({ message: 'Authorization token is invalid' });
    }

    req.user = payload;
    next();
  });
}

module.exports = authenticateToken;
