const mongoose = require('mongoose');

const metricLogSchema = new mongoose.Schema({
  cpuUsage: { type: Number, required: true },
  memoryUsage: { type: Number, required: true },
  apiLatency: { type: Number, required: true },
  activeIncidentsCount: { type: Number, default: 0 },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MetricLog', metricLogSchema);