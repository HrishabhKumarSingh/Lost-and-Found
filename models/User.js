import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
      trim: true,
      maxlength: [50, 'First name cannot exceed 50 characters'],
    },
    lastname: {
      type: String,
      required: true,
      trim: true,
      maxlength: [50, 'Last name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: [100, 'Email cannot exceed 100 characters'],
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    number: {
      type: String,
      required: true,
      trim: true,
      maxlength: [30, 'Phone number cannot exceed 30 characters'],
    },
    password: {
      type: String,
      required: true,
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false, // Prevents password from being returned in standard queries
    },
  },
  { timestamps: true }
);

// Hash password before saving if modified
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Instance method to compare password
UserSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  // If the password is a bcrypt hash (starts with $2a$ or $2b$)
  if (this.password.startsWith('$2a$') || this.password.startsWith('$2b$')) {
    return bcrypt.compare(candidatePassword, this.password);
  }
  // Fallback for legacy plain text entries: compare directly and upgrade
  return this.password === candidatePassword;
};

export default mongoose.models.User || mongoose.model('User', UserSchema);
