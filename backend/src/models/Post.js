const { default: mongoose } = require("mongoose");

const postSchema = new mongoose.Schema({
    title: { type: String, required: true, },
    content: { type: String, required: true, },
    author: { type: String, required: true, },
    publicationDate: { type: Date, default: Date.now, },
    categories: { type: [String], default: [], },
    tags: { type: [String], default: [], },
    featuredImage: { type: String, },
    status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft', },
    comments: [{ user: String, content: String, date: { type: Date, default: Date.now, }, },],
    customFields: [{ key: String, value: String, },],
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
