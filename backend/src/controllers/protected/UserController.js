const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const { CustomError, ErrorHandler, ResponseHandler } = require('../../utils/responseHandler');
const Permission = require('../../models/Permission');
const Role = require('../../models/Role');

const getProfile = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;

    const user = await User.findById(userId).populate('role').populate('permissions');
    if (!user) {
      throw new CustomError(404, 'User not found');
    }

   
    const userProfile = {
      _id: user._id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      bio: user.bio,
      lastName: user.lastName,
      roles: user.role?.name,
      permissions: user.permissions.map(({ name, module }) => ({ name, module }))

    };

    ResponseHandler.success(res, userProfile,200);
  } catch (error) {
    ErrorHandler.handleError(error, res);
  }
};

module.exports = {
  getProfile,
};
