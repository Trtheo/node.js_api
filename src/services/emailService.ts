import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export const sendActivationEmail = async (email: string, token: string) => {
  const activationUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/activate/${token}`;
  
  const mailOptions = {
    from: process.env.SMTP_FROM || 'noreply@ecommerce.com',
    to: email,
    subject: 'Activate Your Account',
    html: `
      <h2>Welcome to E-Commerce!</h2>
      <p>Please click the link below to activate your account:</p>
      <a href="${activationUrl}" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Activate Account</a>
      <p>This link expires in 24 hours.</p>
    `
  };

  await transporter.sendMail(mailOptions);
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:3400'}/reset-password/${token}`;
  
  const mailOptions = {
    from: process.env.SMTP_FROM || 'noreply@ecommerce.com',
    to: email,
    subject: 'Password Reset Request',
    html: `
      <h2>Password Reset</h2>
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <a href="${resetUrl}" style="background: #dc3545; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
      <p>This link expires in 10 minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `
  };

  await transporter.sendMail(mailOptions);
};