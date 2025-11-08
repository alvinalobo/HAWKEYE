import { useState, useEffect } from 'react';
import { Activity, Filter, Shield, AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ActiveMonitoringProps {
  onThreatDetected: () => void;
}

interface ChartDataPoint {
  time: string;
  packets: number;
  threats: number;
  bandwidth: number;
}

export function ActiveMonitoring({ onThreatDetected }: ActiveMonitoringProps) {
  const [packets, setPackets] = useState(0);
  const [sessions, setSessions] = useState(0);
  const [filtered, setFiltered] = useState(0);
  const [threats, setThreats] = useState(0);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([
    { time: '0s', packets: 0, threats: 0, bandwidth: 0 },
  ]);

  useEffect(() => {
    // Simulate packet capture with live chart updates
    const interval = setInterval(() => {
      const newPackets = Math.floor(Math.random() * 50) + 20;
      const newBandwidth = Math.floor(Math.random() * 100) + 50;
      
      setPackets(prev => prev + newPackets);
      setSessions(prev => prev + Math.floor(Math.random() * 3));
      setFiltered(prev => prev + Math.floor(Math.random() * 10));
      
      setChartData(prev => {
        const newData = [...prev, {
          time: `${prev.length}s`,
          packets: newPackets,
          threats: Math.random() > 0.7 ? Math.floor(Math.random() * 3) : 0,
          bandwidth: newBandwidth
        }];
        // Keep only last 10 data points
        return newData.slice(-10);
      });
    }, 1000);

    // Simulate threat detection after 5 seconds
    const threatTimer = setTimeout(() => {
      setThreats(1);
      onThreatDetected();
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(threatTimer);
    };
  }, [onThreatDetected]);

  return (
    <div className="min-h-screen bg-emerald-600 text-white p-6 pt-16">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm animate-pulse">
              <Activity className="w-10 h-10" />
            </div>
          </div>
          <h2 className="text-white mb-1">Capture Active</h2>
          <p className="text-emerald-100">Reading IP packets from TUN FD</p>
        </div>

        {/* Live Stats */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-emerald-100 mb-1">Packets</p>
              <p className="text-white">{packets.toLocaleString()}</p>
            </div>
            <div className="text-center">
              <p className="text-emerald-100 mb-1">Sessions</p>
              <p className="text-white">{sessions}</p>
            </div>
          </div>
        </div>

        {/* Live Charts Section */}
        <div className="space-y-4 mb-4">
          {/* Packet Flow Chart */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <p className="text-white mb-3">Live Packet Flow</p>
            <ResponsiveContainer width="100%" height={120}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorPackets" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffffff" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#ffffff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area 
                  type="monotone" 
                  dataKey="packets" 
                  stroke="#ffffff" 
                  strokeWidth={2}
                  fill="url(#colorPackets)" 
                  animationDuration={500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Bandwidth Usage */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <p className="text-white mb-3">Bandwidth Usage (KB/s)</p>
            <ResponsiveContainer width="100%" height={100}>
              <BarChart data={chartData}>
                <Bar dataKey="bandwidth" fill="#34d399" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Threat Detection Timeline */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <p className="text-white mb-3">Threat Detection</p>
            <ResponsiveContainer width="100%" height={100}>
              <LineChart data={chartData}>
                <Line 
                  type="stepAfter" 
                  dataKey="threats" 
                  stroke="#fbbf24" 
                  strokeWidth={3}
                  dot={{ fill: '#fbbf24', r: 4 }}
                  animationDuration={500}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Process Flow */}
        <div className="space-y-3 mb-6">
          {/* Parsing */}
          <div className="bg-emerald-500 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <div className="flex-1">
                <p className="text-white">Local Parser + Session Reassembler</p>
                <p className="text-emerald-100">Processing streams...</p>
              </div>
            </div>
          </div>

          {/* Filtering */}
          <div className="bg-blue-500 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Filter className="w-5 h-5 text-white" />
              <div className="flex-1">
                <p className="text-white">Apply Filters (IP/Port/Protocol)</p>
                <p className="text-blue-100">{filtered} packets filtered</p>
              </div>
            </div>
          </div>

          {/* IDS */}
          <div className="bg-emerald-500 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-white" />
              <div className="flex-1">
                <p className="text-white">Run Detection Rules / IDS</p>
                <p className="text-emerald-100">Analyzing on-device...</p>
              </div>
            </div>
          </div>

          {/* Threat Status */}
          {threats > 0 && (
            <div className="bg-yellow-500 backdrop-blur-sm rounded-lg p-4 animate-pulse">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-white" />
                <div className="flex-1">
                  <p className="text-white">Threat Detected!</p>
                  <p className="text-yellow-100">Initiating response...</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Status Indicators */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-emerald-100">TUN Interface</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse"></div>
                <span className="text-white">Active</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-emerald-100">Foreground Service</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse"></div>
                <span className="text-white">Running</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-emerald-100">IDS Engine</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse"></div>
                <span className="text-white">Scanning</span>
              </div>
            </div>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full mt-6 bg-white/10 text-white border-white/20 hover:bg-white/20"
        >
          Stop Capture
        </Button>
      </div>
    </div>
  );
}
