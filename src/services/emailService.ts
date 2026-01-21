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
export const sendPasswordChangedEmail = async (email: string, name?: string) => {
  const mailOptions = {
    from: process.env.SMTP_FROM || 'noreply@ecommerce.com',
    to: email,
    subject: 'Password Successfully Changed',
    html: `
      <h2>Password Changed</h2>
      <p>Hello ${name || 'User'},</p>
      <p>Your password has been successfully changed.</p>
      <p>If you didn't make this change, please contact support immediately.</p>
    `
  };

  await transporter.sendMail(mailOptions);
};

export const sendOrderConfirmationEmail = async (email: string, orderData: any) => {
  const mailOptions = {
    from: process.env.SMTP_FROM || 'noreply@ecommerce.com',
    to: email,
    subject: 'Order Confirmation',
    html: `
      <h2>Order Placed Successfully!</h2>
      <p>Thank you for your order. Here are the details:</p>
      <p><strong>Order ID:</strong> ${orderData.id}</p>
      <p><strong>Total Amount:</strong> $${orderData.totalAmount}</p>
      <p><strong>Status:</strong> ${orderData.status}</p>
      <p>We'll send you updates as your order progresses.</p>
    `
  };

  await transporter.sendMail(mailOptions);
};

export const sendOrderStatusEmail = async (email: string, orderData: any) => {
  const mailOptions = {
    from: process.env.SMTP_FROM || 'noreply@ecommerce.com',
    to: email,
    subject: `Order ${orderData.status}`,
    html: `
      <h2>Order Status Update</h2>
      <p>Your order status has been updated:</p>
      <p><strong>Order ID:</strong> ${orderData.id}</p>
      <p><strong>New Status:</strong> ${orderData.status}</p>
      <p><strong>Total Amount:</strong> $${orderData.totalAmount}</p>
    `
  };

  await transporter.sendMail(mailOptions);
};