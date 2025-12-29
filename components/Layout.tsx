
import React from 'react';
import { UserRole } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  role: UserRole;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, role, onLogout }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      <header className="sticky top-0 z-[60] glass-panel border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-200">
              <span className="text-xl">🕉️</span>
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-slate-900 leading-none">KumbhAI</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Divine Intel Hub</p>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <div className="hidden sm:flex items-center space-x-2 bg-slate-100/80 px-4 py-2 rounded-2xl border border-slate-200/50">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-[11px] font-black text-slate-600 uppercase tracking-tighter">
                {role} ACCESS
              </span>
            </div>
            <button 
              onClick={onLogout}
              className="text-xs font-black text-slate-400 hover:text-orange-600 transition-all uppercase tracking-widest flex items-center space-x-2"
            >
              <span>Logout</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            </button>
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-10">
        {children}
      </main>
      <footer className="border-t border-slate-200 bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex flex-col items-center space-y-4">
             <div className="text-2xl grayscale opacity-30">🪷</div>
             <p className="text-slate-400 text-[11px] font-bold uppercase tracking-[0.3em]">
               KumbhAI &copy; 2024 • Secured by Divine Intelligence
             </p>
             <div className="flex space-x-4">
                <div className="w-1.5 h-1.5 bg-orange-200 rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-orange-200 rounded-full"></div>
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
