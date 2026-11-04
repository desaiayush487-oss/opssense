const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  service: { type: String, required: true },
  severity: { 
    type: String, 
    enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], 
    default: 'MEDIUM' 
  },
  status: { 
    type: String, 
    enum: ['OPEN', 'ACKNOWLEDGED', 'RESOLVED'], 
    default: 'OPEN' 
  },
  description: { type: String },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Incident', incidentSchema);