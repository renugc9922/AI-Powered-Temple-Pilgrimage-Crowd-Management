
import React from 'react';
import { UserRole } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  role: UserRole;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, role, onLogout }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-orange-600 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🕉️</span>
            <h1 className="text-xl font-bold tracking-tight">KumbhAI</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm bg-orange-700 px-3 py-1 rounded-full font-medium uppercase">
              {role}
            </span>
            <button 
              onClick={onLogout}
              className="text-orange-100 hover:text-white transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8">
        {children}
      </main>
      <footer className="bg-slate-900 text-slate-400 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm">
          &copy; 2024 KumbhAI - Smart Temple Crowd Management System. Real-time AI Safety Monitoring.
        </div>
      </footer>
    </div>
  );
};
