const { default: mongoose } = require("mongoose");
const { HTTP_STATUS_CODES } = require("../../constants/error_message_codes");
const Post = require("../../models/Post");
const { CustomError, ResponseHandler, ErrorHandler } = require("../../utils/responseHandler");

const createEditPost = async (req, res) => {
    try {
        const { id } = req.body;
        const domain = req.headers['domain'];
        
        const {
            title,
            content,
            post_type,
            author,
            publicationDate,
            categories,
            tags,
            featuredImage,
            status,
            comments,
            customFields
        } = req.body;

        const postObject = {
            title,
            post_type,
            domain,
            content,
            author,
            publicationDate,
            categories,
            tags,
            featuredImage,
            status,
            comments,
            customFields
        };
       
        let post;

        if (mongoose.Types.ObjectId.isValid(id)) {
            post = await Post.findById(id);
            if (!post) {
                throw new CustomError(404, 'Post not found');
            }
            if (post.author.toString() !== req.userId) {
                throw new CustomError(403, 'Permission denied');
            }
        } else {
            post = new Post(postObject);
            post.author = req.userId;
            post.domain = domain;
        }

        // Update or set fields based on the request body
        post.title = title || post.title;
        post.post_type = post_type || post.post_type;
        post.content = content || post.content;
        post.publicationDate = publicationDate || post.publicationDate;
        post.categories = categories || post.categories;
        post.tags = tags || post.tags;
        post.featuredImage = featuredImage || post.featuredImage;
        post.status = status || post.status;
        post.comments = comments || post.comments;
        post.domain = domain || post.domain;
        post.customFields = customFields || post.customFields;

        let updatedPost = await post.save();
        updatedPost = { ...updatedPost.toObject(), id: updatedPost._id };

        // Return the updated or newly created post
        ResponseHandler.success(res, { post: updatedPost }, mongoose.Types.ObjectId.isValid(id) ? HTTP_STATUS_CODES.OK : HTTP_STATUS_CODES.CREATED);
    } catch (error) {
        ErrorHandler.handleError(error, res);
    }
};

const getPostById = async (req, res) => {
    try {
        const postId = req.params.post_id;
        if (!mongoose.Types.ObjectId.isValid(postId)) {
            throw new CustomError(400, 'Invalid post ID');
        }

        const post = await Post.findById(postId);
        updatedPost = { ...post.toObject(), id: post._id };
        // Check if the post exists
        if (!post) {
            throw new CustomError(404, 'Post not found');
        }

        // Return the post
        ResponseHandler.success(res, { post:updatedPost }, 200);
    } catch (error) {
        ErrorHandler.handleError(error, res);
    }
};

const getAllPosts = async (req, res) => {
    try {
        const { page = 1, limit = 10, search } = req.query;
        const domainHeader = req.headers['domain'];
        const { post_type } = req.params;
        const query = {};

        if (search) {
            query.$or = [
                { title: { $regex: new RegExp(search, 'i') } },
                { content: { $regex: new RegExp(search, 'i') } },
            ];
        }

        // Corrected the usage of "where" and added conditions for post_type and domain
        const posts = await Post.find(query)
            .where('post_type').equals(post_type)
            .where('domain').equals(domainHeader)
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit))
            .sort({ publicationDate: -1 });

        const totalCount = await Post.countDocuments(query);
        ResponseHandler.success(res, { posts, totalCount, currentPage: parseInt(page) }, 200);
    } catch (error) {
        ErrorHandler.handleError(error, res);
    }
};



module.exports = {
    createEditPost, getPostById, getAllPosts
};