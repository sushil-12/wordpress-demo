const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const { CustomError, ErrorHandler, ResponseHandler } = require('../../utils/responseHandler');
const AuthValidator = require('../../validator/AuthValidator');
const { HTTP_STATUS_CODES, HTTP_STATUS_MESSAGES } = require('../../constants/error_message_codes');
const sendMail = require('../../utils/sendMail');
const fs = require('fs');
const handlebars = require('handlebars');
const crypto = require('crypto');
const cloudinary = require('../../config/cloudinary');

const { Readable } = require('stream');


const generateRandomString = (length) => {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, charset.length);
    randomString += charset[randomIndex];
  }
  return randomString;
};

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
    let otp;
    AuthValidator.validateLogin(req.body);
    const { username, password, email, staySignedIn, form_type, verification_code } = req.body;
    staySignedIn == 'yes' ? true : false;
    const user = username ? await User.findOne({ username }) : await User.findOne({ email });
    let require_verification = true;
    let sign_in_stamp = new Date();
    if (!user) {
      ResponseHandler.error(res, HTTP_STATUS_CODES.UNAUTHORIZED, { field_error: 'email', message: "User with this email not exists!" }, HTTP_STATUS_CODES.UNAUTHORIZED);
      return;
    }

    if (form_type == 'forgot_password_form') {
      try {
        const templateFile = fs.readFileSync('./src/email-templates/reset-password.hbs', 'utf8');
        const resetToken = generateRandomString(32);
        user.resetToken = resetToken;
        user.resetTokenExpiry = new Date(Date.now() + 1 * 60 * 60 * 1000)
        await user.save();
        const resetLink = `${process.env.RESET_PASSWORD_URL}/${resetToken}`;
        const template = handlebars.compile(templateFile);

        const mailOptions = {
          from: process.env.EMAIL_FROM,
          to: email,
          subject: 'Reset password email',
          html: template({ name: user.username, resetLink })
        };

        // Send email
        sendMail(mailOptions)
          .then(() => {
            ResponseHandler.success(res, { reset_link_sent: true, message: "Reset link sent successfully" }, HTTP_STATUS_CODES.OK);
          })
          .catch((error) => {
            console.log(error)
            ResponseHandler.error(res, { reset_link_sent: false, message: "Failed to send Reset link" }, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
          });
      } catch (error) {
        console.log(error)
        ResponseHandler.error(res, { reset_link_sent: false, message: "Failed to send Reset link" }, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
      }
      return;
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      ResponseHandler.error(res, HTTP_STATUS_CODES.UNAUTHORIZED, { field_error: 'password', message: "You might have entered wrong password!" }, HTTP_STATUS_CODES.UNAUTHORIZED);
      return;
      // throw new CustomError(HTTP_STATUS_CODES.UNAUTHORIZED, HTTP_STATUS_MESSAGES.UNAUTHORIZED);
    }
    if (user.signInTimestamp && new Date() < user.signInTimestamp) {
      require_verification = false;
    }

    if (user.signInTimestamp && new Date() < user.signInTimestamp && user.staySignedIn) {
      require_verification = false;
      sign_in_stamp = user.signInTimestamp || sign_in_stamp;
    }
    if (!user.staySignedIn) { require_verification = true; }

    if (form_type == 'verify_account_form') {
      if (staySignedIn == true && !user.staySignedIn || user.staySignedIn == false) {
        sign_in_stamp = new Date(Date.now() + 60 * 1000);
      }
      if (verification_code !== user.otp || new Date() > user.otpExpiry) {
        ResponseHandler.error(res, HTTP_STATUS_CODES.UNAUTHORIZED, { field_error: 'verification_code', message: "Invalid or expired verification code. Please check and try again!" }, HTTP_STATUS_CODES.UNAUTHORIZED); return;
      }
    }

    if (form_type === 'login_form') {
      otp = generateRandomString(6);
      if (staySignedIn == true && !user.staySignedIn || user.staySignedIn == false) {
        sign_in_stamp = new Date(Date.now() + 60 * 1000);
        console.log(sign_in_stamp);
      }
      if (staySignedIn || !require_verification) {

        user.otp = otp;
        user.otpExpiry = new Date(Date.now() + 2 * 60 * 1000);
        await user.save();
      } else {
        user.otp = otp;
        user.otpExpiry = new Date(Date.now() + 2 * 60 * 1000); // Set OTP expiry to 2 minutes later
        await user.save()
      }
      if (require_verification) {
        try {
          const templateFile = fs.readFileSync('./src/email-templates/send-verification-code.hbs', 'utf8');
          const template = handlebars.compile(templateFile);

          const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: email,
            subject: 'Account Verification Email',
            html: template({ otp })
          };

          // Send email
          sendMail(mailOptions)
            .then(() => {
              ResponseHandler.success(res, { email_sent: true, otp: otp, message: "Verification code sent successfully" }, HTTP_STATUS_CODES.OK);
            })
            .catch((error) => {
              ResponseHandler.error(res, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR, { field_error: 'password', email_sent: false, message: "Failed to send verification code" }, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR); return;
            });
        } catch (error) {
          ErrorHandler.handleError(error, res);
        }
        return;
      }
    }

    const token_expiry = '24H';
    user.staySignedIn = staySignedIn;
    user.signInTimestamp = sign_in_stamp
    user.save();
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: token_expiry });
    if (user.role.name == "admin") {
      throw new CustomError(HTTP_STATUS_CODES.UNAUTHORIZED, HTTP_STATUS_MESSAGES.UNAUTHORIZED);
    }
    ResponseHandler.success(res, { token }, HTTP_STATUS_CODES.OK);
  } catch (error) {
    ErrorHandler.handleError(error, res);
  }
};

const resetPassword = async (req, res) => {
  try {
    const { password, reset_token } = req.body;
    const user = await User.findOne({ resetToken: reset_token });
    if (!user) {
      throw new CustomError(HTTP_STATUS_CODES.UNAUTHORIZED, 'Reset Link might be expired or not exists!');
    }
    if (user.resetTokenExpiry < new Date()) {
      throw new CustomError(HTTP_STATUS_CODES.UNAUTHORIZED, 'Reset Link might be expired or not exists!');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.staySignedIn = false;
    user.signInTimestamp = new Date();

    await user.save();
    user.resetToken = undefined;
    await user.save();
    ResponseHandler.success(res, { password_reset: true, message: "Password reset successfully" }, HTTP_STATUS_CODES.OK);
  } catch (error) {
    ErrorHandler.handleError(error, res);
  }
};

const editProfile = async (req, res) => {
  try {
    const { name, bio, id, profile_pic, email, password } = req.body;
    const user = await User.findOne({ _id: id });

    if (!user) {
      throw new CustomError(HTTP_STATUS_CODES.UNAUTHORIZED, 'User might not exist!');
    }

    if (profile_pic) {
      const base64String = profile_pic;
      const buffer = Buffer.from(base64String, 'base64');
      const readableStream = new Readable();
      readableStream.push(buffer);
      readableStream.push(null);

      let uploadPromise = new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream({ folder: 'profile_pictures' },
          (error, result) => {
            if (error) {
              console.error('Upload error:', error);
              reject(error);
            } else {
              user.profile_pic = result.secure_url;
              console.log(result.secure_url);
              resolve();
            }
          }
        );

        readableStream.pipe(uploadStream);
      });

      await uploadPromise;
      await user.save();
    }


    if (password && password != '' && password.length > 0) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    if (email && email != '' && email.length > 0) {
      user.email = email;
    }

    user.firstName = name;
    user.bio = bio;
    await user.save();

    ResponseHandler.success(res, { user: user, message: "Profile Edited successfully" }, HTTP_STATUS_CODES.OK);
  } catch (error) {
    ErrorHandler.handleError(error, res);
  }
};


module.exports = {
  register,
  login,
  editProfile,
  resetPassword,
  generateRandomString
};
