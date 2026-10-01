import mongoose from 'mongoose';
import pkg from 'bcryptjs';
const { genSaltSync, hashSync, compareSync } = pkg;

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
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Mongoose v8 async pre('save') hook (does NOT take a `next` callback)
UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = genSaltSync(12);
  this.password = hashSync(this.password, salt);
});

// Instance method to compare password
UserSchema.methods.comparePassword = function (candidatePassword) {
  if (!this.password) return false;
  if (this.password.startsWith('$2a$') || this.password.startsWith('$2b$')) {
    return compareSync(candidatePassword, this.password);
  }
  return this.password === candidatePassword;
};

export default mongoose.models.User || mongoose.model('User', UserSchema);
