import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Filter, 
  Download, 
  AlertTriangle, 
  Clock,
  Search,
  ChevronRight
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface LiveAnalysisProps {
  isCapturing: boolean;
  userId: string;
  sessionToken: string;
}

interface Packet {
  id: string;
  protocol: string;
  source: string;
  destination: string;
  port: number;
  size: number;
  timestamp: string;
  status: 'safe' | 'suspicious' | 'malicious';
}

export function LiveAnalysis({ isCapturing, userId, sessionToken }: LiveAnalysisProps) {
  const [packets, setPackets] = useState<Packet[]>([]);
  const [waveData, setWaveData] = useState<{ time: string; packets: number; bandwidth: number }[]>([]);
  const [selectedProtocol, setSelectedProtocol] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [timeRange, setTimeRange] = useState({ start: 0, end: 24 });
  const [selectedPacket, setSelectedPacket] = useState<Packet | null>(null);

  // Generate time labels for slider
  const generateTimeLabel = (hour: number) => {
    return `${String(hour).padStart(2, '0')}:00`;
  };

  useEffect(() => {
    if (!isCapturing) return;

    const interval = setInterval(() => {
      // Generate random packet
      const protocols = ['TCP', 'UDP', 'ICMP', 'DNS', 'HTTP', 'HTTPS'];
      const statuses: ('safe' | 'suspicious' | 'malicious')[] = ['safe', 'safe', 'safe', 'suspicious', 'malicious'];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      
      const newPacket: Packet = {
        id: `pkt_${Date.now()}_${Math.random()}`,
        protocol: protocols[Math.floor(Math.random() * protocols.length)],
        source: `192.168.1.${Math.floor(Math.random() * 255)}`,
        destination: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        port: Math.floor(Math.random() * 65535),
        size: Math.floor(Math.random() * 1500) + 64,
        timestamp: new Date().toLocaleTimeString(),
        status: randomStatus
      };

      setPackets(prev => [newPacket, ...prev].slice(0, 50));

      // Update wave data
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      
      setWaveData(prev => {
        const newData = [...prev, { 
          time: timeStr, 
          packets: Math.floor(Math.random() * 100) + 50,
          bandwidth: Math.floor(Math.random() * 500) + 100
        }];
        return newData.slice(-30);
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isCapturing]);

  const filteredPackets = packets.filter(packet => {
    const matchesProtocol = selectedProtocol === 'all' || packet.protocol === selectedProtocol;
    const matchesSearch = packet.source.includes(searchTerm) || 
                          packet.destination.includes(searchTerm) ||
                          packet.protocol.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesProtocol && matchesSearch;
  });

  const handleExportPCAP = () => {
    // In real app, this would export actual PCAP data
    const blob = new Blob([JSON.stringify(packets, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hawkeye_capture_${Date.now()}.json`;
    a.click();
  };

  return (
    <div className="p-4 space-y-4 pb-20">
      {/* Header */}
      <div>
        <h1 className="text-2xl text-white mb-1">Live Traffic Analysis</h1>
        <p className="text-sm text-gray-400">Real-time packet monitoring and inspection</p>
      </div>

      {/* Live Wave Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-[#0F1419] to-[#1A1F26] rounded-xl p-4 border border-[#00C2FF]/20"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-white">Network Activity Waveform</span>
          {isCapturing && (
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex items-center gap-2 text-xs text-[#00FF88]"
            >
              <div className="w-2 h-2 rounded-full bg-[#00FF88] shadow-[0_0_8px_#00FF88]" />
              LIVE
            </motion.div>
          )}
        </div>

        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={waveData}>
              <defs>
                <linearGradient id="colorPackets" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00C2FF" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#00C2FF" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorBandwidth" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00FF88" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#00FF88" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
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
              <Area 
                type="monotone" 
                dataKey="packets" 
                stroke="#00C2FF" 
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorPackets)"
                animationDuration={300}
              />
              <Area 
                type="monotone" 
                dataKey="bandwidth" 
                stroke="#00FF88" 
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorBandwidth)"
                animationDuration={300}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-center justify-center gap-6 mt-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#00C2FF]" />
            <span className="text-xs text-gray-400">Packets/sec</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#00FF88]" />
            <span className="text-xs text-gray-400">Bandwidth (KB/s)</span>
          </div>
        </div>
      </motion.div>

      {/* Time Range Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-[#0F1419] to-[#1A1F26] rounded-xl p-4 border border-[#00C2FF]/20"
      >
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-4 h-4 text-[#00C2FF]" />
          <span className="text-white text-sm">Time Range</span>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">From: {generateTimeLabel(timeRange.start)}</span>
            <span className="text-gray-400">To: {generateTimeLabel(timeRange.end)}</span>
          </div>

          {/* Start Time Slider */}
          <div>
            <input
              type="range"
              min="0"
              max="24"
              value={timeRange.start}
              onChange={(e) => setTimeRange(prev => ({ ...prev, start: parseInt(e.target.value) }))}
              className="w-full h-2 bg-[#1A1F26] rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #00C2FF 0%, #00C2FF ${(timeRange.start / 24) * 100}%, #1A1F26 ${(timeRange.start / 24) * 100}%, #1A1F26 100%)`
              }}
            />
            <div className="text-xs text-gray-500 mt-1">Start Time</div>
          </div>

          {/* End Time Slider */}
          <div>
            <input
              type="range"
              min="0"
              max="24"
              value={timeRange.end}
              onChange={(e) => setTimeRange(prev => ({ ...prev, end: parseInt(e.target.value) }))}
              className="w-full h-2 bg-[#1A1F26] rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #00FF88 0%, #00FF88 ${(timeRange.end / 24) * 100}%, #1A1F26 ${(timeRange.end / 24) * 100}%, #1A1F26 100%)`
              }}
            />
            <div className="text-xs text-gray-500 mt-1">End Time</div>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by IP or protocol..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#1A1F26] border border-[#00C2FF]/20 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00C2FF]"
          />
        </div>
        <select
          value={selectedProtocol}
          onChange={(e) => setSelectedProtocol(e.target.value)}
          className="bg-[#1A1F26] border border-[#00C2FF]/20 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-[#00C2FF]"
        >
          <option value="all">All Protocols</option>
          <option value="TCP">TCP</option>
          <option value="UDP">UDP</option>
          <option value="HTTP">HTTP</option>
          <option value="HTTPS">HTTPS</option>
          <option value="DNS">DNS</option>
          <option value="ICMP">ICMP</option>
        </select>
      </div>

      {/* Export Button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={handleExportPCAP}
        className="w-full bg-gradient-to-r from-[#00C2FF]/20 to-[#00FF88]/20 border border-[#00C2FF]/30 text-[#00C2FF] py-3 rounded-xl flex items-center justify-center gap-2"
      >
        <Download className="w-5 h-5" />
        <span>Export .pcap File</span>
      </motion.button>

      {/* Packets List */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-white text-sm">Captured Packets ({filteredPackets.length})</span>
        </div>

        {filteredPackets.length === 0 ? (
          <div className="bg-gradient-to-br from-[#0F1419] to-[#1A1F26] rounded-xl p-8 border border-[#00C2FF]/20 text-center">
            <p className="text-gray-400">
              {isCapturing ? 'Waiting for packets...' : 'Start capture to see packets'}
            </p>
          </div>
        ) : (
          filteredPackets.map((packet, index) => (
            <motion.div
              key={packet.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedPacket(packet)}
              className={`bg-gradient-to-br from-[#0F1419] to-[#1A1F26] rounded-xl p-3 border cursor-pointer transition-all ${
                packet.status === 'malicious' 
                  ? 'border-red-500/40 hover:border-red-500/60' 
                  : packet.status === 'suspicious'
                  ? 'border-yellow-500/40 hover:border-yellow-500/60'
                  : 'border-[#00C2FF]/20 hover:border-[#00C2FF]/40'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded ${
                    packet.protocol === 'TCP' ? 'bg-[#00C2FF]/20 text-[#00C2FF]' :
                    packet.protocol === 'UDP' ? 'bg-[#00FF88]/20 text-[#00FF88]' :
                    packet.protocol === 'HTTP' ? 'bg-[#FFB800]/20 text-[#FFB800]' :
                    'bg-[#FF0080]/20 text-[#FF0080]'
                  }`}>
                    {packet.protocol}
                  </span>
                  {packet.status !== 'safe' && (
                    <AlertTriangle className={`w-4 h-4 ${
                      packet.status === 'malicious' ? 'text-red-500' : 'text-yellow-500'
                    }`} />
                  )}
                </div>
                <span className="text-xs text-gray-400">{packet.timestamp}</span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-300">{packet.source}</span>
                <ChevronRight className="w-4 h-4 text-gray-500" />
                <span className="text-gray-300">{packet.destination}</span>
              </div>

              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-400">Port: {packet.port}</span>
                <span className="text-xs text-gray-400">{packet.size} bytes</span>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
