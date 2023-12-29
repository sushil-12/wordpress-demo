const express = require('express');
const { verifyToken } = require('../middleware/authMiddleware');
const { getProfile } = require('../controllers/protected/UserController');
const { uploadMediaToLibrary, deleteMedia } = require('../controllers/common/FileUploader');
const { getAllMedia, editMedia } = require('../controllers/common/MediaOperations');

const router = express.Router();

// Apply the token verification middleware to all routes in this router
router.use(verifyToken);

// Protected routes
router.get('/profile', getProfile);
router.post('/media/upload', uploadMediaToLibrary);
router.get('/media/all', getAllMedia);
router.put('/edit/media', editMedia);
router.delete('/delete/media/:media_id', deleteMedia);

module.exports = router;