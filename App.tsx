
import React, { useState } from 'react';
import { UserRole } from './types';
import { Layout } from './components/Layout';
import { AdminDashboard } from './components/AdminDashboard';
import { PilgrimDashboard } from './components/PilgrimDashboard';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<UserRole>(UserRole.PILGRIM);
  const [loginLoading, setLoginLoading] = useState(false);

  const handleLogin = (selectedRole: UserRole) => {
    setLoginLoading(true);
    // Simulate API delay
    setTimeout(() => {
      setRole(selectedRole);
      setIsAuthenticated(true);
      setLoginLoading(false);
    }, 1200);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="bg-white max-w-md w-full rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-orange-600 p-8 text-center text-white">
            <div className="text-5xl mb-4">🕉️</div>
            <h1 className="text-3xl font-bold tracking-tight">KumbhAI</h1>
            <p className="mt-2 text-orange-100">Smart Crowd Management System</p>
          </div>
          <div className="p-8">
            <p className="text-sm text-slate-600 text-center mb-6">
              Welcome to the Temple Pilgrim & Crowd Management Portal. Please select your access role to continue.
            </p>
            
            <div className="space-y-3">
              <RoleButton 
                title="Pilgrim Access" 
                subtitle="Book slots, check queue, navigation" 
                icon="🚶" 
                onClick={() => handleLogin(UserRole.PILGRIM)}
                loading={loginLoading}
              />
              <RoleButton 
                title="Admin Dashboard" 
                subtitle="Analytics, AI predictions, alerts" 
                icon="📊" 
                onClick={() => handleLogin(UserRole.ADMIN)}
                loading={loginLoading}
              />
              <RoleButton 
                title="Security / Police" 
                subtitle="Live monitoring, unit deployment" 
                icon="👮" 
                onClick={() => handleLogin(UserRole.SECURITY)}
                loading={loginLoading}
              />
              <RoleButton 
                title="Medical Emergency" 
                subtitle="Triage management, SOS alerts" 
                icon="🚑" 
                onClick={() => handleLogin(UserRole.MEDICAL)}
                loading={loginLoading}
              />
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100">
              <div className="flex items-center justify-center space-x-2 text-xs text-slate-400">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                <span>Production Server Active (v1.0.4)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Layout role={role} onLogout={handleLogout}>
      {role === UserRole.ADMIN || role === UserRole.SECURITY || role === UserRole.MEDICAL ? (
        <AdminDashboard />
      ) : (
        <PilgrimDashboard />
      )}
    </Layout>
  );
};

const RoleButton: React.FC<{ 
  title: string; 
  subtitle: string; 
  icon: string; 
  onClick: () => void;
  loading: boolean;
}> = ({ title, subtitle, icon, onClick, loading }) => (
  <button 
    onClick={onClick}
    disabled={loading}
    className="w-full text-left p-4 rounded-xl border border-slate-200 hover:border-orange-500 hover:bg-orange-50 transition-all group flex items-start space-x-4 disabled:opacity-50"
  >
    <div className="text-2xl bg-slate-100 group-hover:bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center transition-colors">
      {icon}
    </div>
    <div className="flex-1">
      <h3 className="font-bold text-slate-900">{title}</h3>
      <p className="text-xs text-slate-500">{subtitle}</p>
    </div>
    <div className="self-center text-slate-300 group-hover:text-orange-500 transform group-hover:translate-x-1 transition-all">
      →
    </div>
  </button>
);

export default App;
