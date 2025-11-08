import { useState } from 'react';
import { ArrowLeft, Copy, AlertTriangle, CheckCircle2, Layers, Code } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { PacketData } from './DPIView';
import { toast } from 'sonner@2.0.3';

interface PacketDetailViewProps {
  packet: PacketData;
  onBack: () => void;
  onMarkMalicious: (packetId: string) => void;
}

export function PacketDetailView({ packet, onBack, onMarkMalicious }: PacketDetailViewProps) {
  const [activeTab, setActiveTab] = useState<'summary' | 'layers' | 'payload'>('summary');
  const [viewMode, setViewMode] = useState<'hex' | 'ascii'>('hex');

  const generateHexDump = (text: string) => {
    const hexArray: string[] = [];
    for (let i = 0; i < text.length; i++) {
      hexArray.push(text.charCodeAt(i).toString(16).padStart(2, '0'));
    }
    
    const lines: string[] = [];
    for (let i = 0; i < hexArray.length; i += 16) {
      const offset = i.toString(16).padStart(4, '0');
      const hexPart = hexArray.slice(i, i + 16).join(' ');
      const asciiPart = text.slice(i, i + 16).replace(/[^\x20-\x7E]/g, '.');
      lines.push(`${offset}  ${hexPart.padEnd(48, ' ')}  ${asciiPart}`);
    }
    
    return lines.join('\n');
  };

  const mockPayloadFull = `${packet.payload}\r\n\r\n${JSON.stringify({
    user: 'john.doe@example.com',
    session: 'a3b5c7d9e1f2',
    timestamp: new Date().toISOString(),
    data: 'Sample application data...'
  }, null, 2)}`;

  const hexDump = generateHexDump(mockPayloadFull);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const handleMarkMalicious = () => {
    onMarkMalicious(packet.id);
    toast.success('Packet marked as malicious and logged');
  };

  const getThreatIcon = () => {
    switch (packet.threatStatus) {
      case 'clean':
        return <CheckCircle2 className="w-5 h-5 text-[#00FF88]" />;
      case 'suspicious':
        return <AlertTriangle className="w-5 h-5 text-[#FFB800]" />;
      case 'malicious':
        return <AlertTriangle className="w-5 h-5 text-[#FF006E]" />;
    }
  };

  const getThreatBadgeClass = () => {
    switch (packet.threatStatus) {
      case 'clean':
        return 'bg-[#00FF88]/20 text-[#00FF88] border-[#00FF88]/30';
      case 'suspicious':
        return 'bg-[#FFB800]/20 text-[#FFB800] border-[#FFB800]/30';
      case 'malicious':
        return 'bg-[#FF006E]/20 text-[#FF006E] border-[#FF006E]/30';
    }
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
            <h2 className="text-white">Packet Details</h2>
            <p className="text-[#00C2FF] font-mono">{packet.id}</p>
          </div>
          {getThreatIcon()}
        </div>

        {/* Threat Status Banner */}
        {packet.threatStatus !== 'clean' && (
          <div className={`rounded-xl p-4 mb-4 border ${
            packet.threatStatus === 'suspicious'
              ? 'bg-[#FFB800]/10 border-[#FFB800]/30'
              : 'bg-[#FF006E]/10 border-[#FF006E]/30'
          }`}>
            <div className="flex items-center gap-3">
              <AlertTriangle className={`w-5 h-5 ${
                packet.threatStatus === 'suspicious' ? 'text-[#FFB800]' : 'text-[#FF006E]'
              }`} />
              <div className="flex-1">
                <p className="text-white mb-1">
                  {packet.threatStatus === 'suspicious' ? 'Suspicious Activity Detected' : 'Malicious Packet Detected'}
                </p>
                <p className={packet.threatStatus === 'suspicious' ? 'text-[#FFB800]' : 'text-[#FF006E]'}>
                  {packet.threatStatus === 'suspicious' 
                    ? 'This packet shows unusual patterns. Review carefully.'
                    : 'This packet has been identified as malicious. Take immediate action.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="mb-4">
          <TabsList className="grid w-full grid-cols-3 bg-[#0F1419] border border-[#1a2028]">
            <TabsTrigger 
              value="summary" 
              className="data-[state=active]:bg-[#00C2FF]/20 data-[state=active]:text-[#00C2FF] text-gray-400"
            >
              Summary
            </TabsTrigger>
            <TabsTrigger 
              value="layers" 
              className="data-[state=active]:bg-[#00C2FF]/20 data-[state=active]:text-[#00C2FF] text-gray-400"
            >
              Layers
            </TabsTrigger>
            <TabsTrigger 
              value="payload" 
              className="data-[state=active]:bg-[#00C2FF]/20 data-[state=active]:text-[#00C2FF] text-gray-400"
            >
              Payload
            </TabsTrigger>
          </TabsList>

          {/* Summary Tab */}
          <TabsContent value="summary" className="mt-4">
            <div className="space-y-3">
              {/* Basic Info */}
              <div className="bg-[#0F1419] rounded-xl p-5 border border-[#1a2028] shadow-xl">
                <h3 className="text-white mb-4 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#00C2FF]" />
                  Packet Summary
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Protocol</span>
                    <Badge className="bg-[#00C2FF]/20 text-[#00C2FF] border border-[#00C2FF]/30">
                      {packet.protocol}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Source IP / Port</span>
                    <span className="text-white font-mono">{packet.sourceIP}:{packet.sourcePort}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Destination IP / Port</span>
                    <span className="text-white font-mono">{packet.destIP}:{packet.destPort}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Size</span>
                    <span className="text-white">{packet.size} bytes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Timestamp</span>
                    <span className="text-white">{packet.timestamp}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Threat Status</span>
                    <Badge className={`border ${getThreatBadgeClass()}`}>
                      {packet.threatStatus.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Connection Details */}
              <div className="bg-[#0F1419] rounded-xl p-5 border border-[#1a2028] shadow-xl">
                <h3 className="text-white mb-4">Connection Flow</h3>
                <div className="flex items-center justify-between">
                  <div className="flex-1 text-center">
                    <div className="w-12 h-12 bg-[#00C2FF]/20 rounded-lg mx-auto mb-2 flex items-center justify-center border border-[#00C2FF]/30">
                      <span className="text-[#00C2FF]">SRC</span>
                    </div>
                    <p className="text-gray-400">Source</p>
                    <p className="text-white font-mono">{packet.sourceIP}</p>
                  </div>

                  <div className="flex-1 flex items-center justify-center">
                    <div className="h-0.5 w-full bg-gradient-to-r from-[#00C2FF] via-[#00FF88] to-[#00C2FF] relative">
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-l-[8px] border-l-[#00C2FF] border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent"></div>
                    </div>
                  </div>

                  <div className="flex-1 text-center">
                    <div className="w-12 h-12 bg-[#00FF88]/20 rounded-lg mx-auto mb-2 flex items-center justify-center border border-[#00FF88]/30">
                      <span className="text-[#00FF88]">DST</span>
                    </div>
                    <p className="text-gray-400">Destination</p>
                    <p className="text-white font-mono">{packet.destIP}</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Layers Tab */}
          <TabsContent value="layers" className="mt-4 space-y-3">
            {/* Network Layer */}
            <div className="bg-[#0F1419] rounded-xl p-5 border border-[#1a2028] shadow-xl">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-[#00C2FF] rounded-full"></div>
                <h3 className="text-white">Network Layer (IP)</h3>
              </div>
              <div className="space-y-2 text-gray-400">
                <div className="flex justify-between font-mono">
                  <span>Version:</span>
                  <span className="text-white">IPv4</span>
                </div>
                <div className="flex justify-between font-mono">
                  <span>Header Length:</span>
                  <span className="text-white">20 bytes</span>
                </div>
                <div className="flex justify-between font-mono">
                  <span>TTL:</span>
                  <span className="text-white">64</span>
                </div>
                <div className="flex justify-between font-mono">
                  <span>Checksum:</span>
                  <span className="text-white">0x{Math.floor(Math.random() * 65535).toString(16).padStart(4, '0')}</span>
                </div>
              </div>
            </div>

            {/* Transport Layer */}
            <div className="bg-[#0F1419] rounded-xl p-5 border border-[#1a2028] shadow-xl">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-[#00FF88] rounded-full"></div>
                <h3 className="text-white">Transport Layer ({packet.protocol})</h3>
              </div>
              <div className="space-y-2 text-gray-400">
                <div className="flex justify-between font-mono">
                  <span>Source Port:</span>
                  <span className="text-white">{packet.sourcePort}</span>
                </div>
                <div className="flex justify-between font-mono">
                  <span>Dest Port:</span>
                  <span className="text-white">{packet.destPort}</span>
                </div>
                {packet.protocol === 'TCP' && (
                  <>
                    <div className="flex justify-between font-mono">
                      <span>Seq Number:</span>
                      <span className="text-white">{Math.floor(Math.random() * 4294967295)}</span>
                    </div>
                    <div className="flex justify-between font-mono">
                      <span>Flags:</span>
                      <span className="text-white">ACK, PSH</span>
                    </div>
                  </>
                )}
                <div className="flex justify-between font-mono">
                  <span>Checksum:</span>
                  <span className="text-white">0x{Math.floor(Math.random() * 65535).toString(16).padStart(4, '0')}</span>
                </div>
              </div>
            </div>

            {/* Application Layer */}
            <div className="bg-[#0F1419] rounded-xl p-5 border border-[#1a2028] shadow-xl">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-[#FFB800] rounded-full"></div>
                <h3 className="text-white">Application Layer</h3>
              </div>
              <div className="space-y-2 text-gray-400">
                <div className="flex justify-between font-mono">
                  <span>Protocol:</span>
                  <span className="text-white">
                    {packet.destPort === 80 ? 'HTTP' : packet.destPort === 443 ? 'HTTPS' : packet.destPort === 53 ? 'DNS' : 'Unknown'}
                  </span>
                </div>
                <div className="flex justify-between font-mono">
                  <span>Payload Size:</span>
                  <span className="text-white">{packet.size - 40} bytes</span>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Payload Tab */}
          <TabsContent value="payload" className="mt-4">
            <div className="space-y-3">
              {/* View Toggle */}
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setViewMode('hex')}
                  size="sm"
                  className={`flex-1 ${
                    viewMode === 'hex'
                      ? 'bg-[#00C2FF]/20 text-[#00C2FF] border border-[#00C2FF]/30'
                      : 'bg-[#0F1419] text-gray-400 border border-[#1a2028]'
                  }`}
                >
                  HEX
                </Button>
                <Button
                  onClick={() => setViewMode('ascii')}
                  size="sm"
                  className={`flex-1 ${
                    viewMode === 'ascii'
                      ? 'bg-[#00C2FF]/20 text-[#00C2FF] border border-[#00C2FF]/30'
                      : 'bg-[#0F1419] text-gray-400 border border-[#1a2028]'
                  }`}
                >
                  ASCII
                </Button>
              </div>

              {/* Payload Viewer */}
              <div className="bg-[#0F1419] rounded-xl p-5 border border-[#1a2028] shadow-xl">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white flex items-center gap-2">
                    <Code className="w-4 h-4 text-[#00C2FF]" />
                    Raw Payload
                  </h3>
                  <Button
                    onClick={() => copyToClipboard(viewMode === 'hex' ? hexDump : mockPayloadFull)}
                    size="sm"
                    className="bg-[#00C2FF]/20 hover:bg-[#00C2FF]/30 text-[#00C2FF] border border-[#00C2FF]/30"
                  >
                    <Copy className="w-3 h-3 mr-2" />
                    Copy
                  </Button>
                </div>

                <div className="bg-[#0A0F14] rounded-lg p-3 max-h-[300px] overflow-auto">
                  <pre className="text-[#00FF88] font-mono whitespace-pre-wrap break-all">
                    {viewMode === 'hex' ? hexDump : mockPayloadFull}
                  </pre>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Actions */}
        <div className="space-y-3">
          {packet.threatStatus !== 'malicious' && (
            <Button
              onClick={handleMarkMalicious}
              className="w-full h-12 rounded-xl bg-[#FF006E]/20 hover:bg-[#FF006E]/30 text-[#FF006E] border border-[#FF006E]/30"
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              Mark as Malicious
            </Button>
          )}

          <Button
            onClick={() => copyToClipboard(JSON.stringify(packet, null, 2))}
            variant="outline"
            className="w-full h-12 rounded-xl bg-[#0F1419] text-white border-[#1a2028] hover:bg-[#1a2028]"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy Packet Data
          </Button>
        </div>
      </div>
    </div>
  );
}
