const express = require('express');
const { verifyToken } = require('../middleware/authMiddleware');
const { getProfile } = require('../controllers/protected/UserController');

const router = express.Router();

// Apply the token verification middleware to all routes in this router
router.use(verifyToken);

// Protected routes
router.get('/profile', getProfile);

module.exports = router;