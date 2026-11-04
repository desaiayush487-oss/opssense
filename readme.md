# OpsSense 📡
> Real-Time Cloud Observability & Infrastructure Health Monitoring Engine

[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](https://opensource.org/licenses/MIT)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?logo=vercel)](https://opssense-three.vercel.app)
[![Render](https://img.shields.io/badge/Render-Live_API-46E3B7?logo=render)](https://opssense.onrender.com)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-green?logo=nodedotjs)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb)](https://www.mongodb.com)

**OpsSense** is a high-throughput, enterprise-grade cloud observability and telemetry monitoring platform. It is engineered to ingest real-time server health metrics (CPU usage, RAM allocation, and API latency), stream live telemetry via bi-directional WebSockets, and track infrastructure outage incidents backed by MongoDB Atlas.

---

## 🚀 Key Features

- **Bi-Directional WebSocket Streaming:** Sub-second server performance broadcasting powered by `socket.io`.
- **Live Performance Visualization:** Real-time animated area chart telemetry visualizing CPU load and latency trends using `Recharts`.
- **Incident Resolution Ledger:** Real-time infrastructure outage alerting, severity classification (`CRITICAL`, `HIGH`, `MEDIUM`, `LOW`), and live resolution tracking.
- **Outage Simulation Engine:** Interactive test trigger simulating cluster spikes and hardware threshold breaches on demand.
- **Modern Responsive Dashboard:** Sleek, high-tech command center UI built with React, Vite, and Tailwind CSS.

---

## 🛠️ Tech Stack

### **Frontend**
* **React (Vite):** High-performance client-side single-page application.
* **Tailwind CSS:** Modern utility-first styling for dark-mode cyber command center aesthetics.
* **Recharts:** Dynamic SVG charting for real-time telemetry metrics.
* **Socket.io Client & Lucide Icons:** Real-time event subscription and responsive UI iconography.

### **Backend**
* **Node.js & Express:** Lightweight asynchronous REST API and backend server.
* **Socket.io Server:** Real-time event-driven telemetry distribution loop.
* **Mongoose ODM:** Robust schema modeling for performance logs and incident records.

### **Database & Cloud Deployment**
* **MongoDB Atlas:** Scalable cloud NoSQL database for historical metric logging and incident tracking.
* **Vercel & Render:** Production cloud hosting for frontend and backend services.

---

## ⚙️ Local Development Setup

### 1. Clone the Repository
```bash
git clone (https://github.com/desaiayush487-oss/opssense)
cd opssense