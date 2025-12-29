
import React from 'react';

export const SplashScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center divine-gradient overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[length:60px_60px]"></div>
      </div>
      
      <div className="absolute top-20 left-[10%] text-6xl opacity-10 animate-[bounce_4s_infinite]">☸️</div>
      <div className="absolute bottom-20 right-[15%] text-6xl opacity-10 animate-[bounce_5s_infinite_1s]">🪷</div>
      <div className="absolute top-[30%] right-[10%] text-6xl opacity-10 animate-[pulse_3s_infinite]">🚩</div>

      <div className="relative z-10 text-center space-y-10">
        <div className="relative inline-block">
          <div className="absolute -inset-16 bg-white/20 rounded-full blur-[100px] animate-pulse"></div>
          <div className="relative text-[160px] leading-none drop-shadow-[0_25px_25px_rgba(0,0,0,0.3)] animate-in zoom-in duration-1000">
            🕉️
          </div>
        </div>
        
        <div className="space-y-4">
          <h1 className="text-7xl font-black text-white tracking-tighter drop-shadow-2xl animate-in slide-in-from-bottom-8 duration-1000">
            KumbhAI
          </h1>
          <div className="flex items-center justify-center space-x-4">
             <div className="h-[1px] w-8 bg-white/30"></div>
             <p className="text-orange-100 font-black tracking-[0.5em] uppercase text-[10px] opacity-70 animate-in fade-in duration-[1.5s] delay-500">
               Divine Crowd Intelligence
             </p>
             <div className="h-[1px] w-8 bg-white/30"></div>
          </div>
        </div>

        <div className="w-56 h-1.5 bg-orange-950/20 rounded-full mx-auto mt-20 overflow-hidden backdrop-blur-md border border-white/10">
          <div className="h-full bg-white rounded-full animate-[progress_4.5s_cubic-bezier(.17,.67,.83,.67)_forwards] shadow-[0_0_15px_white]"></div>
        </div>
        
        <div className="flex items-center justify-center space-x-3 text-white/40 text-[9px] font-black uppercase tracking-[0.3em] mt-8 animate-pulse">
           <span>Loading Sanctuary Nodes</span>
           <div className="flex space-x-1">
              <span className="w-1 h-1 bg-white/40 rounded-full"></span>
              <span className="w-1 h-1 bg-white/40 rounded-full"></span>
              <span className="w-1 h-1 bg-white/40 rounded-full"></span>
           </div>
        </div>
      </div>

      <style>{`
        @keyframes progress {
          0% { width: 0%; transform: translateX(-100%); }
          20% { width: 30%; transform: translateX(0); }
          50% { width: 60%; }
          100% { width: 100%; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};
