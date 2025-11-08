import { AlertTriangle, Wifi, Globe, Lock } from 'lucide-react';
import { Button } from './ui/button';

interface ThreatDetectedProps {
  onOpenTriage: () => void;
}

export function ThreatDetected({ onOpenTriage }: ThreatDetectedProps) {
  return (
    <div className="min-h-screen bg-emerald-600 text-white p-6 pt-20 flex items-center justify-center">
      <div className="max-w-md mx-auto w-full">
        {/* Alert Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center animate-pulse">
              <AlertTriangle className="w-12 h-12" />
            </div>
          </div>
          <h2 className="text-white mb-2">Threat Detected</h2>
          <p className="text-emerald-100">Suspicious network activity identified</p>
        </div>

        {/* Threat Details */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6">
          <div className="space-y-4">
            <div>
              <p className="text-emerald-100 mb-1">Threat Type</p>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-yellow-300" />
                <p className="text-white">Potential Data Exfiltration</p>
              </div>
            </div>
            
            <div>
              <p className="text-emerald-100 mb-1">Source IP</p>
              <p className="text-white font-mono">192.168.1.143</p>
            </div>
            
            <div>
              <p className="text-emerald-100 mb-1">Destination</p>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-yellow-300" />
                <p className="text-white font-mono">45.142.212.61:8443</p>
              </div>
            </div>
            
            <div>
              <p className="text-emerald-100 mb-1">Protocol</p>
              <p className="text-white">HTTPS (Suspicious Certificate)</p>
            </div>
            
            <div>
              <p className="text-emerald-100 mb-1">Session Size</p>
              <p className="text-white">2.4 MB in 47 packets</p>
            </div>

            <div>
              <p className="text-emerald-100 mb-1">Risk Level</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-white/20 rounded-full h-2">
                  <div className="bg-yellow-400 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
                <span className="text-yellow-300">High</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={onOpenTriage}
            className="w-full bg-yellow-500 text-white hover:bg-yellow-600 h-12 rounded-xl"
          >
            Alert Developer & Start Triage
          </Button>
          
          <p className="text-emerald-100 text-center">
            Will send malicious attack data to developer
          </p>
        </div>

        {/* Live Stream Status */}
        <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <div className="flex items-center gap-3">
            <Wifi className="w-5 h-5 text-emerald-300 animate-pulse" />
            <div>
              <p className="text-white">Live Stream Ready</p>
              <p className="text-emerald-100">Prepared to stream session data</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}