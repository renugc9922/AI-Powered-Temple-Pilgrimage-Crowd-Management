
import React, { useState, useEffect } from 'react';
import { UserRole, Alert } from './types';
import { Layout } from './components/Layout';
import { AdminDashboard } from './components/AdminDashboard';
import { PilgrimDashboard } from './components/PilgrimDashboard';
import { SplashScreen } from './components/SplashScreen';
import { LoginScreen } from './components/LoginScreen';

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<UserRole>(UserRole.PILGRIM);
  const [userIdentity, setUserIdentity] = useState('');
  
  const [alerts, setAlerts] = useState<Alert[]>([
    { id: '1', type: 'Crowd', location: 'Gate A', message: 'Density exceeded 80%', severity: 'Critical', timestamp: new Date().toISOString(), resolved: false },
    { id: '2', type: 'Medical', location: 'Prasad Hall', message: 'Heat exhaustion reported', severity: 'Warning', timestamp: new Date().toISOString(), resolved: false },
    { id: '3', type: 'Security', location: 'North Gate', message: 'Unattended bag detected', severity: 'Critical', timestamp: new Date().toISOString(), resolved: false },
    { id: '4', type: 'Medical', location: 'Bathing Ghat 4', message: 'Minor injury near stairs', severity: 'Info', timestamp: new Date().toISOString(), resolved: false },
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 4500);
    return () => clearTimeout(timer);
  }, []);

  const handleLoginSuccess = (selectedRole: UserRole, identity: string) => {
    setRole(selectedRole);
    setUserIdentity(identity);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserIdentity('');
  };

  const triggerSOS = (lat?: number, lng?: number) => {
    const newAlert: Alert = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'Emergency',
      severity: 'Critical',
      location: 'User Geolocation',
      message: 'SOS ALERT: Pilgrim requires immediate assistance!',
      timestamp: new Date().toISOString(),
      resolved: false,
      lat,
      lng
    };
    setAlerts(prev => [newAlert, ...prev]);
  };

  const toggleAlertResolve = (id: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, resolved: !alert.resolved } : alert
    ));
  };

  const clearResolvedAlerts = () => {
    setAlerts(prev => prev.filter(alert => !alert.resolved));
  };

  const clearAllAlerts = () => {
    setAlerts([]);
  };

  if (showSplash) {
    return <SplashScreen />;
  }

  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLoginSuccess} />;
  }

  return (
    <Layout role={role} onLogout={handleLogout}>
      {role === UserRole.PILGRIM ? (
        <PilgrimDashboard onTriggerSOS={triggerSOS} />
      ) : (
        <AdminDashboard 
          alerts={alerts} 
          role={role}
          onResolve={toggleAlertResolve} 
          onClearResolved={clearResolvedAlerts} 
          onClearAll={clearAllAlerts}
        />
      )}
    </Layout>
  );
};

export default App;
