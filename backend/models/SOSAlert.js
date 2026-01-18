import mongoose from 'mongoose';

const sosAlertSchema = new mongoose.Schema({
  trigger_type: {
    type: String,
    enum: ['manual', 'auto_motion', 'auto_deviation', 'auto_stop'],
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'resolved', 'false_alarm'],
    default: 'active'
  },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  location_name: String,
  contacts_notified: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TrustedContact'
  }],
  alert_count: { type: Number, default: 0 },
  last_alert_sent: Date,
  google_maps_url: String,
  created_by: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('SOSAlert', sosAlertSchema);
