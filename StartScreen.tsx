import { Shield, Activity, Lock } from 'lucide-react';
import { Button } from './ui/button';

interface StartScreenProps {
  onStart: () => void;
}

export function StartScreen({ onStart }: StartScreenProps) {
  return (
    <div className="min-h-screen bg-emerald-600 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        {/* App Icon */}
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-emerald-800 rounded-3xl flex items-center justify-center shadow-2xl">
            <Shield className="w-14 h-14 text-emerald-100" />
          </div>
        </div>

        {/* App Title */}
        <div className="text-center space-y-2">
          <h1 className="text-white text-4xl">NetGuard VPN</h1>
          <p className="text-emerald-100">Advanced Threat Detection & Packet Analysis</p>
        </div>

        {/* Features */}
        <div className="bg-emerald-700/50 rounded-2xl p-6 space-y-4">
          <div className="flex items-start gap-3">
            <Activity className="w-6 h-6 text-emerald-200 mt-0.5" />
            <div>
              <h3 className="text-emerald-50">Real-time Packet Capture</h3>
              <p className="text-emerald-200 text-sm">Monitor all network traffic in real-time</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Shield className="w-6 h-6 text-emerald-200 mt-0.5" />
            <div>
              <h3 className="text-emerald-50">On-Device IDS</h3>
              <p className="text-emerald-200 text-sm">Detect threats locally with advanced rules</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Lock className="w-6 h-6 text-emerald-200 mt-0.5" />
            <div>
              <h3 className="text-emerald-50">Secure Analysis</h3>
              <p className="text-emerald-200 text-sm">Encrypted forensic data upload</p>
            </div>
          </div>
        </div>

        {/* Start Button */}
        <Button 
          onClick={onStart}
          className="w-full bg-emerald-900 hover:bg-emerald-950 text-white h-14 text-lg rounded-xl shadow-lg"
        >
          START CAPTURE
        </Button>

        <p className="text-emerald-200 text-xs text-center">
          By starting, you agree to VPN service permissions
        </p>
      </div>
    </div>
  );
}
