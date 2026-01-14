import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

interface IUser extends mongoose.Document {
  email: string;
  password: string;
  name?: string;
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
  name: { type: String, trim: true }
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