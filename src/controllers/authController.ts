import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User';
import { sendActivationEmail, sendPasswordResetEmail } from '../services/emailService';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name, role } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists with this email' });
    }
    
    const activationToken = crypto.randomBytes(32).toString('hex');
    const user = new User({ 
      email, 
      password, 
      name, 
      role,
      activationToken,
      activationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    });
    await user.save();
    
    try {
      await sendActivationEmail(email, activationToken);
      console.log('Activation email sent successfully to:', email);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Continue with registration even if email fails
    }
    
    res.status(201).json({ 
      message: 'User registered successfully. Please check your email to activate your account.',
      user: { id: user._id, email: user.email, name: user.name, role: user.role, emailVerified: user.emailVerified }
    });
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      return res.status(400).json({ error: messages.join(', ') });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    if (!user.emailVerified) {
      return res.status(401).json({ error: 'Please verify your email before logging in. Check your inbox for activation link.' });
    }
    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, { expiresIn: '7d' });
    
    res.json({ 
      message: 'Login successful',
      token, 
      user: { id: user._id, email: user.email, name: user.name, role: user.role } 
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findById((req as any).userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user });
  } catch (error: any) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { name, profile, address } = req.body;
    
    const user = await User.findByIdAndUpdate(
      userId,
      { name, profile, address },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ message: 'Profile updated successfully', user });
  } catch (error: any) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await user.save();
    
    try {
      await sendPasswordResetEmail(email, resetToken);
      res.json({ message: 'Password reset email sent' });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      res.json({ 
        message: 'Password reset token generated',
        resetToken // Remove this in production
      });
    }
  } catch (error: any) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;
    
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }
    
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    
    res.json({ message: 'Password reset successfully' });
  } catch (error: any) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const activateAccount = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    
    const user = await User.findOne({
      activationToken: token,
      activationExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired activation token' });
    }
    
    user.emailVerified = true;
    user.activationToken = undefined;
    user.activationExpires = undefined;
    await user.save();
    
    const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, { expiresIn: '7d' });
    
    res.json({ 
      message: 'Account activated successfully',
      token: jwtToken,
      user: { id: user._id, email: user.email, name: user.name, role: user.role }
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Admin functions
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    
    const users = await User.find()
      .select('-password -resetPasswordToken -activationToken')
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });
    
    const total = await User.countDocuments();
    
    res.json({
      users,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select('-password -resetPasswordToken -activationToken');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user });
  } catch (error: any) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { name, role, profile, address, isActive, emailVerified } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, role, profile, address, isActive, emailVerified },
      { new: true, runValidators: true }
    ).select('-password -resetPasswordToken -activationToken');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ message: 'User updated successfully', user });
  } catch (error: any) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
