import nodemailer from 'nodemailer';

/**
 * Create an Ethereal email transporter for testing
 * (Free mock SMTP server - no real emails sent)
 */
export const createEtherealTransport = async () => {
  // Create a test account (this is free and temporary)
  const testAccount = await nodemailer.createTestAccount();

  // Create the transporter (the email sender)
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // Ethereal username
      pass: testAccount.pass, // Ethereal password
    },
  });

  return transporter;
};

/**
 * Helper function to get the URL of the test email inbox
 * (Use this to log the URL where you can view the sent email)
 */
export const getTestMessageUrl = nodemailer.getTestMessageUrl;
