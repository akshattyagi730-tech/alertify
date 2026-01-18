import mongoose from 'mongoose';

const locationUpdateSchema = new mongoose.Schema({
  alert_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SOSAlert',
    required: true
  },
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  accuracy: {
    type: Number, // GPS accuracy in meters
    min: 0
  },
  speed: {
    type: Number, // Speed in m/s
    min: 0
  },
  heading: {
    type: Number, // Direction in degrees (0-360)
    min: 0,
    max: 360
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true // Adds createdAt and updatedAt
});

// Indexes for faster queries
locationUpdateSchema.index({ alert_id: 1 });
locationUpdateSchema.index({ timestamp: -1 });
locationUpdateSchema.index({ createdAt: -1 });

const LocationUpdate = mongoose.model('LocationUpdate', locationUpdateSchema);

export default LocationUpdate;
