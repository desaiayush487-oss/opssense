import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Server, Cpu, AlertTriangle, RefreshCw, Zap, Radio, Clock } from 'lucide-react';

const BACKEND_URL = 'http://localhost:5001';

export default function App() {
  const [metrics, setMetrics] = useState({ cpuUsage: 0, memoryUsage: 0, apiLatency: 0, activeIncidentsCount: 0 });
  const [chartData, setChartData] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Connect WebSocket Client
    const socket = io(BACKEND_URL);

    socket.on('connect', () => setIsConnected(true));
    socket.on('disconnect', () => setIsConnected(false));

    // Listen for live telemetry stream from Node.js backend
    socket.on('metrics_stream', (data) => {
      setMetrics(data);
      const timeStr = new Date(data.timestamp).toLocaleTimeString();
      setChartData((prev) => [
        ...prev.slice(-19), 
        { time: timeStr, cpu: data.cpuUsage, latency: data.apiLatency, memory: data.memoryUsage }
      ]);
    });

    fetchIncidents();

    return () => socket.disconnect();
  }, []);

  const fetchIncidents = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/incidents`);
      const data = await res.json();
      if (data.success) setIncidents(data.incidents);
    } catch (err) {
      console.error('Failed to fetch incidents');
    }
  };

  const triggerSampleIncident = async () => {
    try {
      await fetch(`${BACKEND_URL}/api/v1/incidents/trigger`, { method: 'POST' });
      fetchIncidents();
    } catch (err) {
      console.error('Failed to trigger incident');
    }
  };

  const resolveIncident = async (id) => {
    try {
      await fetch(`${BACKEND_URL}/api/v1/incidents/${id}/resolve`, { method: 'PATCH' });
      fetchIncidents();
    } catch (err) {
      console.error('Failed to resolve incident');
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 p-4 md:p-8 relative overflow-hidden font-sans">
      {/* Background Cyber Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b12_1px,transparent_1px),linear-gradient(to_bottom,#1e293b12_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] pointer-events-none"></div>
      <div className="absolute top-0 left-1/4 w-[700px] h-[700px] bg-cyan-500/10 rounded-full blur-[160px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[700px] h-[700px] bg-indigo-500/10 rounded-full blur-[160px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto space-y-6 relative z-10">
        
        {/* Top Navbar */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl shadow-2xl gap-4">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-cyan-500/20 to-slate-900 p-3 rounded-xl border border-cyan-500/30 shadow-lg">
              <Activity className="w-6 h-6 text-cyan-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold tracking-tight text-white">OpsSense</h1>
                <span className="bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  v1.0 Telemetry Core
                </span>
              </div>
              <p className="text-xs text-slate-400">Real-Time Cloud Infrastructure & Health Monitoring Engine</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end">
            <div className="flex items-center space-x-2 text-xs bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800">
              <Radio className={`w-3.5 h-3.5 ${isConnected ? 'text-emerald-400 animate-pulse' : 'text-rose-500'}`} />
              <span className="text-slate-400 font-mono">WS Stream:</span>
              <span className={`font-mono font-bold ${isConnected ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isConnected ? 'ONLINE' : 'DISCONNECTED'}
              </span>
            </div>
            <button 
              onClick={triggerSampleIncident}
              className="bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-rose-950/50 flex items-center gap-1.5 cursor-pointer"
            >
              <Zap className="w-4 h-4" /> Trigger Outage Alert
            </button>
          </div>
        </header>

        {/* Live Gauges Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl shadow-lg">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-cyan-400" /> CPU Cluster Load
            </span>
            <p className="text-3xl font-mono font-bold text-cyan-400 mt-2">{metrics.cpuUsage}%</p>
            <div className="w-full bg-slate-950 h-2 rounded-full mt-3 overflow-hidden border border-slate-800">
              <div className="bg-cyan-400 h-full transition-all duration-500" style={{ width: `${metrics.cpuUsage}%` }}></div>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl shadow-lg">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <Server className="w-4 h-4 text-emerald-400" /> RAM Memory Allocation
            </span>
            <p className="text-3xl font-mono font-bold text-emerald-400 mt-2">{metrics.memoryUsage}%</p>
            <div className="w-full bg-slate-950 h-2 rounded-full mt-3 overflow-hidden border border-slate-800">
              <div className="bg-emerald-400 h-full transition-all duration-500" style={{ width: `${metrics.memoryUsage}%` }}></div>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl shadow-lg">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-400" /> API Gateway Latency
            </span>
            <p className="text-3xl font-mono font-bold text-amber-400 mt-2">{metrics.apiLatency} <span className="text-xs text-slate-400 font-sans">ms</span></p>
            <div className="w-full bg-slate-950 h-2 rounded-full mt-3 overflow-hidden border border-slate-800">
              <div className="bg-amber-400 h-full transition-all duration-500" style={{ width: `${Math.min(metrics.apiLatency / 1.5, 100)}%` }}></div>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl shadow-lg">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-400" /> Active Incidents
            </span>
            <p className="text-3xl font-mono font-bold text-rose-400 mt-2">{metrics.activeIncidentsCount}</p>
            <span className="text-[11px] text-slate-500 mt-2 block">Logged in MongoDB Atlas</span>
          </div>

        </div>

        {/* Real-time Telemetry Recharts Graph */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" /> Real-Time Telemetry Stream (CPU Load vs API Latency)
            </h2>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-md border border-cyan-500/20">
              Live Feed (2s Interval)
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="cpuGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc', borderRadius: '12px' }} />
                <Area type="monotone" dataKey="cpu" name="CPU Load (%)" stroke="#22d3ee" fillOpacity={1} fill="url(#cpuGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Incident Resolution Workspace */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" /> Incident Resolution Ledger (MongoDB Atlas Synced)
            </h3>
            <button onClick={fetchIncidents} className="text-slate-400 hover:text-white transition-colors cursor-pointer" title="Refresh Incidents">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3 max-h-60 overflow-auto pr-1">
            {incidents.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No active system outages logged.</p>
            ) : (
              incidents.map((inc) => (
                <div key={inc._id} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${inc.status === 'RESOLVED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                        {inc.status}
                      </span>
                      <span className="bg-slate-900 px-2 py-0.5 rounded text-[10px] font-mono text-slate-400 border border-slate-800">
                        {inc.severity}
                      </span>
                      <p className="font-semibold text-slate-200">{inc.title}</p>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">{inc.service} • {new Date(inc.timestamp).toLocaleTimeString()}</p>
                  </div>
                  {inc.status !== 'RESOLVED' && (
                    <button 
                      onClick={() => resolveIncident(inc._id)}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold px-3.5 py-1.5 rounded-lg transition-all shadow-md shadow-emerald-950/50 cursor-pointer shrink-0"
                    >
                      Acknowledge & Resolve
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}