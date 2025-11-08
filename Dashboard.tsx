import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Play, 
  Square, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp,
  Wifi,
  Server,
  Clock
} from 'lucide-react';
import { LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

interface DashboardProps {
  isCapturing: boolean;
  onStartCapture: () => void;
  onStopCapture: () => void;
  userId: string;
  sessionToken: string;
  vpnMode: 'android' | 'wireguard' | null;
}

export function Dashboard({ 
  isCapturing, 
  onStartCapture, 
  onStopCapture,
  userId,
  sessionToken,
  vpnMode
}: DashboardProps) {
  const [packetsPerSec, setPacketsPerSec] = useState(0);
  const [totalPackets, setTotalPackets] = useState(0);
  const [totalData, setTotalData] = useState(0);
  const [threats, setThreats] = useState({ total: 0, active: 0, resolved: 0 });
  const [waveData, setWaveData] = useState<{ time: string; packets: number; threats: number }[]>([]);
  const [protocolData, setProtocolData] = useState([
    { name: 'TCP', value: 45, color: '#00C2FF' },
    { name: 'UDP', value: 30, color: '#00FF88' },
    { name: 'ICMP', value: 15, color: '#FFB800' },
    { name: 'DNS', value: 10, color: '#FF0080' },
  ]);

  useEffect(() => {
    if (!isCapturing) return;

    const interval = setInterval(() => {
      // Simulate real-time data
      const newPackets = Math.floor(Math.random() * 100) + 50;
      const newThreats = Math.random() > 0.8 ? 1 : 0;
      
      setPacketsPerSec(newPackets);
      setTotalPackets(prev => prev + newPackets);
      setTotalData(prev => prev + (newPackets * 0.5));
      
      if (newThreats > 0) {
        setThreats(prev => ({
          total: prev.total + 1,
          active: prev.active + 1,
          resolved: prev.resolved
        }));
      }

      // Update wave chart data
      const now = new Date();
      const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
      
      setWaveData(prev => {
        const newData = [...prev, { time: timeStr, packets: newPackets, threats: newThreats }];
        // Keep only last 20 data points
        return newData.slice(-20);
      });

      // Randomly update protocol distribution
      if (Math.random() > 0.7) {
        setProtocolData(prev => prev.map(p => ({
          ...p,
          value: Math.max(5, p.value + (Math.random() - 0.5) * 10)
        })));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isCapturing]);

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl text-white mb-1">Network Monitor</h1>
        <p className="text-sm text-gray-400">Real-time packet analysis and threat detection</p>
      </div>

      {/* VPN Mode Badge */}
      {vpnMode && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-[#00C2FF]/10 to-[#00FF88]/10 border border-[#00C2FF]/30 rounded-lg p-3"
        >
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#00C2FF]" />
            <div className="flex-1">
              <div className="text-sm text-white">
                {vpnMode === 'android' ? 'Android VPN Service' : 'WireGuard VPN'}
              </div>
              <div className="text-xs text-gray-400">
                {vpnMode === 'android' ? 'Lightweight monitoring' : 'Deep packet inspection'}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Control Buttons */}
      <div className="flex gap-3">
        {!isCapturing ? (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onStartCapture}
            className="flex-1 bg-gradient-to-r from-[#00C2FF] to-[#00FF88] text-[#0A0F14] py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[#00C2FF]/20"
          >
            <Play className="w-5 h-5" fill="currentColor" />
            <span>Start Capture</span>
          </motion.button>
        ) : (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onStopCapture}
            className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-red-500/20"
          >
            <Square className="w-5 h-5" fill="currentColor" />
            <span>Stop Capture</span>
          </motion.button>
        )}
      </div>

      {/* Live Wave Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-[#0F1419] to-[#1A1F26] rounded-xl p-4 border border-[#00C2FF]/20"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#00C2FF]" />
            <span className="text-white">Live Traffic Analysis</span>
          </div>
          {isCapturing && (
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-[#00FF88] shadow-[0_0_8px_#00FF88]"
            />
          )}
        </div>

        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={waveData}>
              <XAxis 
                dataKey="time" 
                stroke="#555" 
                tick={{ fontSize: 10, fill: '#666' }}
                tickLine={false}
              />
              <YAxis 
                stroke="#555" 
                tick={{ fontSize: 10, fill: '#666' }}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1A1F26',
                  border: '1px solid #00C2FF',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="packets" 
                stroke="#00C2FF" 
                strokeWidth={2}
                dot={false}
                animationDuration={300}
              />
              <Line 
                type="monotone" 
                dataKey="threats" 
                stroke="#FF0080" 
                strokeWidth={2}
                dot={false}
                animationDuration={300}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-center justify-center gap-6 mt-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#00C2FF]" />
            <span className="text-xs text-gray-400">Packets/sec</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#FF0080]" />
            <span className="text-xs text-gray-400">Threats</span>
          </div>
        </div>
      </motion.div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Packets per second */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-[#0F1419] to-[#1A1F26] rounded-xl p-4 border border-[#00C2FF]/20"
        >
          <div className="flex items-center gap-2 mb-2">
            <Server className="w-4 h-4 text-[#00C2FF]" />
            <span className="text-xs text-gray-400">Packets/sec</span>
          </div>
          <motion.div
            key={packetsPerSec}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-2xl text-[#00C2FF]"
          >
            {packetsPerSec}
          </motion.div>
        </motion.div>

        {/* Total packets */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-[#0F1419] to-[#1A1F26] rounded-xl p-4 border border-[#00FF88]/20"
        >
          <div className="flex items-center gap-2 mb-2">
            <Wifi className="w-4 h-4 text-[#00FF88]" />
            <span className="text-xs text-gray-400">Total Packets</span>
          </div>
          <div className="text-2xl text-[#00FF88]">
            {totalPackets.toLocaleString()}
          </div>
        </motion.div>

        {/* Total data */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-[#0F1419] to-[#1A1F26] rounded-xl p-4 border border-[#FFB800]/20"
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-[#FFB800]" />
            <span className="text-xs text-gray-400">Data Captured</span>
          </div>
          <div className="text-2xl text-[#FFB800]">
            {totalData.toFixed(1)} KB
          </div>
        </motion.div>

        {/* Active threats */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-[#0F1419] to-[#1A1F26] rounded-xl p-4 border border-[#FF0080]/20"
        >
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-[#FF0080]" />
            <span className="text-xs text-gray-400">Active Threats</span>
          </div>
          <motion.div
            key={threats.active}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-2xl text-[#FF0080]"
          >
            {threats.active}
          </motion.div>
        </motion.div>
      </div>

      {/* Protocol Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-[#0F1419] to-[#1A1F26] rounded-xl p-4 border border-[#00C2FF]/20"
      >
        <h3 className="text-white mb-4">Protocol Distribution</h3>
        <div className="flex items-center justify-between">
          <div className="h-40 w-40">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={protocolData}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={60}
                  paddingAngle={2}
                  dataKey="value"
                  animationDuration={500}
                >
                  {protocolData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 space-y-2">
            {protocolData.map((protocol) => (
              <div key={protocol.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: protocol.color }}
                  />
                  <span className="text-sm text-gray-300">{protocol.name}</span>
                </div>
                <span className="text-sm text-gray-400">{Math.round(protocol.value)}%</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Threat Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-[#0F1419] to-[#1A1F26] rounded-xl p-4 border border-[#00C2FF]/20"
      >
        <h3 className="text-white mb-4">Security Status</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#00C2FF]" />
              <span className="text-sm text-gray-300">Total Threats</span>
            </div>
            <span className="text-sm text-white">{threats.total}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#FF0080]" />
              <span className="text-sm text-gray-300">Active</span>
            </div>
            <span className="text-sm text-[#FF0080]">{threats.active}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#00FF88]" />
              <span className="text-sm text-gray-300">Resolved</span>
            </div>
            <span className="text-sm text-[#00FF88]">{threats.resolved}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
