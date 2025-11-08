import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Video, 
  VideoOff, 
  Users, 
  MessageSquare, 
  Send,
  Shield,
  Eye,
  EyeOff,
  CheckCircle,
  AlertTriangle,
  UserCheck
} from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface DeveloperStreamProps {
  userId: string;
  sessionToken: string;
}

interface StreamSession {
  id: string;
  developerId: string;
  developerName: string;
  status: 'active' | 'resolved' | 'escalated';
  threatLevel: 'low' | 'medium' | 'high';
  startTime: string;
  description: string;
  token: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'developer';
  message: string;
  timestamp: string;
}

export function DeveloperStream({ userId, sessionToken }: DeveloperStreamProps) {
  const [activeSession, setActiveSession] = useState<StreamSession | null>(null);
  const [pendingInvites, setPendingInvites] = useState<StreamSession[]>([]);
  const [isStreamEnabled, setIsStreamEnabled] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [streamToken, setStreamToken] = useState<string | null>(null);

  // Simulate receiving stream invites
  useEffect(() => {
    // In real app, this would listen to WebSocket or server events
    const mockInvite: StreamSession = {
      id: `session_${Date.now()}`,
      developerId: 'dev_001',
      developerName: 'Security Analyst - John Doe',
      status: 'active',
      threatLevel: 'high',
      startTime: new Date().toISOString(),
      description: 'Suspicious network activity detected. Requesting live session for analysis.',
      token: generateSecureToken()
    };

    // Simulate invite after 3 seconds for demo
    const timer = setTimeout(() => {
      setPendingInvites([mockInvite]);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Simulate chat messages from developer
  useEffect(() => {
    if (!activeSession) return;

    const simulateDevMessages = [
      { delay: 2000, message: "Hello, I'm analyzing the threat detected on your device." },
      { delay: 5000, message: "Can you confirm if you recently installed any new applications?" },
      { delay: 10000, message: "I'm seeing multiple suspicious connections. Investigating further..." },
    ];

    const timers = simulateDevMessages.map(({ delay, message }) =>
      setTimeout(() => {
        const newMessage: ChatMessage = {
          id: `msg_${Date.now()}_${Math.random()}`,
          sender: 'developer',
          message,
          timestamp: new Date().toLocaleTimeString()
        };
        setChatMessages(prev => [...prev, newMessage]);
      }, delay)
    );

    return () => timers.forEach(timer => clearTimeout(timer));
  }, [activeSession]);

  const generateSecureToken = () => {
    return `tok_${Math.random().toString(36).substr(2, 9)}_${Date.now()}`;
  };

  const handleAcceptInvite = async (session: StreamSession) => {
    // Verify token and establish connection
    setStreamToken(session.token);
    setActiveSession(session);
    setIsStreamEnabled(true);
    setPendingInvites(prev => prev.filter(s => s.id !== session.id));

    // Send initial message
    const welcomeMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      sender: 'developer',
      message: 'Session established. I can now see your network traffic in real-time.',
      timestamp: new Date().toLocaleTimeString()
    };
    setChatMessages([welcomeMessage]);

    // Store session in backend
    try {
      await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-07bfe634/stream-session`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          sessionId: session.id,
          developerId: session.developerId,
          token: session.token,
          status: 'active'
        })
      });
    } catch (error) {
      console.error('Failed to create stream session:', error);
    }
  };

  const handleRejectInvite = (sessionId: string) => {
    setPendingInvites(prev => prev.filter(s => s.id !== sessionId));
  };

  const handleEndSession = async () => {
    if (!activeSession) return;

    // Update session status in backend
    try {
      await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-07bfe634/stream-session/${activeSession.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: 'ended',
          endTime: new Date().toISOString()
        })
      });
    } catch (error) {
      console.error('Failed to end stream session:', error);
    }

    setActiveSession(null);
    setIsStreamEnabled(false);
    setChatMessages([]);
    setStreamToken(null);
  };

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;

    const newMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      sender: 'user',
      message: messageInput,
      timestamp: new Date().toLocaleTimeString()
    };

    setChatMessages(prev => [...prev, newMessage]);
    setMessageInput('');

    // Send to backend
    try {
      fetch(`https://${projectId}.supabase.co/functions/v1/make-server-07bfe634/stream-message`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sessionId: activeSession?.id,
          message: messageInput,
          sender: userId
        })
      });
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <div className="p-4 space-y-4 pb-20">
      {/* Header */}
      <div>
        <h1 className="text-2xl text-white mb-1">Developer Stream</h1>
        <p className="text-sm text-gray-400">Live collaboration with security analysts</p>
      </div>

      {/* Pending Invites */}
      <AnimatePresence>
        {pendingInvites.map(invite => (
          <motion.div
            key={invite.id}
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="bg-gradient-to-br from-[#FF0080]/10 to-[#FFB800]/10 border border-[#FF0080]/30 rounded-xl p-4"
          >
            <div className="flex items-start gap-3 mb-4">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="p-3 bg-[#FF0080]/20 rounded-full"
              >
                <AlertTriangle className="w-6 h-6 text-[#FF0080]" />
              </motion.div>
              <div className="flex-1">
                <h3 className="text-white mb-1">Stream Invite Received</h3>
                <p className="text-sm text-gray-300 mb-2">{invite.description}</p>
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <div className="flex items-center gap-1">
                    <UserCheck className="w-3 h-3" />
                    <span>{invite.developerName}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    <span className={`${
                      invite.threatLevel === 'high' ? 'text-red-500' :
                      invite.threatLevel === 'medium' ? 'text-yellow-500' :
                      'text-[#00FF88]'
                    }`}>
                      {invite.threatLevel.toUpperCase()} PRIORITY
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#1A1F26] rounded-lg p-3 mb-4">
              <div className="text-xs text-gray-400 mb-2">Session Token (Encrypted)</div>
              <div className="font-mono text-xs text-[#00C2FF] break-all">{invite.token}</div>
            </div>

            <div className="flex gap-3">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAcceptInvite(invite)}
                className="flex-1 bg-gradient-to-r from-[#00C2FF] to-[#00FF88] text-[#0A0F14] py-3 rounded-xl flex items-center justify-center gap-2"
              >
                <Video className="w-4 h-4" />
                <span>Accept & Join</span>
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => handleRejectInvite(invite.id)}
                className="px-6 bg-[#1A1F26] border border-red-500/30 text-red-500 py-3 rounded-xl"
              >
                Decline
              </motion.button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Active Session */}
      {activeSession ? (
        <div className="space-y-4">
          {/* Session Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-[#0F1419] to-[#1A1F26] rounded-xl p-4 border border-[#00FF88]/30"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-3 h-3 rounded-full bg-[#00FF88] shadow-[0_0_8px_#00FF88]"
                />
                <span className="text-[#00FF88]">Live Session Active</span>
              </div>
              <span className="text-xs text-gray-400">
                {new Date(activeSession.startTime).toLocaleTimeString()}
              </span>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <UserCheck className="w-4 h-4 text-[#00C2FF]" />
              <span className="text-sm text-white">{activeSession.developerName}</span>
            </div>

            <div className="flex items-center gap-2 bg-[#1A1F26] rounded-lg p-3">
              <Eye className="w-4 h-4 text-[#00C2FF]" />
              <span className="text-xs text-gray-400">
                Developer can view your network traffic in real-time
              </span>
            </div>
          </motion.div>

          {/* Stream View */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-[#0F1419] to-[#1A1F26] rounded-xl p-4 border border-[#00C2FF]/20"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-[#00C2FF]" />
                <span className="text-white">Live Analysis Stream</span>
              </div>
              <button
                onClick={() => setIsStreamEnabled(!isStreamEnabled)}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                {isStreamEnabled ? (
                  <Eye className="w-5 h-5 text-[#00C2FF]" />
                ) : (
                  <EyeOff className="w-5 h-5 text-gray-400" />
                )}
              </button>
            </div>

            {isStreamEnabled ? (
              <div className="bg-[#000000] rounded-lg aspect-video flex items-center justify-center relative overflow-hidden">
                {/* Simulated stream visualization */}
                <div className="absolute inset-0">
                  <div className="absolute inset-0 opacity-20" style={{
                    backgroundImage: `linear-gradient(#00C2FF 1px, transparent 1px), linear-gradient(90deg, #00C2FF 1px, transparent 1px)`,
                    backgroundSize: '20px 20px'
                  }} />
                  
                  {/* Animated scan lines */}
                  <motion.div
                    className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#00FF88] to-transparent opacity-50"
                    animate={{ top: ['0%', '100%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  />

                  {/* Data packets visualization */}
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 rounded-full bg-[#00C2FF]"
                      animate={{
                        x: [Math.random() * 300, Math.random() * 300],
                        y: [Math.random() * 200, Math.random() * 200],
                        opacity: [0.3, 1, 0.3]
                      }}
                      transition={{
                        duration: 2 + Math.random() * 2,
                        repeat: Infinity,
                        delay: i * 0.5
                      }}
                    />
                  ))}
                </div>

                <div className="relative z-10 text-center">
                  <Shield className="w-12 h-12 text-[#00C2FF] mx-auto mb-2" />
                  <p className="text-sm text-gray-400">Developer is viewing your network</p>
                </div>
              </div>
            ) : (
              <div className="bg-[#1A1F26] rounded-lg aspect-video flex items-center justify-center">
                <div className="text-center">
                  <VideoOff className="w-12 h-12 text-gray-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">Stream paused</p>
                </div>
              </div>
            )}
          </motion.div>

          {/* Chat */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-[#0F1419] to-[#1A1F26] rounded-xl border border-[#00C2FF]/20 overflow-hidden"
          >
            <div className="p-4 border-b border-[#00C2FF]/20 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#00C2FF]" />
              <span className="text-white">Live Chat</span>
            </div>

            {/* Messages */}
            <div className="h-64 overflow-y-auto p-4 space-y-3">
              {chatMessages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] rounded-xl p-3 ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-[#00C2FF] to-[#00FF88] text-[#0A0F14]'
                      : 'bg-[#1A1F26] text-white'
                  }`}>
                    <p className="text-sm">{msg.message}</p>
                    <p className={`text-xs mt-1 ${
                      msg.sender === 'user' ? 'text-[#0A0F14]/60' : 'text-gray-400'
                    }`}>
                      {msg.timestamp}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-[#00C2FF]/20 flex gap-2">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1 bg-[#1A1F26] border border-[#00C2FF]/20 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00C2FF]"
              />
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleSendMessage}
                className="px-4 bg-gradient-to-r from-[#00C2FF] to-[#00FF88] text-[#0A0F14] rounded-lg"
              >
                <Send className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>

          {/* End Session Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleEndSession}
            className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-xl flex items-center justify-center gap-2"
          >
            <VideoOff className="w-5 h-5" />
            <span>End Session</span>
          </motion.button>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#0F1419] to-[#1A1F26] rounded-xl p-8 border border-[#00C2FF]/20 text-center"
        >
          <Users className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-white mb-2">No Active Sessions</h3>
          <p className="text-sm text-gray-400 mb-4">
            When threats are detected, developers may request a live stream session
            to analyze your network traffic in real-time.
          </p>
          <div className="bg-[#1A1F26] rounded-lg p-4 space-y-2 text-left">
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <CheckCircle className="w-4 h-4 text-[#00FF88]" />
              <span>Token-based authentication</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <CheckCircle className="w-4 h-4 text-[#00FF88]" />
              <span>End-to-end encrypted</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <CheckCircle className="w-4 h-4 text-[#00FF88]" />
              <span>You control when to share</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}