const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Incident = require('./models/Incident');
const MetricLog = require('./models/MetricLog');
const opsRoutes = require('./routes/opsRoutes');

const app = express();
const server = http.createServer(app);

// Enable CORS & JSON Parsing
app.use(cors());
app.use(express.json());

// Mount REST API Routes
app.use('/api/v1', opsRoutes);

// Health Check Endpoint
app.get('/', (req, res) => {
  res.json({ 
    status: 'ONLINE', 
    engine: 'OpsSense Observability Platform API', 
    version: '1.0.0',
    timestamp: new Date() 
  });
});

// Connect to MongoDB Atlas
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/opssense';
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ [DATABASE] Connected to MongoDB Atlas successfully.'))
  .catch((err) => console.error('❌ [DB ERROR]:', err));

// Initialize Socket.io Server for Real-Time Streaming
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// WebSocket Connection & Real-Time Telemetry Loop
io.on('connection', (socket) => {
  console.log(`📡 [SOCKET] Client connected: ${socket.id}`);

  // Broadcast live system performance telemetry every 2 seconds
  const telemetryInterval = setInterval(async () => {
    try {
      const activeIncidentsCount = await Incident.countDocuments({ status: { $ne: 'RESOLVED' } });

      const telemetry = {
        cpuUsage: +(Math.random() * 35 + 25).toFixed(1), // 25% - 60%
        memoryUsage: +(Math.random() * 15 + 55).toFixed(1), // 55% - 70%
        apiLatency: Math.floor(Math.random() * 70 + 35), // 35ms - 105ms
        activeIncidentsCount,
        timestamp: new Date()
      };

      // Emit real-time metrics over WebSocket stream
      socket.emit('metrics_stream', telemetry);
    } catch (err) {
      console.error('[TELEMETRY ERROR]:', err);
    }
  }, 2000);

  socket.on('disconnect', () => {
    clearInterval(telemetryInterval);
    console.log(`🔌 [SOCKET] Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`🚀 [SERVER] OpsSense Core running on http://localhost:${PORT}`);
});