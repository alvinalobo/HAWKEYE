import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Smartphone, 
  TrendingUp, 
  AlertTriangle, 
  ChevronRight,
  Filter,
  Search
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';

interface AppsMonitorProps {
  isCapturing: boolean;
  userId: string;
  sessionToken: string;
}

interface AppData {
  name: string;
  packageName: string;
  icon: string;
  packets: number;
  dataUsage: number;
  threats: number;
  connections: number;
  status: 'safe' | 'warning' | 'danger';
}

export function AppsMonitor({ isCapturing, userId, sessionToken }: AppsMonitorProps) {
  const [apps, setApps] = useState<AppData[]>([
    {
      name: 'Chrome',
      packageName: 'com.android.chrome',
      icon: '🌐',
      packets: 1523,
      dataUsage: 2.4,
      threats: 0,
      connections: 12,
      status: 'safe'
    },
    {
      name: 'WhatsApp',
      packageName: 'com.whatsapp',
      icon: '💬',
      packets: 892,
      dataUsage: 1.2,
      threats: 0,
      connections: 5,
      status: 'safe'
    },
    {
      name: 'Instagram',
      packageName: 'com.instagram.android',
      icon: '📷',
      packets: 2156,
      dataUsage: 3.8,
      threats: 1,
      connections: 8,
      status: 'warning'
    },
    {
      name: 'Unknown App',
      packageName: 'com.suspicious.app',
      icon: '❓',
      packets: 456,
      dataUsage: 0.8,
      threats: 3,
      connections: 15,
      status: 'danger'
    },
    {
      name: 'Gmail',
      packageName: 'com.google.android.gm',
      icon: '📧',
      packets: 634,
      dataUsage: 0.9,
      threats: 0,
      connections: 3,
      status: 'safe'
    },
    {
      name: 'YouTube',
      packageName: 'com.google.android.youtube',
      icon: '📺',
      packets: 3245,
      dataUsage: 5.6,
      threats: 0,
      connections: 6,
      status: 'safe'
    }
  ]);

  const [selectedApp, setSelectedApp] = useState<AppData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'safe' | 'warning' | 'danger'>('all');

  useEffect(() => {
    if (!isCapturing) return;

    const interval = setInterval(() => {
      setApps(prevApps => 
        prevApps.map(app => ({
          ...app,
          packets: app.packets + Math.floor(Math.random() * 20),
          dataUsage: parseFloat((app.dataUsage + Math.random() * 0.1).toFixed(1)),
          connections: Math.max(1, app.connections + Math.floor(Math.random() * 3 - 1))
        }))
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [isCapturing]);

  const filteredApps = apps.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.packageName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || app.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const topApps = [...filteredApps]
    .sort((a, b) => b.dataUsage - a.dataUsage)
    .slice(0, 6);

  return (
    <div className="p-4 space-y-4 pb-20">
      {/* Header */}
      <div>
        <h1 className="text-2xl text-white mb-1">Apps Monitor</h1>
        <p className="text-sm text-gray-400">Per-app network activity and security analysis</p>
      </div>

      {/* Top Apps Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-[#0F1419] to-[#1A1F26] rounded-xl p-4 border border-[#00C2FF]/20"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#00C2FF]" />
            <span className="text-white">Data Usage by App</span>
          </div>
        </div>

        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topApps}>
              <XAxis 
                dataKey="icon" 
                stroke="#555"
                tick={{ fontSize: 16 }}
                tickLine={false}
              />
              <YAxis 
                stroke="#555"
                tick={{ fontSize: 10, fill: '#666' }}
                tickLine={false}
                label={{ value: 'MB', angle: -90, position: 'insideLeft', fill: '#666' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1A1F26',
                  border: '1px solid #00C2FF',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
                formatter={(value: any, name: any, props: any) => {
                  return [`${value} MB`, props.payload.name];
                }}
              />
              <Bar dataKey="dataUsage" radius={[8, 8, 0, 0]}>
                {topApps.map((app, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={
                      app.status === 'danger' ? '#FF0080' :
                      app.status === 'warning' ? '#FFB800' :
                      '#00C2FF'
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Filters */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search apps..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#1A1F26] border border-[#00C2FF]/20 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00C2FF]"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          className="bg-[#1A1F26] border border-[#00C2FF]/20 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-[#00C2FF]"
        >
          <option value="all">All Apps</option>
          <option value="safe">Safe</option>
          <option value="warning">Warning</option>
          <option value="danger">Danger</option>
        </select>
      </div>

      {/* Apps List */}
      <div className="space-y-3">
        {filteredApps.map((app, index) => (
          <motion.div
            key={app.packageName}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => setSelectedApp(app)}
            className={`bg-gradient-to-br from-[#0F1419] to-[#1A1F26] rounded-xl p-4 border cursor-pointer transition-all ${
              app.status === 'danger'
                ? 'border-red-500/40 hover:border-red-500/60'
                : app.status === 'warning'
                ? 'border-yellow-500/40 hover:border-yellow-500/60'
                : 'border-[#00C2FF]/20 hover:border-[#00C2FF]/40'
            }`}
          >
            <div className="flex items-start gap-3">
              {/* App Icon */}
              <div className="text-3xl">{app.icon}</div>

              {/* App Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-white">{app.name}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">{app.packageName}</p>
                  </div>
                  {app.threats > 0 && (
                    <div className="flex items-center gap-1 bg-red-500/20 px-2 py-1 rounded-full">
                      <AlertTriangle className="w-3 h-3 text-red-500" />
                      <span className="text-xs text-red-500">{app.threats}</span>
                    </div>
                  )}
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-3 gap-3 mt-3">
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Packets</div>
                    <motion.div
                      key={app.packets}
                      initial={{ scale: 1.1 }}
                      animate={{ scale: 1 }}
                      className="text-sm text-[#00C2FF]"
                    >
                      {app.packets.toLocaleString()}
                    </motion.div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Data</div>
                    <motion.div
                      key={app.dataUsage}
                      initial={{ scale: 1.1 }}
                      animate={{ scale: 1 }}
                      className="text-sm text-[#00FF88]"
                    >
                      {app.dataUsage} MB
                    </motion.div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Connections</div>
                    <motion.div
                      key={app.connections}
                      initial={{ scale: 1.1 }}
                      animate={{ scale: 1 }}
                      className="text-sm text-white"
                    >
                      {app.connections}
                    </motion.div>
                  </div>
                </div>

                {/* Status Bar */}
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      app.status === 'danger' ? 'bg-red-500 shadow-[0_0_8px_#FF0080]' :
                      app.status === 'warning' ? 'bg-yellow-500 shadow-[0_0_8px_#FFB800]' :
                      'bg-[#00FF88] shadow-[0_0_8px_#00FF88]'
                    }`} />
                    <span className={`text-xs ${
                      app.status === 'danger' ? 'text-red-500' :
                      app.status === 'warning' ? 'text-yellow-500' :
                      'text-[#00FF88]'
                    }`}>
                      {app.status === 'danger' ? 'Threats Detected' :
                       app.status === 'warning' ? 'Suspicious Activity' :
                       'Secure'}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Selected App Details Modal */}
      {selectedApp && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSelectedApp(null)}
          className="fixed inset-0 bg-black/80 flex items-end justify-center z-50 p-4"
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-gradient-to-br from-[#0F1419] to-[#1A1F26] rounded-t-3xl p-6 border-t border-[#00C2FF]/20 max-h-[80vh] overflow-y-auto"
          >
            <div className="flex items-start gap-3 mb-6">
              <div className="text-4xl">{selectedApp.icon}</div>
              <div className="flex-1">
                <h2 className="text-xl text-white mb-1">{selectedApp.name}</h2>
                <p className="text-sm text-gray-400">{selectedApp.packageName}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-[#1A1F26] rounded-lg p-4">
                <h3 className="text-white mb-3">Network Statistics</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Total Packets</span>
                    <span className="text-sm text-[#00C2FF]">{selectedApp.packets.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Data Usage</span>
                    <span className="text-sm text-[#00FF88]">{selectedApp.dataUsage} MB</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Active Connections</span>
                    <span className="text-sm text-white">{selectedApp.connections}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Threats Detected</span>
                    <span className={`text-sm ${selectedApp.threats > 0 ? 'text-red-500' : 'text-[#00FF88]'}`}>
                      {selectedApp.threats}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-[#1A1F26] rounded-lg p-4">
                <h3 className="text-white mb-3">Security Status</h3>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${
                    selectedApp.status === 'danger' ? 'bg-red-500' :
                    selectedApp.status === 'warning' ? 'bg-yellow-500' :
                    'bg-[#00FF88]'
                  }`} />
                  <span className={`text-sm ${
                    selectedApp.status === 'danger' ? 'text-red-500' :
                    selectedApp.status === 'warning' ? 'text-yellow-500' :
                    'text-[#00FF88]'
                  }`}>
                    {selectedApp.status === 'danger' ? 'Malicious activity detected' :
                     selectedApp.status === 'warning' ? 'Suspicious patterns identified' :
                     'No threats detected'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedApp(null)}
                className="w-full bg-gradient-to-r from-[#00C2FF] to-[#00FF88] text-[#0A0F14] py-3 rounded-xl"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
