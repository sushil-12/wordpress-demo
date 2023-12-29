const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
        throw new CustomError(401, 'Unauthorized - No Authorization token passed!');
    }

    const token = authorizationHeader.split(' ')[1];
    if (!token) {
        throw new CustomError(401, 'Unauthorized - Invalid token format');
    }
    
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Forbidden: Invalid token' });
    }

    req.user = user; // Attach user information to req
    next();
  });
};

module.exports = authenticateToken;
