import { useEffect, useState } from 'react';
import { Shield, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/button';

interface PermissionScreenProps {
  onGranted: () => void;
}

export function PermissionScreen({ onGranted }: PermissionScreenProps) {
  const [step, setStep] = useState<'requesting' | 'granting'>('requesting');

  const handleGrant = () => {
    setStep('granting');
    setTimeout(() => {
      onGranted();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-emerald-600 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-emerald-700 rounded-full flex items-center justify-center shadow-lg">
            <Shield className="w-14 h-14 text-emerald-100" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center space-y-2">
          <h2 className="text-white text-3xl">VPN Permission Required</h2>
          <p className="text-emerald-100">
            NetGuard needs VPN service access to capture and analyze network packets
          </p>
        </div>

        {/* Permission Details */}
        <div className="bg-emerald-700/50 rounded-2xl p-6 space-y-3">
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${step === 'granting' ? 'bg-emerald-300' : 'bg-emerald-400'}`} />
            <span className="text-emerald-50">VpnService permission</span>
          </div>
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${step === 'granting' ? 'bg-emerald-300' : 'bg-emerald-400'}`} />
            <span className="text-emerald-50">Foreground service</span>
          </div>
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${step === 'granting' ? 'bg-emerald-300' : 'bg-emerald-400'}`} />
            <span className="text-emerald-50">Network monitoring</span>
          </div>
        </div>

        {step === 'requesting' ? (
          <Button 
            onClick={handleGrant}
            className="w-full bg-emerald-900 hover:bg-emerald-950 text-white h-14 text-lg rounded-xl shadow-lg"
          >
            Grant Permissions
          </Button>
        ) : (
          <div className="flex items-center justify-center gap-2 text-emerald-100 h-14">
            <CheckCircle2 className="w-6 h-6 animate-pulse" />
            <span className="text-lg">Permissions Granted</span>
          </div>
        )}

        <div className="bg-emerald-800/40 rounded-xl p-4">
          <p className="text-emerald-100 text-sm">
            <span className="text-emerald-50">Note:</span> All packet analysis is done on-device. 
            Data is only uploaded when threats are detected and not resolved.
          </p>
        </div>
      </div>
    </div>
  );
}
