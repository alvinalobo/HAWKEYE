import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Wifi, Lock, ChevronRight, AlertCircle } from 'lucide-react';

interface VPNSelectionProps {
  onSelect: (mode: 'android' | 'wireguard') => void;
  onBack: () => void;
}

export function VPNSelection({ onSelect, onBack }: VPNSelectionProps) {
  const [showConsent, setShowConsent] = useState(false);
  const [selectedMode, setSelectedMode] = useState<'android' | 'wireguard' | null>(null);

  const handleModeSelect = (mode: 'android' | 'wireguard') => {
    setSelectedMode(mode);
    setShowConsent(true);
  };

  const handleConfirm = () => {
    if (selectedMode) {
      onSelect(selectedMode);
    }
  };

  if (showConsent && selectedMode) {
    return (
      <div className="min-h-screen bg-[#0A0F14] p-4 flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-[#0F1419] to-[#1A1F26] rounded-2xl p-6 border border-[#00C2FF]/20"
        >
          <div className="text-center mb-6">
            <Shield className="w-16 h-16 text-[#00C2FF] mx-auto mb-4" />
            <h2 className="text-xl text-white mb-2">Consent Required</h2>
            <p className="text-sm text-gray-400">
              Please review and accept the following terms
            </p>
          </div>

          <div className="bg-[#1A1F26] rounded-xl p-4 mb-6 space-y-3">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[#FFB800] flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-white text-sm mb-1">Authorized Testing Only</h3>
                <p className="text-xs text-gray-400">
                  Use this tool only on networks you own or have explicit permission to monitor
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Lock className="w-5 h-5 text-[#00FF88] flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-white text-sm mb-1">Data Privacy</h3>
                <p className="text-xs text-gray-400">
                  All captured data stays local on your device unless you explicitly share it
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-[#00C2FF] flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-white text-sm mb-1">Encryption Enabled</h3>
                <p className="text-xs text-gray-400">
                  All logs are encrypted with AES-256 and hashed with SHA-256
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleConfirm}
              className="w-full bg-gradient-to-r from-[#00C2FF] to-[#00FF88] text-[#0A0F14] py-4 rounded-xl flex items-center justify-center gap-2"
            >
              <span>I Accept - Start Monitoring</span>
            </motion.button>

            <button
              onClick={() => {
                setShowConsent(false);
                setSelectedMode(null);
              }}
              className="w-full bg-[#1A1F26] border border-[#00C2FF]/20 text-gray-300 py-3 rounded-xl"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 pb-20">
      <div>
        <button
          onClick={onBack}
          className="text-[#00C2FF] text-sm mb-4 flex items-center gap-1"
        >
          ← Back
        </button>
        <h1 className="text-2xl text-white mb-1">Connection Setup</h1>
        <p className="text-sm text-gray-400">Choose your VPN monitoring mode</p>
      </div>

      {/* Android VPN */}
      <motion.div
        whileTap={{ scale: 0.98 }}
        onClick={() => handleModeSelect('android')}
        className="bg-gradient-to-br from-[#0F1419] to-[#1A1F26] rounded-2xl p-6 border border-[#00C2FF]/20 cursor-pointer hover:border-[#00C2FF]/40 transition-all"
      >
        <div className="flex items-start gap-4">
          <div className="p-3 bg-[#00C2FF]/20 rounded-xl">
            <Wifi className="w-8 h-8 text-[#00C2FF]" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl text-white mb-2">Normal User</h3>
            <p className="text-sm text-gray-400 mb-4">
              Uses Android VpnService for lightweight monitoring
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-gray-300">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00FF88]" />
                <span>Personal use and basic monitoring</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-300">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00FF88]" />
                <span>Lower battery consumption</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-300">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00FF88]" />
                <span>Standard packet inspection</span>
              </div>
            </div>
          </div>
          <ChevronRight className="w-6 h-6 text-gray-400 flex-shrink-0" />
        </div>
      </motion.div>

      {/* WireGuard VPN */}
      <motion.div
        whileTap={{ scale: 0.98 }}
        onClick={() => handleModeSelect('wireguard')}
        className="bg-gradient-to-br from-[#0F1419] to-[#1A1F26] rounded-2xl p-6 border border-[#00FF88]/20 cursor-pointer hover:border-[#00FF88]/40 transition-all"
      >
        <div className="flex items-start gap-4">
          <div className="p-3 bg-[#00FF88]/20 rounded-xl">
            <Shield className="w-8 h-8 text-[#00FF88]" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl text-white mb-2">Enterprise User</h3>
            <p className="text-sm text-gray-400 mb-4">
              Uses WireGuard for deep packet inspection and analysis
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-gray-300">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00FF88]" />
                <span>Organization and advanced analysis</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-300">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00FF88]" />
                <span>Full network visibility</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-300">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00FF88]" />
                <span>Advanced threat detection</span>
              </div>
            </div>
          </div>
          <ChevronRight className="w-6 h-6 text-gray-400 flex-shrink-0" />
        </div>
      </motion.div>

      {/* Security Notice */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gradient-to-r from-[#00C2FF]/10 to-[#00FF88]/10 border border-[#00C2FF]/20 rounded-xl p-4"
      >
        <div className="flex items-start gap-3">
          <Lock className="w-5 h-5 text-[#00C2FF] flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-white text-sm mb-1">Secure & Private</h4>
            <p className="text-xs text-gray-400">
              All traffic analysis happens locally on your device. No data is sent to external servers without your explicit consent.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
