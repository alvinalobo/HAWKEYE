import { useState, useEffect } from 'react';
import { AlertTriangle, Send, CheckCircle2, Wifi } from 'lucide-react';
import { Button } from './ui/button';

interface MaliciousAlertProps {
  onContinue: () => void;
}

export function MaliciousAlert({ onContinue }: MaliciousAlertProps) {
  const [sending, setSending] = useState(true);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSending(false);
      setSent(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (sent) {
      const continueTimer = setTimeout(() => {
        onContinue();
      }, 2000);

      return () => clearTimeout(continueTimer);
    }
  }, [sent, onContinue]);

  return (
    <div className="min-h-screen bg-emerald-600 text-white p-6 pt-20 flex items-center justify-center">
      <div className="max-w-md mx-auto w-full">
        {sending ? (
          <>
            {/* Sending Alert */}
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                  <AlertTriangle className="w-12 h-12" />
                </div>
              </div>
              <h2 className="text-white mb-2">Malicious Attack Detected!</h2>
              <p className="text-emerald-100">Sending threat data to developer...</p>
            </div>

            {/* Sending Process */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Send className="w-5 h-5 text-yellow-300 animate-pulse" />
                  <div className="flex-1">
                    <p className="text-white">Opening Authenticated WebSocket</p>
                    <div className="w-full bg-white/20 rounded-full h-2 mt-2 overflow-hidden">
                      <div className="bg-yellow-400 h-2 rounded-full animate-pulse" style={{ width: '70%' }}></div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4 space-y-2">
                  <p className="text-emerald-100">Sending to developer:</p>
                  <ul className="space-y-1 text-white">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-emerald-300 rounded-full"></div>
                      Live session stream
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-emerald-300 rounded-full"></div>
                      Suspicious packet data
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-emerald-300 rounded-full"></div>
                      Threat metadata
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-emerald-300 rounded-full"></div>
                      Attack signature
                    </li>
                  </ul>
                </div>

                <div className="bg-red-500/20 border border-red-400/30 rounded-lg p-3">
                  <p className="text-white mb-1">Attack Type</p>
                  <p className="text-red-200">Data Exfiltration Attempt</p>
                </div>
              </div>
            </div>

            {/* Privacy Notice */}
            <div className="bg-emerald-700/30 border border-emerald-400/30 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Wifi className="w-5 h-5 text-emerald-300 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white mb-1">Secure Transmission</p>
                  <p className="text-emerald-100">Data sent only to authorized developer endpoint for this app. Your VPN traffic remains private.</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Sent Confirmation */}
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
              </div>
              <h2 className="text-white mb-2">Alert Sent to Developer</h2>
              <p className="text-emerald-100">Connecting to live triage session...</p>
            </div>

            {/* Confirmation Details */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <span className="text-emerald-100">Data Sent</span>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                    <span className="text-white">Success</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <span className="text-emerald-100">Payload Size</span>
                  <span className="text-white">2.4 MB</span>
                </div>
                
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <span className="text-emerald-100">Transmission Time</span>
                  <span className="text-white">1.8s</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-emerald-100">Token INVITE</span>
                  <span className="text-white">Sent</span>
                </div>
              </div>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <div className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse"></div>
                <span className="text-emerald-100">Awaiting developer connection...</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
