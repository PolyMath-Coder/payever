import { config } from 'dotenv';
import * as nodemailer from 'nodemailer';

config();

export const sendEmail = (email) => {
  // Create a transporter object
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Replace with your email service
    auth: {
      user: process.env.EMAIL, // Replace with your email
      pass: process.env.PASSWORD, // Replace with your email password
    },
  });

  // Set up email data
  const mailOptions = {
    from: '"My App" <your-email@gmail.com>', // Sender address
    to: email, // List of receivers
    subject: 'Email Creation Successful!', // Subject line
    text: 'Congrats, Email creation Successful!', // Plain text body
  }; // Send mail

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
  });
};

module.exports = sendEmail;
