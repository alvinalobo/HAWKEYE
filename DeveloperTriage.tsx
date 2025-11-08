import { useState, useEffect } from 'react';
import { Terminal, User, Wifi, Activity } from 'lucide-react';

interface DeveloperTriageProps {
  onAnalysisComplete: () => void;
}

export function DeveloperTriage({ onAnalysisComplete }: DeveloperTriageProps) {
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: string; text: string; timestamp: string }>>([]);
  const [token] = useState('TKN-' + Math.random().toString(36).substring(2, 10).toUpperCase());

  useEffect(() => {
    // Simulate connection
    const timer = setTimeout(() => {
      setConnected(true);
      const now = new Date();
      setMessages([
        { 
          sender: 'System', 
          text: 'Token INVITE sent to developer',
          timestamp: now.toLocaleTimeString()
        },
        { 
          sender: 'System', 
          text: 'Developer connected using token',
          timestamp: new Date(now.getTime() + 1000).toLocaleTimeString()
        },
        { 
          sender: 'Developer', 
          text: 'Reviewing suspicious session...',
          timestamp: new Date(now.getTime() + 2000).toLocaleTimeString()
        },
      ]);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (connected) {
      // Add more messages over time
      const messageTimers = [
        setTimeout(() => {
          setMessages(prev => [...prev, {
            sender: 'Developer',
            text: 'Checking certificate chain',
            timestamp: new Date().toLocaleTimeString()
          }]);
        }, 3000),
        setTimeout(() => {
          setMessages(prev => [...prev, {
            sender: 'Developer',
            text: 'Analyzing packet signatures',
            timestamp: new Date().toLocaleTimeString()
          }]);
        }, 5000),
        setTimeout(() => {
          setMessages(prev => [...prev, {
            sender: 'Developer',
            text: 'Running deep inspection...',
            timestamp: new Date().toLocaleTimeString()
          }]);
        }, 7000),
        setTimeout(() => {
          setMessages(prev => [...prev, {
            sender: 'System',
            text: 'Developer making decision...',
            timestamp: new Date().toLocaleTimeString()
          }]);
        }, 9000),
      ];

      // After all analysis, move to decision screen
      const completeTimer = setTimeout(() => {
        onAnalysisComplete();
      }, 11000);

      return () => {
        messageTimers.forEach(t => clearTimeout(t));
        clearTimeout(completeTimer);
      };
    }
  }, [connected, onAnalysisComplete]);

  return (
    <div className="min-h-screen bg-emerald-600 text-white p-6 pt-16">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Terminal className="w-10 h-10" />
            </div>
          </div>
          <h2 className="text-white mb-1">Developer Triage</h2>
          <p className="text-emerald-100">Live threat investigation in progress</p>
        </div>

        {/* Connection Status */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Wifi className={`w-5 h-5 ${connected ? 'text-emerald-300' : 'text-yellow-300'} ${!connected && 'animate-pulse'}`} />
              <span className="text-white">
                {connected ? 'Connected' : 'Connecting...'}
              </span>
            </div>
            {connected && (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-300" />
                <span className="text-emerald-100">Developer Online</span>
              </div>
            )}
          </div>
          
          <div className="bg-white/10 rounded-lg p-3">
            <p className="text-emerald-100 mb-1">Session Token</p>
            <p className="text-white font-mono">{token}</p>
          </div>
        </div>

        {/* Live Stream Info */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-5 h-5 text-emerald-300 animate-pulse" />
            <p className="text-white">Streaming Session Data</p>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-emerald-100">Packets Streamed</span>
              <span className="text-emerald-300">47</span>
            </div>
            <div className="flex justify-between">
              <span className="text-emerald-100">Data Size</span>
              <span className="text-emerald-300">2.4 MB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-emerald-100">Stream Duration</span>
              <span className="text-emerald-300">Live</span>
            </div>
          </div>
        </div>

        {/* Message Log */}
        {connected && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse"></div>
              <p className="text-white">Live Activity Log</p>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {messages.map((msg, idx) => (
                <div key={idx} className="bg-white/10 rounded-lg p-3 animate-in slide-in-from-bottom-2">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-emerald-300">{msg.sender}</p>
                    <span className="text-emerald-200 text-xs">{msg.timestamp}</span>
                  </div>
                  <p className="text-white">{msg.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Status */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
            <div className="w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></div>
            <span className="text-emerald-100">Developer analyzing threat...</span>
          </div>
          <p className="text-emerald-100 mt-3">You will be notified of the decision</p>
        </div>
      </div>
    </div>
  );
}
