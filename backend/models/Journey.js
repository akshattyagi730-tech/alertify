import mongoose from 'mongoose';

const journeySchema = new mongoose.Schema({
  destination_name: {
    type: String,
    required: true,
    trim: true
  },
  destination_lat: {
    type: Number,
    required: true
  },
  destination_lng: {
    type: Number,
    required: true
  },
  start_lat: {
    type: Number
  },
  start_lng: {
    type: Number
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled', 'sos_triggered'],
    default: 'active'
  },
  started_at: {
    type: Date
  },
  ended_at: {
    type: Date
  },
  estimated_duration: {
    type: Number, // Duration in minutes
    min: 0
  },
  current_lat: {
    type: Number
  },
  current_lng: {
    type: Number
  },
  created_by: {
    type: String, // User email or ID
    required: true
  }
}, {
  timestamps: true // Adds createdAt and updatedAt
});

// Indexes for faster queries
journeySchema.index({ status: 1 });
journeySchema.index({ created_by: 1 });
journeySchema.index({ createdAt: -1 });

const Journey = mongoose.model('Journey', journeySchema);

export default Journey;
