const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const { CustomError, ErrorHandler, ResponseHandler } = require('../../utils/responseHandler');
const AuthValidator = require('../../validator/AuthValidator');
const { HTTP_STATUS_CODES, HTTP_STATUS_MESSAGES } = require('../../constants/error_message_codes');

const register = async (req, res) => {
  try {
    AuthValidator.validateRegistration(req.body);
    const { username, password, email, firstName, lastName } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword, email, firstName, lastName });
    await newUser.save();

    ResponseHandler.success(res, { message: 'User registered successfully' }, HTTP_STATUS_CODES.OK);
  } catch (error) {
    ErrorHandler.handleError(error, res);
  }
};

const login = async (req, res) => {
  try {
    AuthValidator.validateLogin(req.body);
    const { username, password, email, staySignedIn, createOtp } = req.body;
    const user = username ? await User.findOne({ username }) : await User.findOne({email});
    if (!user) {
      throw new CustomError(404, 'User not found');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new CustomError(HTTP_STATUS_CODES.UNAUTHORIZED, HTTP_STATUS_MESSAGES.UNAUTHORIZED);
    }
    
    
    const token_expiry = staySignedIn !==undefined || staySignedIn==true ? '7d' : '24h';
    const email_sent = true;
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: token_expiry });
    if(user.role.name == "admin"){
      throw new CustomError(HTTP_STATUS_CODES.UNAUTHORIZED, HTTP_STATUS_MESSAGES.UNAUTHORIZED);
    }
    ResponseHandler.success(res, { token }, HTTP_STATUS_CODES.OK);
  } catch (error) {
    ErrorHandler.handleError(error, res);
  }
};

module.exports = {
  register,
  login,
};
