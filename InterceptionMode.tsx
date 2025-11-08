import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Activity, 
  Pause, 
  Play, 
  Filter, 
  Eye, 
  EyeOff, 
  FileEdit, 
  ChevronRight,
  AlertTriangle
} from 'lucide-react';

interface InterceptionModeProps {
  isCapturing: boolean;
  userId: string;
  sessionToken: string;
}

export interface NetworkRequest {
  id: string;
  timestamp: string;
  method: string;
  url: string;
  status: 'pending' | 'paused' | 'forwarded' | 'modified';
  host: string;
  path: string;
  protocol: string;
  size: string;
  type: string;
  matchesBreakpoint: boolean;
}

export function InterceptionMode({ isCapturing, userId, sessionToken }: InterceptionModeProps) {
  const [isIntercepting, setIsIntercepting] = useState(true);
  const [requests, setRequests] = useState<NetworkRequest[]>([]);
  const [breakpoints, setBreakpoints] = useState({
    enabled: true,
    methods: ['POST', 'PUT', 'DELETE'],
    hostPattern: '',
    pathPattern: '/api/',
  });
  const [stats, setStats] = useState({
    total: 0,
    paused: 0,
    modified: 0,
    forwarded: 0,
  });
  const [showBreakpointConfig, setShowBreakpointConfig] = useState(false);

  useEffect(() => {
    if (!isIntercepting || !isCapturing) return;

    const interval = setInterval(() => {
      const mockHosts = ['api.example.com', 'cdn.service.io', 'analytics.app.com', 'auth.secure.net'];
      const mockPaths = ['/api/user', '/api/data', '/v1/events', '/auth/login', '/static/image.jpg', '/api/posts'];
      const mockMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
      
      const method = mockMethods[Math.floor(Math.random() * mockMethods.length)];
      const host = mockHosts[Math.floor(Math.random() * mockHosts.length)];
      const path = mockPaths[Math.floor(Math.random() * mockPaths.length)];
      
      const matchesBreakpoint = breakpoints.enabled && (
        (breakpoints.methods.includes(method)) ||
        (breakpoints.hostPattern && host.includes(breakpoints.hostPattern)) ||
        (breakpoints.pathPattern && path.includes(breakpoints.pathPattern))
      );

      const newRequest: NetworkRequest = {
        id: `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toLocaleTimeString(),
        method,
        url: `https://${host}${path}`,
        status: matchesBreakpoint ? 'paused' : 'forwarded',
        host,
        path,
        protocol: 'HTTPS',
        size: `${Math.floor(Math.random() * 50) + 1}KB`,
        type: path.includes('/api/') ? 'API' : 'Static',
        matchesBreakpoint,
      };

      setRequests(prev => [newRequest, ...prev].slice(0, 30));
      
      if (matchesBreakpoint) {
        setStats(prev => ({ ...prev, total: prev.total + 1, paused: prev.paused + 1 }));
      } else {
        setStats(prev => ({ ...prev, total: prev.total + 1, forwarded: prev.forwarded + 1 }));
      }
    }, Math.random() * 2000 + 1000);

    return () => clearInterval(interval);
  }, [isIntercepting, breakpoints, isCapturing]);

  const toggleMethod = (method: string) => {
    setBreakpoints(prev => ({
      ...prev,
      methods: prev.methods.includes(method)
        ? prev.methods.filter(m => m !== method)
        : [...prev.methods, method]
    }));
  };

  return (
    <div className="p-4 space-y-4 pb-20">
      {/* Header */}
      <div>
        <h1 className="text-2xl text-white mb-1">Live Network Interception</h1>
        <p className="text-sm text-gray-400">Capture and modify requests in real-time</p>
      </div>

      {/* Warning Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-[#FFB800]/10 to-[#FF0080]/10 border border-[#FFB800]/30 rounded-xl p-3"
      >
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-5 h-5 text-[#FFB800] flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-[#FFB800] text-sm mb-1">Authorized Testing Only</h3>
            <p className="text-xs text-gray-400">All actions are logged and encrypted. Use only with permission.</p>
          </div>
        </div>
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-[#0F1419] to-[#1A1F26] rounded-xl p-4 border border-[#00C2FF]/20"
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-white">Intercept Mode</span>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsIntercepting(!isIntercepting)}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
              isIntercepting
                ? 'bg-[#FFB800] text-[#0A0F14]'
                : 'bg-[#1A1F26] border border-[#00C2FF]/30 text-[#00C2FF]'
            }`}
          >
            {isIntercepting ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Resume</span>
              </>
            )}
          </motion.button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-2">
          <div className="bg-[#1A1F26] rounded-lg p-3 text-center">
            <p className="text-xs text-gray-400 mb-1">Total</p>
            <p className="text-white">{stats.total}</p>
          </div>
          <div className="bg-[#FFB800]/10 border border-[#FFB800]/30 rounded-lg p-3 text-center">
            <p className="text-xs text-[#FFB800] mb-1">Paused</p>
            <p className="text-white">{stats.paused}</p>
          </div>
          <div className="bg-[#00C2FF]/10 border border-[#00C2FF]/30 rounded-lg p-3 text-center">
            <p className="text-xs text-[#00C2FF] mb-1">Modified</p>
            <p className="text-white">{stats.modified}</p>
          </div>
          <div className="bg-[#00FF88]/10 border border-[#00FF88]/30 rounded-lg p-3 text-center">
            <p className="text-xs text-[#00FF88] mb-1">Forwarded</p>
            <p className="text-white">{stats.forwarded}</p>
          </div>
        </div>
      </motion.div>

      {/* Breakpoint Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-[#0F1419] to-[#1A1F26] rounded-xl border border-[#00C2FF]/20 overflow-hidden"
      >
        <button
          onClick={() => setShowBreakpointConfig(!showBreakpointConfig)}
          className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-[#00C2FF]" />
            <span className="text-white">Breakpoint Filters</span>
          </div>
          {showBreakpointConfig ? (
            <EyeOff className="w-5 h-5 text-gray-400" />
          ) : (
            <Eye className="w-5 h-5 text-gray-400" />
          )}
        </button>

        {showBreakpointConfig && (
          <div className="border-t border-[#00C2FF]/10 p-4 space-y-4">
            {/* Enable Toggle */}
            <div className="flex items-center justify-between">
              <span className="text-white text-sm">Enable Breakpoints</span>
              <div className={`w-12 h-6 rounded-full transition-colors ${
                breakpoints.enabled ? 'bg-[#00FF88]' : 'bg-gray-600'
              } relative cursor-pointer`}
                onClick={() => setBreakpoints(prev => ({ ...prev, enabled: !prev.enabled }))}
              >
                <motion.div
                  className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full"
                  animate={{ x: breakpoints.enabled ? 24 : 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </div>
            </div>

            {/* Method Filters */}
            <div>
              <p className="text-white text-sm mb-2">HTTP Methods</p>
              <div className="flex flex-wrap gap-2">
                {['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].map(method => (
                  <motion.button
                    key={method}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleMethod(method)}
                    className={`px-3 py-1 rounded-lg text-xs transition-colors ${
                      breakpoints.methods.includes(method)
                        ? 'bg-[#FFB800] text-[#0A0F14]'
                        : 'bg-[#1A1F26] border border-[#00C2FF]/20 text-gray-400'
                    }`}
                  >
                    {method}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Host Pattern */}
            <div>
              <label className="text-white text-sm mb-2 block">Host Pattern</label>
              <input
                type="text"
                value={breakpoints.hostPattern}
                onChange={(e) => setBreakpoints(prev => ({ ...prev, hostPattern: e.target.value }))}
                placeholder="e.g., api.example.com"
                className="w-full bg-[#1A1F26] border border-[#00C2FF]/20 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00C2FF]"
              />
            </div>

            {/* Path Pattern */}
            <div>
              <label className="text-white text-sm mb-2 block">Path Pattern</label>
              <input
                type="text"
                value={breakpoints.pathPattern}
                onChange={(e) => setBreakpoints(prev => ({ ...prev, pathPattern: e.target.value }))}
                placeholder="e.g., /api/"
                className="w-full bg-[#1A1F26] border border-[#00C2FF]/20 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00C2FF]"
              />
            </div>
          </div>
        )}
      </motion.div>

      {/* Live Requests */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-white text-sm">Live Requests ({requests.length})</span>
          {isIntercepting && (
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

        {requests.length === 0 ? (
          <div className="bg-gradient-to-br from-[#0F1419] to-[#1A1F26] rounded-xl p-8 border border-[#00C2FF]/20 text-center">
            <Activity className="w-12 h-12 text-gray-500 mx-auto mb-2" />
            <p className="text-gray-400 text-sm">
              {isIntercepting && isCapturing ? 'Waiting for requests...' : 'Start capture to intercept requests'}
            </p>
          </div>
        ) : (
          requests.map((request, index) => (
            <motion.div
              key={request.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.02 }}
              className={`bg-gradient-to-br from-[#0F1419] to-[#1A1F26] rounded-xl p-3 border cursor-pointer transition-all ${
                request.matchesBreakpoint
                  ? 'border-[#FFB800]/40 hover:border-[#FFB800]/60'
                  : request.status === 'modified'
                  ? 'border-[#00C2FF]/40 hover:border-[#00C2FF]/60'
                  : 'border-[#00C2FF]/20 hover:border-[#00C2FF]/40'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded ${
                    request.method === 'GET' ? 'bg-[#00FF88]/20 text-[#00FF88]' :
                    request.method === 'POST' ? 'bg-[#00C2FF]/20 text-[#00C2FF]' :
                    request.method === 'PUT' ? 'bg-[#FFB800]/20 text-[#FFB800]' :
                    'bg-red-500/20 text-red-500'
                  }`}>
                    {request.method}
                  </span>
                  <span className="text-gray-300 text-sm">{request.host}</span>
                </div>
                {request.matchesBreakpoint && (
                  <div className="flex items-center gap-1 bg-[#FFB800]/20 px-2 py-1 rounded-full">
                    <AlertTriangle className="w-3 h-3 text-[#FFB800]" />
                    <span className="text-xs text-[#FFB800]">PAUSED</span>
                  </div>
                )}
              </div>

              <div className="text-sm text-gray-400 mb-2 truncate">{request.path}</div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">{request.timestamp}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">{request.size}</span>
                  {request.status === 'modified' && (
                    <span className="text-xs bg-[#00C2FF]/20 text-[#00C2FF] px-2 py-0.5 rounded">MODIFIED</span>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
