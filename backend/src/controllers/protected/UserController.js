const jwt = require('jsonwebtoken');
const fs = require('fs');
const handlebars = require('handlebars');

const User = require('../../models/User');
const { CustomError, ErrorHandler, ResponseHandler } = require('../../utils/responseHandler');
const Permission = require('../../models/Permission');
const Role = require('../../models/Role');
const bcrypt = require('bcrypt');
const { HTTP_STATUS_CODES } = require('../../constants/error_message_codes');
const sendMail = require('../../utils/sendMail');
const { generateRandomString } = require('../auth/authController');

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
      profile_pic: user.profile_pic,
      lastName: user.lastName,
      roles: user.role?.name,
      permissions: user.permissions.map(({ name, module }) => ({ name, module }))

    };

    ResponseHandler.success(res, userProfile, 200);
  } catch (error) {
    ErrorHandler.handleError(error, res);
  }
};

const sendOtpVerificationOnEmail = async (req, res) => {
  try {
    const { email, form_type, verification_code } = req.body;
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;

    const user = await User.findById(userId);
    if (!user) {
      throw new CustomError(404, 'User not found');
    }

    // Generate OTP here
    const otp = generateRandomString(6); // You need to implement generateOTP function

    if (form_type == 'send_mail') {
      try {
        const templateFile = fs.readFileSync('./src/email-templates/send-verification-code.hbs', 'utf8');
        const template = handlebars.compile(templateFile);

        const mailOptions = {
          from: process.env.EMAIL_FROM,
          to: email,
          subject: 'Account Verification Email',
          html: template({ otp })
        };

        user.otp = otp;
        user.otpExpiry = new Date(Date.now() + 2 * 60 * 1000);
        await user.save();
        console.log(user);

        // Send email
        sendMail(mailOptions)
          .then(async () => {
            ResponseHandler.success(res, { email_sent: true, otp: otp, message: "Verification code sent successfully" }, HTTP_STATUS_CODES.OK);
          })
          .catch((error) => {
            ResponseHandler.error(res, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR, { field_error: 'email', email_sent: false, message: "Failed to send verification code" }, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
          });
      } catch (error) {
        ErrorHandler.handleError(error, res);
      }
    }else{
      console.log(verification_code , user.otp);
      if (verification_code !== user.otp) {
        ResponseHandler.error(res, HTTP_STATUS_CODES.UNAUTHORIZED, { field_error: 'verification_code', message: "Invalid or expired verification code. Please check and try again!" }, HTTP_STATUS_CODES.UNAUTHORIZED); return;
      }else{
        user.otp = otp;
        user.save();
        ResponseHandler.success(res, { verified: true, message: "Email verified successfully" }, HTTP_STATUS_CODES.OK);
      }
    }

  } catch (error) {
    ErrorHandler.handleError(error, res);
  }
};

const checkPassword = async (req, res) => {
  try {
    const { password } = req.body; // Assuming the password is sent in the request body

    // Extracting the token from the request headers
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;

    const user = await User.findById(userId);
    if (!user) {
      throw new CustomError(404, 'User not found');
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      ResponseHandler.error(res, HTTP_STATUS_CODES.UNAUTHORIZED, { field_error: 'password', message: "Your password seems incorrect! Please try again." }, HTTP_STATUS_CODES.UNAUTHORIZED); return;
    }

    // If passwords match, return a success response
    ResponseHandler.success(res, { message: 'Password is correct' }, 200);
  } catch (error) {
    // Handle errors
    ErrorHandler.handleError(error, res);
  }
};


module.exports = {
  getProfile, checkPassword,sendOtpVerificationOnEmail
};
