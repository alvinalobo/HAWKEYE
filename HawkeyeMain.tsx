import React, { useState } from 'react';
import { Dashboard } from './Dashboard';
import { LiveAnalysis } from './LiveAnalysis';
import { AppsMonitor } from './AppsMonitor';
import { DeveloperStream } from './DeveloperStream';
import { VPNSelection } from './VPNSelection';
import { InterceptionMode } from './InterceptionMode';
import { ModificationLog } from './ModificationLog';
import { Settings } from './Settings';
import { 
  Home, 
  Activity, 
  Smartphone, 
  Video, 
  Shield, 
  FileEdit, 
  ScrollText,
  SettingsIcon,
  LogOut
} from 'lucide-react';
import { motion } from 'motion/react';

interface HawkeyeMainProps {
  userId: string;
  sessionToken: string;
  onLogout: () => void;
}

type Screen = 'dashboard' | 'analysis' | 'apps' | 'stream' | 'vpn' | 'intercept' | 'logs' | 'settings';

export function HawkeyeMain({ userId, sessionToken, onLogout }: HawkeyeMainProps) {
  const [activeScreen, setActiveScreen] = useState<Screen>('dashboard');
  const [isCapturing, setIsCapturing] = useState(false);
  const [vpnMode, setVpnMode] = useState<'android' | 'wireguard' | null>(null);

  const handleStartCapture = () => {
    if (!vpnMode) {
      setActiveScreen('vpn');
    } else {
      setIsCapturing(true);
    }
  };

  const handleStopCapture = () => {
    setIsCapturing(false);
  };

  const handleVPNSelect = (mode: 'android' | 'wireguard') => {
    setVpnMode(mode);
    setIsCapturing(true);
    setActiveScreen('dashboard');
  };

  const renderScreen = () => {
    switch (activeScreen) {
      case 'dashboard':
        return (
          <Dashboard 
            isCapturing={isCapturing}
            onStartCapture={handleStartCapture}
            onStopCapture={handleStopCapture}
            userId={userId}
            sessionToken={sessionToken}
            vpnMode={vpnMode}
          />
        );
      case 'analysis':
        return (
          <LiveAnalysis 
            isCapturing={isCapturing}
            userId={userId}
            sessionToken={sessionToken}
          />
        );
      case 'apps':
        return (
          <AppsMonitor 
            isCapturing={isCapturing}
            userId={userId}
            sessionToken={sessionToken}
          />
        );
      case 'stream':
        return (
          <DeveloperStream 
            userId={userId}
            sessionToken={sessionToken}
          />
        );
      case 'vpn':
        return (
          <VPNSelection 
            onSelect={handleVPNSelect}
            onBack={() => setActiveScreen('dashboard')}
          />
        );
      case 'intercept':
        return (
          <InterceptionMode 
            isCapturing={isCapturing}
            userId={userId}
            sessionToken={sessionToken}
          />
        );
      case 'logs':
        return (
          <ModificationLog 
            userId={userId}
            sessionToken={sessionToken}
          />
        );
      case 'settings':
        return (
          <Settings 
            userId={userId}
            sessionToken={sessionToken}
            onLogout={onLogout}
          />
        );
      default:
        return null;
    }
  };

  const navItems = [
    { id: 'dashboard' as Screen, icon: Home, label: 'Home' },
    { id: 'analysis' as Screen, icon: Activity, label: 'Analysis' },
    { id: 'apps' as Screen, icon: Smartphone, label: 'Apps' },
    { id: 'stream' as Screen, icon: Video, label: 'Stream' },
    { id: 'intercept' as Screen, icon: FileEdit, label: 'Intercept' },
  ];

  return (
    <div className="min-h-screen bg-[#0A0F14] flex flex-col">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-[#0F1419] to-[#1A1F26] border-b border-[#00C2FF]/20 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-[#00C2FF]" />
          <span className="text-[#00C2FF] tracking-wider">HAWKEYE</span>
        </div>
        <div className="flex items-center gap-2">
          {isCapturing && (
            <motion.div
              className="flex items-center gap-2 px-3 py-1 bg-[#00FF88]/10 border border-[#00FF88]/30 rounded-full"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="w-2 h-2 rounded-full bg-[#00FF88] shadow-[0_0_8px_#00FF88]" />
              <span className="text-xs text-[#00FF88]">CAPTURING</span>
            </motion.div>
          )}
          <button
            onClick={() => setActiveScreen('settings')}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            <SettingsIcon className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {renderScreen()}
      </div>

      {/* Bottom Navigation */}
      <div className="bg-gradient-to-r from-[#0F1419] to-[#1A1F26] border-t border-[#00C2FF]/20 px-4 py-2">
        <div className="flex items-center justify-around max-w-lg mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveScreen(item.id)}
                className="relative flex flex-col items-center gap-1 p-2 rounded-lg transition-all"
              >
                <Icon 
                  className={`w-6 h-6 transition-colors ${
                    isActive ? 'text-[#00C2FF]' : 'text-gray-400'
                  }`}
                />
                <span 
                  className={`text-xs transition-colors ${
                    isActive ? 'text-[#00C2FF]' : 'text-gray-400'
                  }`}
                >
                  {item.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#00C2FF] shadow-[0_0_8px_#00C2FF]"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
