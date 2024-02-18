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
    staySignedIn =='yes' ? true: false;
    const user = username ? await User.findOne({ username }) : await User.findOne({ email });
    let require_verification = true;
    let sign_in_stamp = new Date();
    if (!user) {
      throw new CustomError(404, 'User not found');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new CustomError(HTTP_STATUS_CODES.UNAUTHORIZED, HTTP_STATUS_MESSAGES.UNAUTHORIZED);
    }
    if (user.signInTimestamp && new Date() < user.signInTimestamp && user.staySignedIn) {
      require_verification = false;
      sign_in_stamp = user.signInTimestamp || sign_in_stamp;
    }
    
    console.log(require_verification);
    if(form_type == 'forgot_password_form'){
      try {
        const templateFile = fs.readFileSync('./src/email-templates/reset-password.hbs', 'utf8');
        const resetToken = generateRandomString(32); 
        user.resetToken = resetToken;
        await user.save();
        const resetLink = `${process.env.RESET_PASSWORD_URL}?token=${resetToken}`;
        const template = handlebars.compile(templateFile);

        const mailOptions = {
          from: process.env.EMAIL_FROM,
          to: email,
          subject: 'Reset password email',
          html: template({ name:user.username, resetLink })
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

    if (form_type === 'login_form') {
      otp = generateRandomString(6);
      if (staySignedIn || !require_verification) {
        user.staySignedIn = staySignedIn;
        user.signInTimestamp = sign_in_stamp // Set OTP expiry to 7 days later
        user.otp = otp;
        user.otpExpiry = new Date(Date.now() + 2 * 60 * 1000);
        await user.save();
      } else {
        user.otp = otp;
        user.otpExpiry = new Date(Date.now() + 2 * 60 * 1000); // Set OTP expiry to 2 minutes later
        await user.save()
      }
      console.log(staySignedIn, sign_in_stamp, staySignedIn || !require_verification, )
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
          // sendMail(mailOptions)
          //   .then(() => {
              ResponseHandler.success(res, { email_sent: true, otp: otp, message: "Verification code sent successfully" }, HTTP_STATUS_CODES.OK);
          //   })
          //   .catch((error) => {
          //     ResponseHandler.error(res, { email_sent: false, message: "Failed to send verification code" }, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
          //   });
        } catch (error) {
          ResponseHandler.error(res, { email_sent: false, message: "Failed to send verification code" }, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
        }
        return;
      }
    }


    if(require_verification){
      if (verification_code !== user.otp || new Date() > user.otpExpiry ) {
        throw new CustomError(HTTP_STATUS_CODES.UNAUTHORIZED, 'Invalid or expired verification code. Please check and try again!');
      }
    }
    
    const token_expiry = '24h';
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: token_expiry });
    if (user.role.name == "admin") {
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
