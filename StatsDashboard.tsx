import { useState, useEffect } from 'react';
import { ArrowLeft, Download, TrendingUp, Shield, Activity, AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface StatsDashboardProps {
  onBack: () => void;
}

export function StatsDashboard({ onBack }: StatsDashboardProps) {
  const [timeSeriesData, setTimeSeriesData] = useState<Array<{ time: string; packets: number; threats: number }>>([]);

  useEffect(() => {
    // Generate mock time series data
    const data = [];
    for (let i = 0; i < 20; i++) {
      data.push({
        time: `${i}:00`,
        packets: Math.floor(Math.random() * 500) + 100,
        threats: Math.floor(Math.random() * 10)
      });
    }
    setTimeSeriesData(data);
  }, []);

  const protocolData = [
    { name: 'TCP', value: 45, color: '#00C2FF' },
    { name: 'UDP', value: 30, color: '#00FF88' },
    { name: 'ICMP', value: 15, color: '#FFB800' },
    { name: 'DNS', value: 10, color: '#FF006E' },
  ];

  const topIPs = [
    { ip: '192.168.1.100', packets: 15234, threat: false },
    { ip: '10.0.0.45', packets: 12801, threat: false },
    { ip: '93.184.216.34', packets: 9456, threat: true },
    { ip: '8.8.8.8', packets: 7823, threat: false },
    { ip: '172.16.0.23', packets: 6541, threat: true },
  ];

  const threatOverview = {
    active: 12,
    resolved: 45,
    forensics: 8
  };

  const exportReport = () => {
    const report = {
      timestamp: new Date().toISOString(),
      protocolDistribution: protocolData,
      topIPs,
      threatOverview,
      timeSeriesData
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hawkeye-analytics-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#0A0F14] text-white p-6 pt-16">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Button
            onClick={onBack}
            size="sm"
            variant="ghost"
            className="text-white hover:bg-[#1a2028]"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h2 className="text-white">Analytics Dashboard</h2>
            <p className="text-[#00C2FF]">Network statistics & insights</p>
          </div>
          <Button
            onClick={exportReport}
            size="sm"
            className="bg-[#00C2FF]/20 hover:bg-[#00C2FF]/30 text-[#00C2FF] border border-[#00C2FF]/30"
          >
            <Download className="w-4 h-4" />
          </Button>
        </div>

        {/* Threat Overview Cards */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-[#0F1419] rounded-xl p-4 border border-[#FF006E]/30 shadow-xl">
            <AlertTriangle className="w-5 h-5 text-[#FF006E] mb-2" />
            <p className="text-gray-400 mb-1">Active</p>
            <p className="text-white">{threatOverview.active}</p>
          </div>

          <div className="bg-[#0F1419] rounded-xl p-4 border border-[#00FF88]/30 shadow-xl">
            <Shield className="w-5 h-5 text-[#00FF88] mb-2" />
            <p className="text-gray-400 mb-1">Resolved</p>
            <p className="text-white">{threatOverview.resolved}</p>
          </div>

          <div className="bg-[#0F1419] rounded-xl p-4 border border-[#FFB800]/30 shadow-xl">
            <Activity className="w-5 h-5 text-[#FFB800] mb-2" />
            <p className="text-gray-400 mb-1">Forensics</p>
            <p className="text-white">{threatOverview.forensics}</p>
          </div>
        </div>

        {/* Packets Over Time */}
        <div className="bg-[#0F1419] rounded-xl p-5 mb-4 border border-[#1a2028] shadow-xl">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-[#00C2FF]" />
            <h3 className="text-white">Packets/sec Over Time</h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a2028" />
              <XAxis dataKey="time" stroke="#4a5568" />
              <YAxis stroke="#4a5568" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0F1419',
                  border: '1px solid #1a2028',
                  borderRadius: '8px'
                }}
                labelStyle={{ color: '#00C2FF' }}
              />
              <Line
                type="monotone"
                dataKey="packets"
                stroke="#00C2FF"
                strokeWidth={2}
                dot={{ fill: '#00C2FF', r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="threats"
                stroke="#FF006E"
                strokeWidth={2}
                dot={{ fill: '#FF006E', r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>

          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#00C2FF] rounded-full"></div>
              <span className="text-gray-400">Packets</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#FF006E] rounded-full"></div>
              <span className="text-gray-400">Threats</span>
            </div>
          </div>
        </div>

        {/* Protocol Usage */}
        <div className="bg-[#0F1419] rounded-xl p-5 mb-4 border border-[#1a2028] shadow-xl">
          <h3 className="text-white mb-4">Protocol Usage</h3>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="40%" height={150}>
              <PieChart>
                <Pie
                  data={protocolData}
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={60}
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

        {/* Top 5 IPs */}
        <div className="bg-[#0F1419] rounded-xl p-5 mb-4 border border-[#1a2028] shadow-xl">
          <h3 className="text-white mb-4">Top 5 IPs Communicating</h3>
          <div className="space-y-2">
            {topIPs.map((item, idx) => (
              <div
                key={idx}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  item.threat
                    ? 'bg-[#FF006E]/10 border-[#FF006E]/30'
                    : 'bg-[#0A0F14] border-[#1a2028]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#00C2FF]/20 rounded-lg flex items-center justify-center border border-[#00C2FF]/30">
                    <span className="text-[#00C2FF]">#{idx + 1}</span>
                  </div>
                  <div>
                    <p className="text-white font-mono">{item.ip}</p>
                    <p className="text-gray-400">{item.packets.toLocaleString()} packets</p>
                  </div>
                </div>
                {item.threat && (
                  <Badge className="bg-[#FF006E]/20 text-[#FF006E] border border-[#FF006E]/30">
                    ⚠ Threat
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="bg-gradient-to-r from-[#00C2FF]/10 to-[#00FF88]/10 rounded-xl p-5 border border-[#00C2FF]/20">
          <h3 className="text-white mb-4">Session Summary</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-400 mb-1">Total Packets</p>
              <p className="text-white">52,045</p>
            </div>
            <div>
              <p className="text-gray-400 mb-1">Total Data</p>
              <p className="text-white">78.4 MB</p>
            </div>
            <div>
              <p className="text-gray-400 mb-1">Session Duration</p>
              <p className="text-white">2h 34m</p>
            </div>
            <div>
              <p className="text-gray-400 mb-1">Avg Speed</p>
              <p className="text-white">312 pkt/s</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
