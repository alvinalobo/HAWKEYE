import { useState, useEffect } from 'react';
import { ArrowLeft, Search, Filter, Download, Pause, Play, ChevronRight, Activity } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';

interface DPIViewProps {
  onBack: () => void;
  onViewPacketDetail: (packet: PacketData) => void;
}

export interface PacketData {
  id: string;
  protocol: 'TCP' | 'UDP' | 'ICMP' | 'DNS' | 'HTTP' | 'HTTPS';
  sourceIP: string;
  sourcePort: number;
  destIP: string;
  destPort: number;
  size: number;
  timestamp: string;
  threatStatus: 'clean' | 'suspicious' | 'malicious';
  payload: string;
}

export function DPIView({ onBack, onViewPacketDetail }: DPIViewProps) {
  const [packets, setPackets] = useState<PacketData[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProtocol, setFilterProtocol] = useState<string>('all');
  const [packetsPerSec, setPacketsPerSec] = useState(0);

  // Generate mock packets
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      const protocols: PacketData['protocol'][] = ['TCP', 'UDP', 'ICMP', 'DNS', 'HTTP', 'HTTPS'];
      const threatStatuses: PacketData['threatStatus'][] = ['clean', 'clean', 'clean', 'suspicious', 'malicious'];
      
      const mockIPs = [
        '192.168.1.100',
        '10.0.0.45',
        '172.16.0.23',
        '8.8.8.8',
        '1.1.1.1',
        '93.184.216.34'
      ];

      const newPacket: PacketData = {
        id: `PKT-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        protocol: protocols[Math.floor(Math.random() * protocols.length)],
        sourceIP: mockIPs[Math.floor(Math.random() * mockIPs.length)],
        sourcePort: Math.floor(Math.random() * 65535),
        destIP: mockIPs[Math.floor(Math.random() * mockIPs.length)],
        destPort: [80, 443, 53, 8080, 3000, 5432][Math.floor(Math.random() * 6)],
        size: Math.floor(Math.random() * 1500) + 64,
        timestamp: new Date().toLocaleTimeString(),
        threatStatus: threatStatuses[Math.floor(Math.random() * threatStatuses.length)],
        payload: generateMockPayload()
      };

      setPackets(prev => [newPacket, ...prev].slice(0, 100)); // Keep last 100
      setPacketsPerSec(prev => prev + 1);
    }, Math.random() * 500 + 200);

    // Reset packets/sec counter
    const resetInterval = setInterval(() => {
      setPacketsPerSec(0);
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(resetInterval);
    };
  }, [isPaused]);

  const generateMockPayload = () => {
    const payloads = [
      'GET /api/users HTTP/1.1\\r\\nHost: example.com',
      'POST /login HTTP/1.1\\r\\nContent-Type: application/json',
      'DNS Query: example.com A?',
      'TLS Handshake ClientHello',
      'HTTP/1.1 200 OK\\r\\nContent-Type: text/html',
    ];
    return payloads[Math.floor(Math.random() * payloads.length)];
  };

  const filteredPackets = packets.filter(packet => {
    const matchesSearch = 
      packet.sourceIP.includes(searchTerm) ||
      packet.destIP.includes(searchTerm) ||
      packet.protocol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      packet.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesProtocol = filterProtocol === 'all' || packet.protocol === filterProtocol;
    
    return matchesSearch && matchesProtocol;
  });

  const exportPCAP = () => {
    const pcapData = packets.map(p => ({
      id: p.id,
      timestamp: p.timestamp,
      protocol: p.protocol,
      src: `${p.sourceIP}:${p.sourcePort}`,
      dst: `${p.destIP}:${p.destPort}`,
      size: p.size,
      threat: p.threatStatus
    }));

    const blob = new Blob([JSON.stringify(pcapData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hawkeye-capture-${new Date().toISOString()}.pcap.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getThreatColor = (status: PacketData['threatStatus']) => {
    switch (status) {
      case 'clean':
        return 'bg-[#00FF88]/20 text-[#00FF88] border-[#00FF88]/30';
      case 'suspicious':
        return 'bg-[#FFB800]/20 text-[#FFB800] border-[#FFB800]/30';
      case 'malicious':
        return 'bg-[#FF006E]/20 text-[#FF006E] border-[#FF006E]/30';
    }
  };

  const getProtocolColor = (protocol: string) => {
    const colors: Record<string, string> = {
      TCP: '#00C2FF',
      UDP: '#00FF88',
      ICMP: '#FFB800',
      DNS: '#FF006E',
      HTTP: '#8B5CF6',
      HTTPS: '#EC4899'
    };
    return colors[protocol] || '#6B7280';
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
            <h2 className="text-white">Deep Packet Inspection</h2>
            <p className="text-[#00C2FF]">Live network traffic analysis</p>
          </div>
        </div>

        {/* Live Indicator */}
        <div className="bg-gradient-to-r from-[#00FF88]/20 to-[#00C2FF]/20 rounded-xl p-4 mb-4 border border-[#00FF88]/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-3 h-3 bg-[#00FF88] rounded-full animate-pulse"></div>
                <div className="absolute inset-0 w-3 h-3 bg-[#00FF88] rounded-full animate-ping"></div>
              </div>
              <div>
                <span className="text-white block">Capturing Live Traffic</span>
                <span className="text-[#00FF88]">{packetsPerSec} packets/sec</span>
              </div>
            </div>
            <Activity className="w-6 h-6 text-[#00C2FF] animate-pulse" />
          </div>
        </div>

        {/* Controls */}
        <div className="bg-[#0F1419] rounded-xl p-4 mb-4 border border-[#1a2028] shadow-xl">
          {/* Search */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search IP, port, protocol..."
              className="w-full bg-[#0A0F14] border-[#1a2028] text-white pl-10 focus:border-[#00C2FF] focus:ring-[#00C2FF]"
            />
          </div>

          {/* Filter & Actions */}
          <div className="flex items-center gap-2">
            <select
              value={filterProtocol}
              onChange={(e) => setFilterProtocol(e.target.value)}
              className="flex-1 bg-[#0A0F14] border border-[#1a2028] text-white rounded-lg px-3 py-2 focus:border-[#00C2FF] focus:outline-none"
            >
              <option value="all">All Protocols</option>
              <option value="TCP">TCP</option>
              <option value="UDP">UDP</option>
              <option value="ICMP">ICMP</option>
              <option value="DNS">DNS</option>
              <option value="HTTP">HTTP</option>
              <option value="HTTPS">HTTPS</option>
            </select>

            <Button
              onClick={() => setIsPaused(!isPaused)}
              size="sm"
              className={`px-4 ${
                isPaused
                  ? 'bg-[#00FF88]/20 hover:bg-[#00FF88]/30 text-[#00FF88] border border-[#00FF88]/30'
                  : 'bg-[#FFB800]/20 hover:bg-[#FFB800]/30 text-[#FFB800] border border-[#FFB800]/30'
              }`}
            >
              {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            </Button>

            <Button
              onClick={exportPCAP}
              size="sm"
              className="bg-[#00C2FF]/20 hover:bg-[#00C2FF]/30 text-[#00C2FF] border border-[#00C2FF]/30"
            >
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-[#0F1419] rounded-lg p-3 border border-[#1a2028] text-center">
            <p className="text-gray-400">Total</p>
            <p className="text-white">{packets.length}</p>
          </div>
          <div className="bg-[#0F1419] rounded-lg p-3 border border-[#1a2028] text-center">
            <p className="text-gray-400">Suspicious</p>
            <p className="text-[#FFB800]">
              {packets.filter(p => p.threatStatus === 'suspicious').length}
            </p>
          </div>
          <div className="bg-[#0F1419] rounded-lg p-3 border border-[#1a2028] text-center">
            <p className="text-gray-400">Malicious</p>
            <p className="text-[#FF006E]">
              {packets.filter(p => p.threatStatus === 'malicious').length}
            </p>
          </div>
        </div>

        {/* Packet List */}
        <div className="bg-[#0F1419] rounded-xl p-4 border border-[#1a2028] shadow-xl mb-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-white">Captured Packets</span>
            <Badge className="bg-[#00C2FF]/20 text-[#00C2FF] border border-[#00C2FF]/30">
              {filteredPackets.length}
            </Badge>
          </div>

          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {filteredPackets.length === 0 ? (
              <div className="text-center py-8">
                <Activity className="w-8 h-8 mx-auto mb-2 text-gray-500" />
                <p className="text-gray-400">
                  {isPaused ? 'Capture paused' : 'No packets match filters'}
                </p>
              </div>
            ) : (
              filteredPackets.map(packet => (
                <button
                  key={packet.id}
                  onClick={() => onViewPacketDetail(packet)}
                  className="w-full text-left p-3 bg-[#0A0F14] hover:bg-[#1a2028] rounded-lg border border-[#1a2028] transition-all group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: getProtocolColor(packet.protocol) }}
                      ></div>
                      <Badge
                        className="border"
                        style={{
                          backgroundColor: `${getProtocolColor(packet.protocol)}20`,
                          color: getProtocolColor(packet.protocol),
                          borderColor: `${getProtocolColor(packet.protocol)}50`
                        }}
                      >
                        {packet.protocol}
                      </Badge>
                      <Badge className={getThreatColor(packet.threatStatus)}>
                        {packet.threatStatus === 'clean' ? '✓' : packet.threatStatus === 'suspicious' ? '⚠' : '✕'}
                      </Badge>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#00C2FF] transition-colors" />
                  </div>

                  <div className="flex items-center gap-2 mb-1 font-mono">
                    <span className="text-[#00C2FF]">{packet.sourceIP}:{packet.sourcePort}</span>
                    <span className="text-gray-500">→</span>
                    <span className="text-[#00FF88]">{packet.destIP}:{packet.destPort}</span>
                  </div>

                  <div className="flex items-center justify-between text-gray-400">
                    <span className="font-mono">{packet.id}</span>
                    <div className="flex items-center gap-3">
                      <span>{packet.size}B</span>
                      <span>{packet.timestamp}</span>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Mini Sparkline */}
        <div className="bg-[#0F1419] rounded-lg p-3 border border-[#1a2028]">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Network Activity</span>
            <div className="flex items-center gap-2">
              <div className="w-16 h-8 bg-[#0A0F14] rounded flex items-end gap-0.5 px-1">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-gradient-to-t from-[#00C2FF] to-[#00FF88] rounded-t"
                    style={{ height: `${Math.random() * 100}%` }}
                  ></div>
                ))}
              </div>
              <span className="text-[#00C2FF]">{packetsPerSec}/s</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
