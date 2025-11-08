import { useState, useEffect } from 'react';
import { Shield, CheckCircle2, Lock } from 'lucide-react';
import { Button } from './ui/button';

interface PermissionRequestProps {
  onGranted: () => void;
}

export function PermissionRequest({ onGranted }: PermissionRequestProps) {
  const [step, setStep] = useState<'request' | 'granted'>('request');

  useEffect(() => {
    if (step === 'granted') {
      const timer = setTimeout(() => {
        onGranted();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [step, onGranted]);

  return (
    <div className="min-h-screen bg-emerald-600 text-white p-6 pt-20 flex items-center justify-center">
      <div className="max-w-md mx-auto w-full">
        {step === 'request' ? (
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Shield className="w-10 h-10" />
              </div>
            </div>
            <h2 className="text-white text-center mb-4">VPN Permission Required</h2>
            <p className="text-emerald-100 text-center mb-6">
              Network Guardian needs VPN service permission to monitor network traffic and protect your device.
            </p>
            
            {/* Privacy Assurance */}
            <div className="bg-emerald-700/30 border border-emerald-400/30 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <Lock className="w-5 h-5 text-emerald-300 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white mb-1">100% Private VPN</p>
                  <p className="text-emerald-100">All traffic analysis happens locally on your device. Data is only shared with this app and nowhere else.</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3 bg-white/5 rounded-lg p-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-300 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white">Monitor Network Traffic</p>
                  <p className="text-emerald-200">Analyze packets for threats</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-white/5 rounded-lg p-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-300 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white">Real-time Detection</p>
                  <p className="text-emerald-200">Identify suspicious activity</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-white/5 rounded-lg p-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-300 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white">Forensic Analysis</p>
                  <p className="text-emerald-200">Capture data for investigation</p>
                </div>
              </div>
            </div>

            <Button
              onClick={() => setStep('granted')}
              className="w-full bg-white text-emerald-600 hover:bg-emerald-50 h-12 rounded-xl"
            >
              Grant Permission
            </Button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-emerald-400 rounded-full flex items-center justify-center animate-pulse">
                <CheckCircle2 className="w-10 h-10" />
              </div>
            </div>
            <h2 className="text-white mb-2">Permission Granted</h2>
            <p className="text-emerald-100">Starting foreground service...</p>
          </div>
        )}
      </div>
    </div>
  );
}