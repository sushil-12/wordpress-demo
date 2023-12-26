const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const { CustomError, ErrorHandler, ResponseHandler } = require('../../utils/responseHandler');
const AuthValidator = require('../../validator/AuthValidator');

const register = async (req, res) => {
  try {
    AuthValidator.validateRegistration(req.body);
    const { username, password, email, firstName, lastName } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword, email, firstName, lastName });
    await newUser.save();

    ResponseHandler.success(res, { message: 'User registered successfully' }, 200);
  } catch (error) {
    ErrorHandler.handleError(error, res);
  }
};

const login = async (req, res) => {
  try {
    AuthValidator.validateLogin(req.body);
    const { username, password, email } = req.body;
    const user = username ? await User.findOne({ username }) : await User.findOne({email});
    if (!user) {
      throw new CustomError(404, 'User not found');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new CustomError(401, 'Incorrect password');
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    if(user.role.name == "admin"){
      throw new CustomError(401, 'Only Admin is able to login currently');
    }
    ResponseHandler.success(res, { token }, 200);
  } catch (error) {
    ErrorHandler.handleError(error, res);
  }
};

module.exports = {
  register,
  login,
};
