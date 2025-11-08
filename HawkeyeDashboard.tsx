import { useState, useEffect } from 'react';
import { Shield, Activity, Wifi, Smartphone, Eye, Play, Square, TrendingUp, AlertTriangle, CheckCircle2, Network } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface HawkeyeDashboardProps {
  onStartCapture: () => void;
  onStartInterception: () => void;
  onViewDPI: () => void;
  onViewStats: () => void;
}

export function HawkeyeDashboard({ onStartCapture, onStartInterception, onViewDPI, onViewStats }: HawkeyeDashboardProps) {
  const [isCapturing, setIsCapturing] = useState(false);
  const [vpnMode, setVpnMode] = useState<'android' | 'wireguard'>('android');
  const [packetsPerSec, setPacketsPerSec] = useState(0);
  const [totalData, setTotalData] = useState(0);
  const [networkType, setNetworkType] = useState<'wifi' | 'mobile'>('wifi');

  // Animate packets/sec counter
  useEffect(() => {
    if (!isCapturing) return;
    
    const interval = setInterval(() => {
      setPacketsPerSec(Math.floor(Math.random() * 500) + 100);
      setTotalData(prev => prev + (Math.random() * 0.5));
    }, 1000);

    return () => clearInterval(interval);
  }, [isCapturing]);

  const protocolData = [
    { name: 'TCP', value: 45, color: '#00C2FF' },
    { name: 'UDP', value: 30, color: '#00FF88' },
    { name: 'ICMP', value: 15, color: '#FFB800' },
    { name: 'DNS', value: 10, color: '#FF006E' },
  ];

  const threatData = [
    { name: 'Detected', value: 23, color: '#FF006E' },
    { name: 'Resolved', value: 18, color: '#00FF88' },
    { name: 'Forensics', value: 5, color: '#FFB800' },
  ];

  const handleToggleCapture = () => {
    if (!isCapturing) {
      onStartCapture();
    }
    setIsCapturing(!isCapturing);
  };

  return (
    <div className="min-h-screen bg-[#0A0F14] text-white p-6 pt-16">
      <div className="max-w-md mx-auto">
        {/* Animated Header */}
        <div className="text-center mb-6 relative">
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <div className="w-32 h-32 border-2 border-[#00C2FF] rounded-full animate-pulse"></div>
          </div>
          <div className="flex justify-center mb-4 relative">
            <div className="w-20 h-20 bg-gradient-to-br from-[#00C2FF] to-[#00FF88] rounded-2xl flex items-center justify-center shadow-lg shadow-[#00C2FF]/50">
              <Eye className="w-12 h-12 text-[#0A0F14]" />
            </div>
          </div>
          <h1 className="text-white mb-1 tracking-wide">HAWKEYE</h1>
          <p className="text-[#00C2FF]">Real-time traffic & threat analysis</p>
          
          {/* Cyber pulse line */}
          <div className="mt-4 h-1 bg-gradient-to-r from-transparent via-[#00C2FF] to-transparent opacity-50"></div>
        </div>

        {/* VPN Mode Selector */}
        <div className="bg-[#0F1419] rounded-2xl p-5 mb-4 border border-[#1a2028] shadow-xl">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-[#00C2FF]" />
            <span className="text-white">VPN Mode</span>
            <div className="ml-auto">
              <Badge className="bg-[#00FF88]/20 text-[#00FF88] border border-[#00FF88]/30">
                Secure
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setVpnMode('android')}
              className={`p-4 rounded-xl transition-all ${
                vpnMode === 'android'
                  ? 'bg-gradient-to-br from-[#00C2FF]/20 to-[#00C2FF]/5 border-2 border-[#00C2FF] shadow-lg shadow-[#00C2FF]/20'
                  : 'bg-[#0A0F14] border border-[#1a2028] hover:border-[#00C2FF]/50'
              }`}
            >
              <Smartphone className={`w-6 h-6 mx-auto mb-2 ${vpnMode === 'android' ? 'text-[#00C2FF]' : 'text-gray-400'}`} />
              <p className={`${vpnMode === 'android' ? 'text-white' : 'text-gray-400'}`}>Android VPN</p>
              <p className={`text-xs mt-1 ${vpnMode === 'android' ? 'text-[#00C2FF]' : 'text-gray-500'}`}>
                Local capture
              </p>
            </button>

            <button
              onClick={() => setVpnMode('wireguard')}
              className={`p-4 rounded-xl transition-all ${
                vpnMode === 'wireguard'
                  ? 'bg-gradient-to-br from-[#00FF88]/20 to-[#00FF88]/5 border-2 border-[#00FF88] shadow-lg shadow-[#00FF88]/20'
                  : 'bg-[#0A0F14] border border-[#1a2028] hover:border-[#00FF88]/50'
              }`}
            >
              <Network className={`w-6 h-6 mx-auto mb-2 ${vpnMode === 'wireguard' ? 'text-[#00FF88]' : 'text-gray-400'}`} />
              <p className={`${vpnMode === 'wireguard' ? 'text-white' : 'text-gray-400'}`}>WireGuard</p>
              <p className={`text-xs mt-1 ${vpnMode === 'wireguard' ? 'text-[#00FF88]' : 'text-gray-500'}`}>
                Full network
              </p>
            </button>
          </div>

          <div className="mt-4 p-3 bg-[#00C2FF]/10 border border-[#00C2FF]/30 rounded-lg">
            <p className="text-[#00C2FF]">
              💡 {vpnMode === 'android' ? 'Captures device traffic locally' : 'Offers full network capture for organizations'}
            </p>
          </div>
        </div>

        {/* Real-time Metrics */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-[#0F1419] rounded-xl p-4 border border-[#1a2028] shadow-xl">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-[#00C2FF]" />
              <span className="text-gray-400">Packets/sec</span>
            </div>
            <p className={`text-white transition-all ${isCapturing ? 'animate-pulse' : ''}`}>
              {isCapturing ? packetsPerSec.toLocaleString() : '0'}
            </p>
            {isCapturing && (
              <div className="mt-2 h-1 bg-[#1a2028] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#00C2FF] to-[#00FF88] animate-pulse" style={{ width: `${(packetsPerSec / 600) * 100}%` }}></div>
              </div>
            )}
          </div>

          <div className="bg-[#0F1419] rounded-xl p-4 border border-[#1a2028] shadow-xl">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-[#00FF88]" />
              <span className="text-gray-400">Data Captured</span>
            </div>
            <p className="text-white">
              {totalData.toFixed(2)} MB
            </p>
            <div className="mt-2 flex items-center gap-2">
              {networkType === 'wifi' ? (
                <Wifi className="w-3 h-3 text-[#00FF88]" />
              ) : (
                <Smartphone className="w-3 h-3 text-[#00C2FF]" />
              )}
              <span className="text-gray-400">{networkType === 'wifi' ? 'Wi-Fi' : 'Mobile'}</span>
            </div>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="bg-[#0F1419] rounded-xl p-4 mb-4 border border-[#1a2028] shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${isCapturing ? 'bg-[#00FF88] animate-pulse shadow-lg shadow-[#00FF88]/50' : 'bg-gray-500'}`}></div>
              <span className="text-white">
                {isCapturing ? 'Capture Active' : 'System Ready'}
              </span>
            </div>
            <Badge className={isCapturing ? 'bg-[#00FF88]/20 text-[#00FF88] border border-[#00FF88]/30' : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'}>
              {isCapturing ? 'LIVE' : 'IDLE'}
            </Badge>
          </div>
        </div>

        {/* Main Actions */}
        <div className="space-y-3 mb-4">
          <Button
            onClick={handleToggleCapture}
            className={`w-full h-14 rounded-xl transition-all shadow-lg ${
              isCapturing
                ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-red-500/30'
                : 'bg-gradient-to-r from-[#00FF88] to-[#00C2FF] hover:from-[#00FF88]/90 hover:to-[#00C2FF]/90 text-[#0A0F14] shadow-[#00C2FF]/30'
            }`}
            size="lg"
          >
            {isCapturing ? (
              <>
                <Square className="w-5 h-5 mr-2" />
                STOP CAPTURE
              </>
            ) : (
              <>
                <Play className="w-5 h-5 mr-2" />
                START CAPTURE
              </>
            )}
          </Button>

          <Button
            onClick={onViewDPI}
            disabled={!isCapturing}
            className="w-full h-12 rounded-xl bg-[#00C2FF]/20 hover:bg-[#00C2FF]/30 text-[#00C2FF] border border-[#00C2FF]/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Activity className="w-4 h-4 mr-2" />
            Live Analysis (DPI)
          </Button>
        </div>

        {/* Charts */}
        <div className="space-y-3 mb-4">
          {/* Protocol Distribution */}
          <div className="bg-[#0F1419] rounded-xl p-5 border border-[#1a2028] shadow-xl">
            <h3 className="text-white mb-4">Protocol Distribution</h3>
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="40%" height={120}>
                <PieChart>
                  <Pie
                    data={protocolData}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={50}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {protocolData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2">
                {protocolData.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-gray-400">{item.name}</span>
                    </div>
                    <span className="text-white">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Threat Overview */}
          <div className="bg-[#0F1419] rounded-xl p-5 border border-[#1a2028] shadow-xl">
            <h3 className="text-white mb-4">Threats Detected vs Resolved</h3>
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={threatData}>
                <XAxis dataKey="name" stroke="#4a5568" />
                <YAxis stroke="#4a5568" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F1419', border: '1px solid #1a2028', borderRadius: '8px' }}
                  labelStyle={{ color: '#00C2FF' }}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {threatData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-2 mb-4">
          <button 
            onClick={onStartInterception}
            className="w-full bg-[#0F1419] border border-[#FFB800]/50 rounded-xl p-4 flex items-center gap-3 hover:bg-[#FFB800]/10 transition-all"
          >
            <AlertTriangle className="w-5 h-5 text-[#FFB800]" />
            <div className="flex-1 text-left">
              <span className="text-white block">Request Interception</span>
              <span className="text-gray-400">Capture & modify live traffic</span>
            </div>
          </button>

          <button 
            onClick={onViewStats}
            className="w-full bg-[#0F1419] border border-[#1a2028] rounded-xl p-4 flex items-center gap-3 hover:bg-[#1a2028] transition-all"
          >
            <CheckCircle2 className="w-5 h-5 text-[#00FF88]" />
            <div className="flex-1 text-left">
              <span className="text-white">Statistics Dashboard</span>
            </div>
          </button>
        </div>

        {/* Footer Stats */}
        <div className="bg-gradient-to-r from-[#00C2FF]/10 to-[#00FF88]/10 rounded-xl p-4 border border-[#00C2FF]/20">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-gray-400 mb-1">Sessions</p>
              <p className="text-white">1,247</p>
            </div>
            <div>
              <p className="text-gray-400 mb-1">Threats Blocked</p>
              <p className="text-white">23</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
