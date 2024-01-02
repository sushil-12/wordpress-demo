const { default: mongoose } = require("mongoose");
const { HTTP_STATUS_CODES } = require("../../constants/error_message_codes");
const Post = require("../../models/Post");
const { CustomError, ResponseHandler, ErrorHandler } = require("../../utils/responseHandler");

const createEditPost = async (req, res) => {
    try {
        const { id } = req.body;

        // Check if it's an update or create operation
        const isUpdate = mongoose.Types.ObjectId.isValid(id);
        const { title, content, author, publicationDate, categories, tags, featuredImage, status, comments, customFields } = req.body;
        const postObject = { title, content, author, publicationDate, categories, tags, featuredImage, status, comments, customFields };

        // If it's an update, find the existing post
        let post;
        if (isUpdate) {
            post = await Post.findById(id);

            // Check if the post exists
            if (!post) {
                throw new CustomError(404, 'Post not found');
            }
        } else {
            post = new Post(postObject);
        }

        // Update or set fields based on the request body
        post.title = title || post.title;
        post.content = content || post.content;
        post.author = req.userId || post.author;
        post.publicationDate = publicationDate || post.publicationDate;
        post.categories = categories || post.categories;
        post.tags = tags || post.tags;
        post.featuredImage = featuredImage || post.featuredImage;
        post.status = status || post.status;
        post.comments = comments || post.comments;
        post.customFields = customFields || post.customFields;

        let updatedPost = await post.save();
        updatedPost = { ...updatedPost.toObject(), id: updatedPost._id };

        // Return the updated or newly created post
        ResponseHandler.success(res, { post: updatedPost }, isUpdate ? HTTP_STATUS_CODES.OK : HTTP_STATUS_CODES.CREATED);
    } catch (error) {
        ErrorHandler.handleError(error, res);
    }
};

const getPostById = async (req, res) => {
    try {
        const postId = req.params.id;

        // Validate the provided ID
        if (!mongoose.Types.ObjectId.isValid(postId)) {
            throw new CustomError(400, 'Invalid post ID');
        }

        // Find the post by ID
        const post = await Post.findById(postId);

        // Check if the post exists
        if (!post) {
            throw new CustomError(404, 'Post not found');
        }

        // Return the post
        ResponseHandler.success(res, { post }, 200);
    } catch (error) {
        ErrorHandler.handleError(error, res);
    }
};

const getAllPosts = async (req, res) => {
    try {
        const { page = 1, limit = 10, search } = req.query;

        const query = {};
        
        if (search) {
            query.$or = [
                { title: { $regex: new RegExp(search, 'i') } },
                { content: { $regex: new RegExp(search, 'i') } },
            ];
        }

        const posts = await Post.find(query)
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit))
            .sort({ publicationDate: -1 }); // Sorting by publication date in descending order

        const totalCount = await Post.countDocuments(query);
        ResponseHandler.success(res, { posts, totalCount, currentPage: parseInt(page) }, 200);
    } catch (error) {
        ErrorHandler.handleError(error, res);
    }
};



module.exports = {
    createEditPost,getPostById, getAllPosts
};