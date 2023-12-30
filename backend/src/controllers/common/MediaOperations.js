const { default: mongoose } = require('mongoose');
const Media = require('../../models/Media');
const { CustomError, ErrorHandler, ResponseHandler } = require('../../utils/responseHandler');


const bytesToSize = (bytes) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

    if (bytes === 0) return '0 Byte';

    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
};

const getAllMedia = async (req, res) => {
    try {
        const { page = 1, limit = 50, search, filterBy } = req.query;

        const query = {};
        if (search) {
            query.title = { $regex: new RegExp(search, 'i') };
        }
        if (filterBy) {
            query.storage_type = filterBy;
        }

        const media = await Media.find(query)
            .sort({ createdAt: -1 }) // Sort by createdAt field in descending order
            .skip((page - 1) * limit)
            .limit(Number(limit));

        if (!media.length) {
            throw new CustomError(404, 'Media not found');
        }

        // Simulate pagination metadata
        const totalDocuments = await Media.countDocuments(query);
        const totalPages = Math.ceil(totalDocuments / limit);

        const mediadata = media.map((media) => ({
            id: media._id,
            title: media?.title || media?.filename || media?.originalname || 'upload file to hegroup',
            caption: media?.caption || '',
            description: media?.description || 'upload file to hegroup',
            alt_text: media?.alt_text || 'upload file to hegroup',
            filename: media?.filename || media?.originalname || 'upload file to hegroup',
            cloudinary_id: media?.cloudinary_id || '',
            url: media?.url || '',
            size: media?.size,
            storage_type: 'cloudinary',
            author: media?.author || '', // Ensure req.user is defined
            category: media?.category || '',
            tags: media?.tags || [],
        }));

        const paginationInfo = {
            page: Number(page),
            limit: Number(limit),
            totalPages,
            totalItems: totalDocuments,
        };

        // Return the media and pagination information
        ResponseHandler.success(res, { mediadata, pagination: paginationInfo }, 200);
    } catch (error) {
        ErrorHandler.handleError(error, res);
    }
};

const editMedia = async (req, res) => {
    try {
        const { id } = req.body;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new CustomError(400, 'Invalid media ID');
        }

        const {
            title,
            caption,
            description,
            alt_text,
            filename,
            url,
            size,
            category,
            tags,
        } = req.body;

        // Find the media item by ID
        console.log(id , "MEDIA AIDD")
        const media = await Media.findById(id);

        // Check if the media item exists
        if (!media) {
            throw new CustomError(404, 'Media not found');
        }

        media.title = title || media.title;
        media.caption = caption || media.caption;
        media.description = description || media.description;
        media.alt_text = alt_text || media.alt_text;
        media.filename = filename || media.filename;
        media.url = url || media.url;
        media.size = size || media.size;
        media.category = category || media.category;
        media.tags = tags || media.tags;

        // Save the updated media item
        const updatedMedia = await media.save();

        ResponseHandler.success(res, { media: updatedMedia }, 200);
    } catch (error) {
        ErrorHandler.handleError(error, res);
    }
};


module.exports = {
    getAllMedia,
    editMedia
};
