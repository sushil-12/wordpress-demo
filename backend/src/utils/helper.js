const cloudinary = require('../config/cloudinary');

 const uploadImageToCloudinary = async (buffer, originalname) => {
    try {
      // Upload image to Cloudinary
      const result = await cloudinary.uploader.upload(buffer.toString('base64'));
  
      // Extract relevant information
      const { public_id, secure_url } = result;
      const size = buffer.length;
  
      return {
        cloudinary_id: public_id,
        url: secure_url,
        size,
        filename: originalname,
      };
    } catch (error) {
      throw new Error('Error uploading image to Cloudinary: ' + error.message);
    }
  };
  module.exports = uploadImageToCloudinary;
