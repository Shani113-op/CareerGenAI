const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.userId) {
      return res.status(401).json({ error: 'Invalid token payload' });
    }

    req.user = { id: decoded.userId };
    next();
  } catch (err) {
    console.error('Invalid token:', err.message);
    return res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = verifyToken;
