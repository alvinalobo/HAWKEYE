import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Settings as SettingsIcon,
  Shield,
  Bell,
  Database,
  Lock,
  Eye,
  Smartphone,
  LogOut,
  ChevronRight,
  Info
} from 'lucide-react';

interface SettingsProps {
  userId: string;
  sessionToken: string;
  onLogout: () => void;
}

export function Settings({ userId, sessionToken, onLogout }: SettingsProps) {
  const [settings, setSettings] = useState({
    captureHeaders: true,
    backgroundCapture: false,
    localVPN: true,
    threatNotifications: true,
    autoUploadPCAP: false,
    biometricLock: true
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="p-4 space-y-4 pb-20">
      {/* Header */}
      <div>
        <h1 className="text-2xl text-white mb-1">Settings</h1>
        <p className="text-sm text-gray-400">Configure your security preferences</p>
      </div>

      {/* User Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-[#0F1419] to-[#1A1F26] rounded-xl p-4 border border-[#00C2FF]/20"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00C2FF] to-[#00FF88] flex items-center justify-center">
            <Shield className="w-6 h-6 text-[#0A0F14]" />
          </div>
          <div className="flex-1">
            <h3 className="text-white">User ID</h3>
            <p className="text-xs text-gray-400 font-mono">{userId.substring(0, 20)}...</p>
          </div>
        </div>
      </motion.div>

      {/* Capture Settings */}
      <div className="space-y-3">
        <h2 className="text-white">Capture Settings</h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#0F1419] to-[#1A1F26] rounded-xl border border-[#00C2FF]/20 overflow-hidden"
        >
          <button
            onClick={() => toggleSetting('captureHeaders')}
            className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Database className="w-5 h-5 text-[#00C2FF]" />
              <div className="text-left">
                <div className="text-white text-sm">Capture Headers Only</div>
                <div className="text-xs text-gray-400">Reduce storage by capturing only packet headers</div>
              </div>
            </div>
            <div className={`w-12 h-6 rounded-full transition-colors ${
              settings.captureHeaders ? 'bg-[#00FF88]' : 'bg-gray-600'
            } relative`}>
              <motion.div
                className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full"
                animate={{ x: settings.captureHeaders ? 24 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </div>
          </button>

          <div className="border-t border-[#00C2FF]/10" />

          <button
            onClick={() => toggleSetting('backgroundCapture')}
            className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-[#00C2FF]" />
              <div className="text-left">
                <div className="text-white text-sm">Enable Background Capture</div>
                <div className="text-xs text-gray-400">Continue monitoring when app is minimized</div>
              </div>
            </div>
            <div className={`w-12 h-6 rounded-full transition-colors ${
              settings.backgroundCapture ? 'bg-[#00FF88]' : 'bg-gray-600'
            } relative`}>
              <motion.div
                className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full"
                animate={{ x: settings.backgroundCapture ? 24 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </div>
          </button>

          <div className="border-t border-[#00C2FF]/10" />

          <button
            onClick={() => toggleSetting('localVPN')}
            className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-[#00C2FF]" />
              <div className="text-left">
                <div className="text-white text-sm">Enable Local VPN Mode</div>
                <div className="text-xs text-gray-400">Use device VPN for packet capture</div>
              </div>
            </div>
            <div className={`w-12 h-6 rounded-full transition-colors ${
              settings.localVPN ? 'bg-[#00FF88]' : 'bg-gray-600'
            } relative`}>
              <motion.div
                className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full"
                animate={{ x: settings.localVPN ? 24 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </div>
          </button>
        </motion.div>
      </div>

      {/* Security Settings */}
      <div className="space-y-3">
        <h2 className="text-white">Security & Privacy</h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#0F1419] to-[#1A1F26] rounded-xl border border-[#00C2FF]/20 overflow-hidden"
        >
          <button
            onClick={() => toggleSetting('threatNotifications')}
            className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-[#00C2FF]" />
              <div className="text-left">
                <div className="text-white text-sm">Threat Notifications</div>
                <div className="text-xs text-gray-400">Get alerted when threats are detected</div>
              </div>
            </div>
            <div className={`w-12 h-6 rounded-full transition-colors ${
              settings.threatNotifications ? 'bg-[#00FF88]' : 'bg-gray-600'
            } relative`}>
              <motion.div
                className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full"
                animate={{ x: settings.threatNotifications ? 24 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </div>
          </button>

          <div className="border-t border-[#00C2FF]/10" />

          <button
            onClick={() => toggleSetting('autoUploadPCAP')}
            className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Database className="w-5 h-5 text-[#00C2FF]" />
              <div className="text-left">
                <div className="text-white text-sm">Auto-Upload PCAP to Forensics</div>
                <div className="text-xs text-gray-400">Automatically upload threat data</div>
              </div>
            </div>
            <div className={`w-12 h-6 rounded-full transition-colors ${
              settings.autoUploadPCAP ? 'bg-[#00FF88]' : 'bg-gray-600'
            } relative`}>
              <motion.div
                className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full"
                animate={{ x: settings.autoUploadPCAP ? 24 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </div>
          </button>

          <div className="border-t border-[#00C2FF]/10" />

          <button
            onClick={() => toggleSetting('biometricLock')}
            className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-[#00C2FF]" />
              <div className="text-left">
                <div className="text-white text-sm">Biometric Lock</div>
                <div className="text-xs text-gray-400">Require biometric auth for sensitive actions</div>
              </div>
            </div>
            <div className={`w-12 h-6 rounded-full transition-colors ${
              settings.biometricLock ? 'bg-[#00FF88]' : 'bg-gray-600'
            } relative`}>
              <motion.div
                className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full"
                animate={{ x: settings.biometricLock ? 24 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </div>
          </button>
        </motion.div>
      </div>

      {/* Privacy Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-[#00C2FF]/10 to-[#00FF88]/10 border border-[#00C2FF]/20 rounded-xl p-4"
      >
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-[#00C2FF] flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-white text-sm mb-1">Data Privacy</h4>
            <p className="text-xs text-gray-400">
              All captured packets are stored locally unless you authorize external sharing. 
              Data is encrypted with AES-256 and all modifications are logged with SHA-256 hashes.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Logout Button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onLogout}
        className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-4 rounded-xl flex items-center justify-center gap-2"
      >
        <LogOut className="w-5 h-5" />
        <span>Logout</span>
      </motion.button>
    </div>
  );
}
