import { AlertTriangle, Shield, Lock, FileText, Eye } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';

interface InterceptionConsentProps {
  onAccept: () => void;
  onDecline: () => void;
}

export function InterceptionConsent({ onAccept, onDecline }: InterceptionConsentProps) {
  const [acknowledgedWarnings, setAcknowledgedWarnings] = useState({
    testing: false,
    legal: false,
    logging: false,
    responsibility: false
  });

  const allAcknowledged = Object.values(acknowledgedWarnings).every(v => v);

  return (
    <div className="min-h-screen bg-emerald-600 text-white p-6 pt-16">
      <div className="max-w-md mx-auto">
        {/* Warning Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center animate-pulse">
              <AlertTriangle className="w-12 h-12 text-white" />
            </div>
          </div>
          <h2 className="text-white mb-2">⚠️ AUTHORIZED TESTING ONLY</h2>
          <p className="text-yellow-100">Request Interception Mode</p>
        </div>

        {/* Critical Warning Banner */}
        <div className="bg-red-500/80 backdrop-blur-sm rounded-xl p-5 mb-6 border-2 border-red-300">
          <div className="flex items-start gap-3 mb-3">
            <Shield className="w-6 h-6 text-white flex-shrink-0 mt-1" />
            <div>
              <p className="text-white mb-2">
                <strong>LEGAL WARNING:</strong> This feature allows you to intercept and modify live network traffic.
              </p>
              <p className="text-red-100">
                Unauthorized interception of communications may violate laws including the Computer Fraud and Abuse Act, Electronic Communications Privacy Act, and similar regulations in your jurisdiction.
              </p>
            </div>
          </div>
        </div>

        {/* Required Acknowledgments */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 mb-6">
          <p className="text-white mb-4">You must acknowledge:</p>
          
          <div className="space-y-4">
            {/* Testing Purpose */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={acknowledgedWarnings.testing}
                onChange={(e) => setAcknowledgedWarnings(prev => ({ ...prev, testing: e.target.checked }))}
                className="mt-1 w-5 h-5 rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500 focus:ring-offset-0 bg-white/20 cursor-pointer"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Eye className="w-4 h-4 text-emerald-200" />
                  <span className="text-white">Testing & Development Only</span>
                </div>
                <p className="text-emerald-100">
                  I will only use this feature for authorized security testing, development, or debugging of my own applications.
                </p>
              </div>
            </label>

            {/* Legal Compliance */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={acknowledgedWarnings.legal}
                onChange={(e) => setAcknowledgedWarnings(prev => ({ ...prev, legal: e.target.checked }))}
                className="mt-1 w-5 h-5 rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500 focus:ring-offset-0 bg-white/20 cursor-pointer"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Shield className="w-4 h-4 text-emerald-200" />
                  <span className="text-white">Legal Authorization</span>
                </div>
                <p className="text-emerald-100">
                  I have proper authorization to intercept and modify traffic on this network and devices.
                </p>
              </div>
            </label>

            {/* Logging */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={acknowledgedWarnings.logging}
                onChange={(e) => setAcknowledgedWarnings(prev => ({ ...prev, logging: e.target.checked }))}
                className="mt-1 w-5 h-5 rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500 focus:ring-offset-0 bg-white/20 cursor-pointer"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="w-4 h-4 text-emerald-200" />
                  <span className="text-white">Activity Logging</span>
                </div>
                <p className="text-emerald-100">
                  I understand all interceptions and modifications will be logged locally for accountability and audit purposes.
                </p>
              </div>
            </label>

            {/* Responsibility */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={acknowledgedWarnings.responsibility}
                onChange={(e) => setAcknowledgedWarnings(prev => ({ ...prev, responsibility: e.target.checked }))}
                className="mt-1 w-5 h-5 rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500 focus:ring-offset-0 bg-white/20 cursor-pointer"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Lock className="w-4 h-4 text-emerald-200" />
                  <span className="text-white">Personal Responsibility</span>
                </div>
                <p className="text-emerald-100">
                  I accept full responsibility for any consequences resulting from using this interception feature.
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Safety Features Info */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 mb-6">
          <p className="text-white mb-3">Safety Features Enabled:</p>
          <div className="space-y-2 text-emerald-100">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-emerald-300 rounded-full"></div>
              <span>All modifications timestamped and logged</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-emerald-300 rounded-full"></div>
              <span>Original request/response preserved</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-emerald-300 rounded-full"></div>
              <span>SHA-256 checksums for data integrity</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-emerald-300 rounded-full"></div>
              <span>Explicit consent required per session</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-emerald-300 rounded-full"></div>
              <span>Audit trail exportable for review</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={onAccept}
            disabled={!allAcknowledged}
            className={`w-full h-14 rounded-xl ${
              allAcknowledged 
                ? 'bg-white text-emerald-600 hover:bg-emerald-50' 
                : 'bg-white/20 text-white/50 cursor-not-allowed'
            }`}
            size="lg"
          >
            {allAcknowledged ? 'I ACCEPT - ENABLE INTERCEPTION' : 'ACKNOWLEDGE ALL WARNINGS TO CONTINUE'}
          </Button>
          
          <Button
            onClick={onDecline}
            variant="outline"
            className="w-full h-12 rounded-xl bg-white/10 text-white border-white/20 hover:bg-white/20"
          >
            Decline - Return to Dashboard
          </Button>
        </div>

        {/* Timestamp */}
        <div className="mt-6 text-center">
          <p className="text-emerald-200">
            Session: {new Date().toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
