import mongoose from 'mongoose';

const trustedContactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  relationship: {
    type: String,
    enum: ['family', 'friend', 'partner', 'colleague', 'other'],
    default: 'friend'
  },
  is_primary: {
    type: Boolean,
    default: false
  },
  notify_on_journey: {
    type: Boolean,
    default: true
  },
  avatar_color: {
    type: String,
    trim: true
  },
  created_by: {
    type: String, // User email or ID
    required: true
  }
}, {
  timestamps: true // Adds createdAt and updatedAt
});

// Index for faster queries
trustedContactSchema.index({ created_by: 1 });
trustedContactSchema.index({ is_primary: 1 });

const TrustedContact = mongoose.model('TrustedContact', trustedContactSchema);

export default TrustedContact;
