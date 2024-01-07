const { default: mongoose } = require("mongoose");
const { HTTP_STATUS_CODES } = require("../../constants/error_message_codes");
const Post = require("../../models/Post");
const { CustomError, ResponseHandler, ErrorHandler } = require("../../utils/responseHandler");
const Media = require("../../models/Media");
const Category = require("../../models/Category");

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
        post.featuredImage = featuredImage;
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
        if (!post) {
            throw new CustomError(404, 'Post not found');
        }

        const featuredImageId = post.featuredImage;
        const categoryIds = post?.categories || [];
        const categoryObject = categoryIds.reduce((acc, categoryId) => {
            acc[categoryId] = true;
            return acc;
          }, {});
        if (featuredImageId && mongoose.Types.ObjectId.isValid(featuredImageId)) {
            const media = await Media.findById(featuredImageId).select('url alt_text').lean();
            media.id = media._id;
            delete media._id;
            const updatedPost = { ...post.toObject(), id: post._id, featuredImage: media,  categoryObject: categoryObject };
            ResponseHandler.success(res, { post: updatedPost }, 200);
        } else {
            const updatedPost = { ...post.toObject(), id: post._id, categoryObject: categoryObject };
            console.log
            ResponseHandler.success(res, { post: updatedPost }, 200);
        }
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

        const posts = await Post.find(query)
            .where('post_type').equals(post_type)
            .where('domain').equals(domainHeader)
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit))
            .sort({ publicationDate: -1 });

        const postIds = posts
            .filter(post => post.featuredImage)
            .map(post => post.featuredImage);

        const images = await Media.find({ _id: { $in: postIds } }).select('url alt_text');
        
        const imagesData = images.map(media => ({
            id: media._id,
            url: media.url,
            alt_text: media.alt_text,
        }));

        const formattedPosts = await Promise.all(posts.map(async (post) => {
            const categories = await Promise.all(post.categories.map(async (item) => {
                try {
                    const category = await Category.findById(item).exec();
                    return category ? category.name : null;
                } catch (error) {
                    console.error(`Error fetching category with ID ${item}:`, error);
                    return null;
                }
            }));
        
            return {
                ...post._doc,
                id: post._id,
                images: imagesData.filter(img => img.id === post.featuredImage),
                categories,
            };
        }));
        const totalCount = await Post.countDocuments(query);
        ResponseHandler.success(res, { posts: formattedPosts, totalCount, currentPage: parseInt(page) }, 200);
    } catch (error) {
        ErrorHandler.handleError(error, res);
    }
};


const deletePost = async (req, res) => {
    try {
        const { post_id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(post_id)) {
            throw new CustomError(400, 'Invalid media ID');
        }

        const post = await Post.findById(post_id);
        if (!post) {
            throw new CustomError(404, 'Media not found');
        }
        await Post.findByIdAndDelete(post_id);

        ResponseHandler.success(res, { message: 'Post deleted successfully' }, 200);
    } catch (error) {
        ErrorHandler.handleError(error, res);
    }
};

const quickEditPost = async (req, res) => {
    try {
        const { post_id } = req.params;
        const { title, content, status } = req.body;

        if (!mongoose.Types.ObjectId.isValid(post_id)) {
            throw new CustomError(400, 'Invalid post ID');
        }

        const post = await Post.findById(post_id);

        if (!post) {
            throw new CustomError(404, 'Post not found');
        }

        if (title) {
            post.title = title;
        }

        if (content) {
            post.content = content;
        }
        const allowedStatuses = ['draft', 'published', 'trash', 'archived'];

        if (status && allowedStatuses.includes(status)) {
            post.status = status;
        }

        await post.save();

        ResponseHandler.success(res, { message: 'Post updated successfully' }, 200);
    } catch (error) {
        ErrorHandler.handleError(error, res);
    }
};




module.exports = {
    createEditPost, getPostById, getAllPosts, deletePost, quickEditPost
};