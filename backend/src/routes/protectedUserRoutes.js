const express = require('express');
const { verifyToken } = require('../middleware/authMiddleware');
const { getProfile } = require('../controllers/protected/UserController');
const { uploadMediaToLibrary, deleteMedia } = require('../controllers/common/FileUploader');
const { getAllMedia, editMedia, getAllImages } = require('../controllers/common/MediaOperations');
const { createEditPost, getAllPosts, getPostById, deletePost, quickEditPost } = require('../controllers/protected/PostOperations');
const { createEditCategory, getAllCategories, getCategoryById } = require('../controllers/protected/CategoryController');

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
router.patch('/quick-edit-post/:post_id', quickEditPost);
router.delete('/delete-post/:post_id', deletePost);

router.post('/create-or-update/categories', createEditCategory);
router.get('/get-all-categories/:post_type', getAllCategories);
router.get('/get-category/:category_id', getCategoryById);


module.exports = router;