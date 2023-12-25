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

    const user = await User.findById(userId);
    const roles = await Role.find({ _id: { $in: user.role } });
    const permissions = await Permission.find({ _id: { $in: user.permissions } });
    if (!user) {
      throw new CustomError(404, 'User not found');
    }

   
    const userProfile = {
      _id: user._id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: roles[0].name,
      permissions: permissions.map(permission => permission.name), // Map permissions to an array of permission names
    };

    ResponseHandler.success(res, userProfile,200);
  } catch (error) {
    ErrorHandler.handleError(error, res);
  }
};

module.exports = {
  getProfile,
};
