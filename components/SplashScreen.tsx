
import React from 'react';

export const SplashScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-orange-600 overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[length:40px_40px]"></div>
      </div>
      
      {/* Floating decorative elements */}
      <div className="absolute top-10 left-10 text-4xl opacity-20 animate-pulse">☸️</div>
      <div className="absolute bottom-10 right-10 text-4xl opacity-20 animate-pulse delay-700">🪷</div>
      <div className="absolute top-20 right-20 text-4xl opacity-20 animate-pulse delay-300">🕯️</div>
      <div className="absolute bottom-20 left-20 text-4xl opacity-20 animate-pulse delay-500">🚩</div>

      {/* Main Content */}
      <div className="relative z-10 text-center space-y-6">
        <div className="relative inline-block">
          {/* Outer glowing ring */}
          <div className="absolute -inset-8 bg-orange-400/30 rounded-full blur-3xl animate-pulse"></div>
          
          <div className="relative text-[120px] leading-none animate-bounce drop-shadow-2xl">
            🕉️
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-5xl font-black text-white tracking-tighter drop-shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-700">
            KumbhAI
          </h1>
          <p className="text-orange-100 font-medium tracking-widest uppercase text-xs opacity-80 animate-in fade-in duration-1000 delay-300">
            Smart Pilgrimage Management
          </p>
        </div>

        {/* Loading bar */}
        <div className="w-48 h-1.5 bg-orange-800/40 rounded-full mx-auto mt-12 overflow-hidden border border-orange-400/20">
          <div className="h-full bg-white rounded-full animate-[progress_4s_ease-in-out_forwards]"></div>
        </div>
        
        <p className="text-white/60 text-[10px] font-bold uppercase tracking-[0.2em] mt-4">
          Harnessing Divine Intelligence
        </p>
      </div>

      <style>{`
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
};
