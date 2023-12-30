const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  title: String,
  caption: String,
  description: String,
  alt_text: String,
  filename: String,
  cloudinary_id: String,
  url: String,
  size: Number, // Size in bytes
  storage_type: {
    type: String,
    enum: ['local', 'cloudinary', 'aws', 'other'],
    default: 'cloudinary',
  },
  author: String,
  role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' },
  category: String,
  tags: [String],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Media', mediaSchema);