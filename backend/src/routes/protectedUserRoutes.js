const express = require('express');
const { verifyToken } = require('../middleware/authMiddleware');
const { getProfile } = require('../controllers/protected/UserController');
const { uploadMediaToLibrary, deleteMedia } = require('../controllers/common/FileUploader');
const { getAllMedia, editMedia, getAllImages } = require('../controllers/common/MediaOperations');
const { createEditPost, getAllPosts, getPostById, deletePost } = require('../controllers/protected/PostOperations');

const router = express.Router();

// Apply the token verification middleware to all routes in this router
router.use(verifyToken);

// Protected routes
router.get('/profile', getProfile);
router.post('/media/upload', uploadMediaToLibrary);
router.get('/media/all', getAllMedia);
router.get('/images/all', getAllImages);
router.put('/edit/media', editMedia);
router.delete('/delete/media/:media_id', deleteMedia);

router.post('/create-or-update/post', createEditPost);
router.get('/get-all-post/:post_type', getAllPosts);
router.get('/get-post/:post_id', getPostById);
router.delete('/delete-post/:post_id', deletePost);

module.exports = router;