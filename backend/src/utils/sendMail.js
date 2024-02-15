const nodemailer = require('nodemailer');
const { google } = require('googleapis');
require('dotenv').config();

const OAuth2 = google.auth.OAuth2;

// Set up OAuth2 credentials
const oauth2Client = new OAuth2(
    process.env.OUTH_CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URL,
);
// Function to send email
async function sendMail(emailOptions) {
  // Set up Nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.EMAIL_FROM,
      clientId: oauth2Client._clientId,
      clientSecret: oauth2Client._clientSecret,
      refreshToken: process.env.REFRESH_TOKEN,
      accessToken: process.env.ACCESS_TOKEN,
    },
  });

  try {
    // Send email
    const info = await transporter.sendMail(emailOptions);
    console.log('Email sent:', info.response);
    return info.response;
  } catch (error) {
    console.error('Error occurred:', error);
    throw error;
  }
}
// Export the sendMail function
module.exports = sendMail;