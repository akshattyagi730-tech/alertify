import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  full_name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  emergency_phone: {
    type: String,
    trim: true
  },
  home_address: {
    type: String,
    trim: true
  },
  // Settings
  notifications_enabled: {
    type: Boolean,
    default: true
  },
  auto_tracking_enabled: {
    type: Boolean,
    default: true
  },
  night_mode_alerts: {
    type: Boolean,
    default: true
  },
  share_location: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true // Adds createdAt and updatedAt
});

const User = mongoose.model('User', userSchema);

export default User;
