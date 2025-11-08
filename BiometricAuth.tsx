import React, { useState, useEffect } from 'react';
import { Fingerprint, Shield, Eye, Check } from 'lucide-react';
import { motion } from 'motion/react';

interface BiometricAuthProps {
  onAuthSuccess: (token: string, userId: string) => void;
}

export function BiometricAuth({ onAuthSuccess }: BiometricAuthProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [authStep, setAuthStep] = useState<'initial' | 'scanning' | 'verified' | 'success'>('initial');

  // Reset state when component mounts (to allow re-authentication)
  useEffect(() => {
    setIsScanning(false);
    setAuthStep('initial');
  }, []);

  const handleBiometricScan = () => {
    setIsScanning(true);
    setAuthStep('scanning');

    // Simulate biometric scanning animation (2 seconds)
    setTimeout(() => {
      setAuthStep('verified');
      setIsScanning(false);
      
      // Show verified status for 1 second, then proceed to login
      setTimeout(() => {
        setAuthStep('success');
        
        // Generate demo credentials and login
        const demoToken = 'demo_token_' + Date.now();
        const demoUserId = 'demo_user_' + Math.random().toString(36).substring(7);
        
        setTimeout(() => {
          onAuthSuccess(demoToken, demoUserId);
        }, 500);
      }, 1000);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#0A0F14] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(#00C2FF 1px, transparent 1px), linear-gradient(90deg, #00C2FF 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Glow effect */}
      <motion.div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#00C2FF] rounded-full blur-[120px] opacity-20"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo and Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-16 h-16 text-[#00C2FF]" strokeWidth={1.5} />
          </div>
          <h1 className="text-4xl mb-2 text-[#00C2FF] tracking-wider">HAWKEYE</h1>
          <p className="text-gray-400">Network Security Monitor</p>
        </motion.div>

        {/* Biometric Scanner Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-[#0F1419] to-[#1A1F26] rounded-2xl p-8 border border-[#00C2FF]/20 shadow-xl"
        >
          <div className="text-center mb-8">
            <h2 className="text-xl mb-2 text-white">Biometric Authentication</h2>
            <p className="text-sm text-gray-400">
              {authStep === 'initial' && 'Tap the scanner to authenticate'}
              {authStep === 'scanning' && 'Scanning biometric data...'}
              {authStep === 'verified' && (
                <span className="text-[#00FF88] flex items-center justify-center gap-2">
                  <Check className="w-4 h-4" />
                  Identity Verified!
                </span>
              )}
              {authStep === 'success' && 'Authentication successful!'}
            </p>
          </div>

          {/* Biometric Scanner */}
          <div className="flex justify-center mb-8">
            <motion.button
              onClick={handleBiometricScan}
              disabled={isScanning || authStep === 'verified' || authStep === 'success'}
              className="relative w-32 h-32 rounded-full bg-gradient-to-br from-[#00C2FF]/20 to-[#00FF88]/20 border-2 border-[#00C2FF] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Pulse animation when scanning */}
              {isScanning && (
                <>
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-[#00C2FF]"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 0, 0.5],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeOut"
                    }}
                  />
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-[#00FF88]"
                    animate={{
                      scale: [1, 1.8, 1],
                      opacity: [0.5, 0, 0.5],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeOut",
                      delay: 0.3
                    }}
                  />
                </>
              )}

              {/* Icon */}
              <motion.div
                animate={
                  authStep === 'verified' || authStep === 'success'
                    ? { scale: [1, 1.2, 1], rotate: [0, 360] }
                    : isScanning
                    ? { rotate: 360 }
                    : {}
                }
                transition={
                  authStep === 'verified' || authStep === 'success'
                    ? { duration: 0.6 }
                    : isScanning
                    ? { duration: 2, repeat: Infinity, ease: "linear" }
                    : {}
                }
              >
                {authStep === 'verified' || authStep === 'success' ? (
                  <Check className="w-12 h-12 text-[#00FF88]" strokeWidth={3} />
                ) : (
                  <Fingerprint className="w-12 h-12 text-[#00C2FF]" />
                )}
              </motion.div>

              {/* Scanning line effect */}
              {isScanning && (
                <motion.div
                  className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#00FF88] to-transparent"
                  animate={{
                    top: ['10%', '90%', '10%'],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
              )}
            </motion.button>
          </div>

          {/* Security features */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <div className={`w-2 h-2 rounded-full transition-all ${
                authStep === 'verified' || authStep === 'success' 
                  ? 'bg-[#00FF88] shadow-[0_0_8px_#00FF88]' 
                  : 'bg-gray-600'
              }`} />
              <span className="text-gray-300">AES-256 Encryption Active</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className={`w-2 h-2 rounded-full transition-all ${
                authStep === 'verified' || authStep === 'success' 
                  ? 'bg-[#00FF88] shadow-[0_0_8px_#00FF88]' 
                  : 'bg-gray-600'
              }`} />
              <span className="text-gray-300">Zero-Knowledge Architecture</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className={`w-2 h-2 rounded-full transition-all ${
                authStep === 'verified' || authStep === 'success' 
                  ? 'bg-[#00FF88] shadow-[0_0_8px_#00FF88]' 
                  : 'bg-gray-600'
              }`} />
              <span className="text-gray-300">Local Data Processing</span>
            </div>
          </div>
        </motion.div>

        {/* Privacy notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 text-center space-y-2"
        >
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
            <Eye className="w-4 h-4" />
            <span>Your privacy is protected. All data stays on device.</span>
          </div>
          <div className="text-xs text-gray-600">
            Demo mode - Tap to authenticate instantly
          </div>
        </motion.div>
      </div>
    </div>
  );
}
