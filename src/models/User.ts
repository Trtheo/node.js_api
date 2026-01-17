import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

export enum UserRole {
  BUYER = 'buyer',
  SELLER = 'seller', 
  ADMIN = 'admin'
}

interface IUser extends mongoose.Document {
  email: string;
  password: string;
  name?: string;
  role: UserRole;
  profile: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    dateOfBirth?: Date;
    avatar?: string;
  };
  address: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  isActive: boolean;
  emailVerified: boolean;
  activationToken?: string;
  activationExpires?: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: [true, 'Email is required'], 
    unique: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email']
  },
  password: { 
    type: String, 
    required: [true, 'Password is required'], 
    minlength: [6, 'Password must be at least 6 characters']
  },
  name: { type: String, trim: true },
  role: {
    type: String,
    enum: Object.values(UserRole),
    default: UserRole.BUYER
  },
  profile: {
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    phone: { type: String, trim: true },
    dateOfBirth: Date,
    avatar: String
  },
  address: {
    street: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    zipCode: { type: String, trim: true },
    country: { type: String, trim: true }
  },
  isActive: { type: Boolean, default: true },
  emailVerified: { type: Boolean, default: false },
  activationToken: String,
  activationExpires: Date,
  resetPasswordToken: String,
  resetPasswordExpires: Date
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function(password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

export default mongoose.model<IUser>('User', userSchema);