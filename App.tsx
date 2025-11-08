import React, { useState } from 'react';
import { BiometricAuth } from './components/BiometricAuth';
import { HawkeyeMain } from './components/HawkeyeMain';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);

  const handleAuthSuccess = (token: string, user: string) => {
    setIsAuthenticated(true);
    setUserId(user);
    setSessionToken(token);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserId(null);
    setSessionToken(null);
  };

  if (!isAuthenticated) {
    return <BiometricAuth onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <HawkeyeMain 
      userId={userId!} 
      sessionToken={sessionToken!}
      onLogout={handleLogout}
    />
  );
}
