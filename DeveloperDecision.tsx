import { useState, useEffect } from 'react';
import { CheckCircle2, AlertTriangle, Bell } from 'lucide-react';
import { Button } from './ui/button';

interface DeveloperDecisionProps {
  onContinue: (resolved: boolean) => void;
}

export function DeveloperDecision({ onContinue }: DeveloperDecisionProps) {
  const [decision, setDecision] = useState<'resolved' | 'forensics' | null>(null);
  
  useEffect(() => {
    // Simulate developer making a decision after some time
    const decisionTimer = setTimeout(() => {
      // Randomly decide (in real app, this would come from actual developer)
      const developerDecision = Math.random() > 0.5 ? 'resolved' : 'forensics';
      setDecision(developerDecision);
    }, 3000);

    return () => clearTimeout(decisionTimer);
  }, []);

  const handleContinue = () => {
    onContinue(decision === 'resolved');
  };

  return (
    <div className="min-h-screen bg-emerald-600 text-white p-6 pt-20 flex items-center justify-center">
      <div className="max-w-md mx-auto w-full">
        {decision === null ? (
          <>
            {/* Waiting for Developer Decision */}
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm animate-pulse">
                  <Bell className="w-12 h-12" />
                </div>
              </div>
              <h2 className="text-white mb-2">Developer Analyzing</h2>
              <p className="text-emerald-100">Awaiting triage decision...</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></div>
                  <span className="text-white">Developer reviewing threat data</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></div>
                  <span className="text-white">Analyzing packet signatures</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></div>
                  <span className="text-white">Checking threat database</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></div>
                  <span className="text-white">Making decision...</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Developer Decision Notification */}
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center ${
                  decision === 'resolved' ? 'bg-emerald-500' : 'bg-orange-500'
                }`}>
                  {decision === 'resolved' ? (
                    <CheckCircle2 className="w-12 h-12" />
                  ) : (
                    <AlertTriangle className="w-12 h-12" />
                  )}
                </div>
              </div>
              <h2 className="text-white mb-2">Developer Decision Received</h2>
              <p className="text-emerald-100">
                {decision === 'resolved' 
                  ? 'Threat has been resolved'
                  : 'Requires forensic analysis'}
              </p>
            </div>

            {decision === 'resolved' ? (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6">
                <div className="space-y-4">
                  <div className="bg-emerald-500/30 border border-emerald-400/30 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-300 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-white mb-2">Threat Resolved Live</p>
                        <p className="text-emerald-100">The developer has successfully mitigated the threat during live analysis. No further action required.</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center pb-2 border-b border-white/10">
                      <span className="text-emerald-100">Resolution Status</span>
                      <span className="text-emerald-300">Resolved</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-white/10">
                      <span className="text-emerald-100">Analysis Time</span>
                      <span className="text-white">00:03:45</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-emerald-100">Action Taken</span>
                      <span className="text-white">Live Mitigation</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6">
                <div className="space-y-4">
                  <div className="bg-orange-500/30 border border-orange-400/30 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-orange-300 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-white mb-2">Escalated to Forensics</p>
                        <p className="text-emerald-100">The developer has determined this threat requires deeper forensic analysis. Full packet capture will be uploaded.</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center pb-2 border-b border-white/10">
                      <span className="text-emerald-100">Resolution Status</span>
                      <span className="text-orange-300">Needs Forensics</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-white/10">
                      <span className="text-emerald-100">Analysis Time</span>
                      <span className="text-white">00:03:45</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-emerald-100">Next Step</span>
                      <span className="text-white">PCAP Upload</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <Button
              onClick={handleContinue}
              className="w-full bg-white text-emerald-600 hover:bg-emerald-50 h-12 rounded-xl"
            >
              Continue
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
