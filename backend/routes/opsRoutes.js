const express = require('express');
const router = express.Router();
const Incident = require('../models/Incident');
const MetricLog = require('../models/MetricLog');

// 1. GET all incidents (sorted newest first)
router.get('/incidents', async (req, res) => {
  try {
    const incidents = await Incident.find().sort({ timestamp: -1 }).limit(50);
    res.json({ success: true, count: incidents.length, incidents });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch incidents' });
  }
});

// 2. POST create / trigger a new incident test alert
router.post('/incidents/trigger', async (req, res) => {
  try {
    const { title, service, severity, description } = req.body;
    const newIncident = new Incident({
      title: title || 'CPU Cluster Spiked > 85% Threshold',
      service: service || 'Auth-Cluster-AP-South',
      severity: severity || 'CRITICAL',
      description: description || 'Node.js event loop delay breached execution limit.'
    });
    await newIncident.save();
    res.status(201).json({ success: true, incident: newIncident });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to create incident' });
  }
});

// 3. PATCH resolve an open incident
router.patch('/incidents/:id/resolve', async (req, res) => {
  try {
    const updated = await Incident.findByIdAndUpdate(
      req.params.id, 
      { status: 'RESOLVED' }, 
      { new: true }
    );
    if (!updated) return res.status(404).json({ success: false, error: 'Incident not found' });
    res.json({ success: true, incident: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to resolve incident' });
  }
});

// 4. GET historical performance metrics
router.get('/metrics/history', async (req, res) => {
  try {
    const history = await MetricLog.find().sort({ timestamp: -1 }).limit(30);
    res.json({ success: true, history: history.reverse() });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch metric history' });
  }
});

module.exports = router;