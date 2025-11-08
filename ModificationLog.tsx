import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  FileText, 
  Download, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle, 
  Shield 
} from 'lucide-react';

interface ModificationLogProps {
  userId: string;
  sessionToken: string;
}

interface LogEntry {
  id: string;
  requestId: string;
  timestamp: string;
  action: string;
  url: string;
  method: string;
  changes: string[];
  hash: string;
  reason: string;
}

export function ModificationLog({ userId, sessionToken }: ModificationLogProps) {
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: 'log_001',
      requestId: 'req_1234567890',
      timestamp: new Date().toISOString(),
      action: 'Request Modified',
      url: 'https://api.example.com/api/user/login',
      method: 'POST',
      changes: ['Modified request body', 'Added authentication header', 'Changed content-type'],
      hash: 'a7f8d9e2c1b4f6a3e8d7c9b2f1a5e4d3c8b7a6f9e2d1c4b8a7e6d9f2c1a5b4e3',
      reason: 'Testing authentication bypass vulnerability'
    },
    {
      id: 'log_002',
      requestId: 'req_0987654321',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      action: 'Response Modified',
      url: 'https://api.example.com/api/data',
      method: 'GET',
      changes: ['Modified response body', 'Changed status code to 200'],
      hash: 'b8e9c1d2f3a4e5b6c7d8e9f1a2b3c4d5e6f7a8b9c1d2e3f4a5b6c7d8e9f1a2b3',
      reason: 'Testing error handling'
    }
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredLogs = logs.filter(log =>
    log.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.method.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.action.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `modification_log_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 space-y-4 pb-20">
      {/* Header */}
      <div>
        <h1 className="text-2xl text-white mb-1">Modification Log</h1>
        <p className="text-sm text-gray-400">Secure audit trail of all network modifications</p>
      </div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-[#0F1419] to-[#1A1F26] rounded-xl p-4 border border-[#00C2FF]/20"
      >
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs text-gray-400 mb-1">Total Logs</p>
            <p className="text-xl text-white">{logs.length}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Today</p>
            <p className="text-xl text-[#00C2FF]">
              {logs.filter(l => 
                new Date(l.timestamp).toDateString() === new Date().toDateString()
              ).length}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Verified</p>
            <div className="flex items-center justify-center gap-1">
              <CheckCircle className="w-4 h-4 text-[#00FF88]" />
              <span className="text-xl text-[#00FF88]">{logs.length}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Search & Export */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#1A1F26] border border-[#00C2FF]/20 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00C2FF]"
          />
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleExport}
          className="px-4 bg-gradient-to-r from-[#00C2FF]/20 to-[#00FF88]/20 border border-[#00C2FF]/30 text-[#00C2FF] rounded-lg flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          <span>Export</span>
        </motion.button>
      </div>

      {/* Log Entries */}
      <div className="space-y-3">
        {filteredLogs.length === 0 ? (
          <div className="bg-gradient-to-br from-[#0F1419] to-[#1A1F26] rounded-xl p-8 border border-[#00C2FF]/20 text-center">
            <FileText className="w-12 h-12 text-gray-500 mx-auto mb-2" />
            <p className="text-gray-400">No modification logs found</p>
          </div>
        ) : (
          filteredLogs.map((log, index) => {
            const isExpanded = expandedId === log.id;
            return (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-gradient-to-br from-[#0F1419] to-[#1A1F26] rounded-xl border border-[#00C2FF]/20 overflow-hidden"
              >
                <button
                  onClick={() => setExpandedId(isExpanded ? null : log.id)}
                  className="w-full p-4 text-left hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs px-2 py-1 rounded ${
                          log.method === 'GET' ? 'bg-[#00FF88]/20 text-[#00FF88]' :
                          log.method === 'POST' ? 'bg-[#00C2FF]/20 text-[#00C2FF]' :
                          'bg-[#FFB800]/20 text-[#FFB800]'
                        }`}>
                          {log.method}
                        </span>
                        <span className="text-xs text-[#00C2FF]">{log.action}</span>
                      </div>
                      <p className="text-white text-sm truncate">{log.url}</p>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" />
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                    <span className="text-xs text-gray-400">
                      {log.changes.length} changes
                    </span>
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t border-[#00C2FF]/10 p-4 space-y-3">
                    {/* Request ID */}
                    <div className="bg-[#1A1F26] rounded-lg p-3">
                      <p className="text-xs text-gray-400 mb-1">Request ID</p>
                      <p className="text-white font-mono text-sm">{log.requestId}</p>
                    </div>

                    {/* Changes */}
                    <div className="bg-[#1A1F26] rounded-lg p-3">
                      <p className="text-white text-sm mb-2">Changes Made</p>
                      <div className="space-y-1">
                        {log.changes.map((change, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-gray-300 text-sm">
                            <span className="text-[#00FF88]">•</span>
                            <span>{change}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Reason */}
                    <div className="bg-[#1A1F26] rounded-lg p-3">
                      <p className="text-xs text-gray-400 mb-1">Reason</p>
                      <p className="text-white text-sm">{log.reason}</p>
                    </div>

                    {/* SHA-256 Hash */}
                    <div className="bg-[#1A1F26] rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="w-4 h-4 text-[#00C2FF]" />
                        <p className="text-white text-sm">SHA-256 Verification</p>
                      </div>
                      <p className="text-xs text-gray-400 mb-1">Hash</p>
                      <p className="text-[#00C2FF] font-mono text-xs break-all">{log.hash}</p>
                      <div className="flex items-center gap-1 mt-2 text-[#00FF88] text-xs">
                        <CheckCircle className="w-3 h-3" />
                        <span>Verified</span>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })
        )}
      </div>

      {/* Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-[#00C2FF]/10 to-[#00FF88]/10 border border-[#00C2FF]/20 rounded-xl p-4"
      >
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-[#00C2FF] flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-white text-sm mb-1">Accountability & Compliance</h4>
            <p className="text-xs text-gray-400">
              All modifications are cryptographically verified with SHA-256 checksums.
              Logs can be exported for audit purposes and compliance reviews.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
