const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const { CustomError, ErrorHandler, ResponseHandler } = require('../../utils/responseHandler');

const getProfile = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;

    const user = await User.findById(userId);

    if (!user) {
      throw new CustomError(404, 'User not found');
    }

    const userProfile = {
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    ResponseHandler.success(res, userProfile,200);
  } catch (error) {
    ErrorHandler.handleError(error, res);
  }
};

module.exports = {
  getProfile,
};
