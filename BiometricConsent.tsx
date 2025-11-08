import { useState } from 'react';
import { Fingerprint, Shield, Lock, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';

interface BiometricConsentProps {
  onAuthenticated: () => void;
  onCancel: () => void;
}

export function BiometricConsent({ onAuthenticated, onCancel }: BiometricConsentProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleBiometricScan = () => {
    setIsScanning(true);
    
    // Simulate biometric authentication
    setTimeout(() => {
      setIsScanning(false);
      setIsAuthenticated(true);
      
      setTimeout(() => {
        onAuthenticated();
      }, 1000);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#0A0F14] text-white p-6 pt-16">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6 relative">
            {!isAuthenticated ? (
              <div className={`w-32 h-32 rounded-full flex items-center justify-center relative ${
                isScanning 
                  ? 'bg-gradient-to-br from-[#00C2FF] to-[#00FF88] animate-pulse' 
                  : 'bg-[#0F1419] border-2 border-[#1a2028]'
              }`}>
                {isScanning && (
                  <>
                    <div className="absolute inset-0 rounded-full border-4 border-[#00C2FF] animate-ping"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-[#00FF88] animate-ping" style={{ animationDelay: '0.3s' }}></div>
                  </>
                )}
                <Fingerprint className={`w-16 h-16 ${isScanning ? 'text-[#0A0F14]' : 'text-[#00C2FF]'}`} />
              </div>
            ) : (
              <div className="w-32 h-32 bg-gradient-to-br from-[#00FF88] to-[#00C2FF] rounded-full flex items-center justify-center shadow-lg shadow-[#00FF88]/50">
                <CheckCircle2 className="w-16 h-16 text-[#0A0F14]" />
              </div>
            )}
          </div>

          {!isAuthenticated ? (
            <>
              <h2 className="text-white mb-2">Biometric Authentication</h2>
              <p className="text-[#00C2FF]">
                {isScanning ? 'Scanning fingerprint...' : 'Verify your identity to continue'}
              </p>
            </>
          ) : (
            <>
              <h2 className="text-[#00FF88] mb-2">Authentication Successful</h2>
              <p className="text-gray-400">Identity verified</p>
            </>
          )}
        </div>

        {!isAuthenticated && (
          <>
            {/* Security Notice */}
            <div className="bg-gradient-to-r from-[#00C2FF]/10 to-[#00FF88]/10 rounded-xl p-5 mb-6 border border-[#00C2FF]/30">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-[#00C2FF] flex-shrink-0 mt-1" />
                <div>
                  <p className="text-white mb-2">Security Requirements</p>
                  <p className="text-gray-400">
                    HAWKEYE requires biometric authentication before enabling network capture and VPN features to ensure authorized use only.
                  </p>
                </div>
              </div>
            </div>

            {/* Consent Requirements */}
            <div className="bg-[#0F1419] rounded-xl p-5 mb-6 border border-[#1a2028] shadow-xl">
              <h3 className="text-white mb-4">By proceeding, you confirm:</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#00FF88] flex-shrink-0 mt-0.5" />
                  <p className="text-gray-400">
                    You are the authorized owner or administrator of this device and network
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#00FF88] flex-shrink-0 mt-0.5" />
                  <p className="text-gray-400">
                    You will use HAWKEYE for legitimate security monitoring and analysis only
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#00FF88] flex-shrink-0 mt-0.5" />
                  <p className="text-gray-400">
                    All captured data will be encrypted and stored securely (AES-256)
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#00FF88] flex-shrink-0 mt-0.5" />
                  <p className="text-gray-400">
                    Actions will be logged with SHA-256 hashing for accountability
                  </p>
                </div>
              </div>
            </div>

            {/* Warning Banner */}
            <div className="bg-[#FFB800]/10 rounded-xl p-4 mb-6 border border-[#FFB800]/30">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-[#FFB800] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white mb-1">Legal Notice</p>
                  <p className="text-[#FFB800]">
                    Unauthorized network monitoring may violate laws. Ensure you have proper authorization before proceeding.
                  </p>
                </div>
              </div>
            </div>

            {/* Security Features */}
            <div className="bg-[#0F1419] rounded-xl p-5 mb-6 border border-[#1a2028] shadow-xl">
              <h3 className="text-white mb-4 flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#00C2FF]" />
                Security Features Enabled
              </h3>
              <div className="space-y-2 text-gray-400">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[#00FF88] rounded-full"></div>
                  <span>AES-256 encrypted PCAP storage</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[#00FF88] rounded-full"></div>
                  <span>SHA-256 hashed activity logs</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[#00FF88] rounded-full"></div>
                  <span>Biometric-only access control</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[#00FF88] rounded-full"></div>
                  <span>HTTPS-only data transmission</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[#00FF88] rounded-full"></div>
                  <span>Role-based access management</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleBiometricScan}
                disabled={isScanning}
                className={`w-full h-14 rounded-xl transition-all shadow-lg ${
                  isScanning
                    ? 'bg-gradient-to-r from-[#00C2FF] to-[#00FF88] text-[#0A0F14] cursor-wait'
                    : 'bg-gradient-to-r from-[#00C2FF] to-[#00FF88] hover:from-[#00C2FF]/90 hover:to-[#00FF88]/90 text-[#0A0F14] shadow-[#00C2FF]/30'
                }`}
                size="lg"
              >
                {isScanning ? (
                  <>
                    <div className="w-5 h-5 border-2 border-[#0A0F14] border-t-transparent rounded-full animate-spin mr-2"></div>
                    SCANNING...
                  </>
                ) : (
                  <>
                    <Fingerprint className="w-5 h-5 mr-2" />
                    AUTHENTICATE WITH BIOMETRIC
                  </>
                )}
              </Button>

              <Button
                onClick={onCancel}
                disabled={isScanning}
                variant="outline"
                className="w-full h-12 rounded-xl bg-[#0F1419] text-white border-[#1a2028] hover:bg-[#1a2028] disabled:opacity-50"
              >
                Cancel
              </Button>
            </div>

            {/* Footer Note */}
            <div className="mt-6 text-center">
              <p className="text-gray-500">
                Session will be logged: {new Date().toLocaleString()}
              </p>
            </div>
          </>
        )}

        {isAuthenticated && (
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-[#00FF88]/10 rounded-full px-6 py-3 border border-[#00FF88]/30">
              <CheckCircle2 className="w-5 h-5 text-[#00FF88]" />
              <span className="text-[#00FF88]">Redirecting to HAWKEYE...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
