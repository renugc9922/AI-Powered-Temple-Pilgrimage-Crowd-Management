
import React, { useState, useEffect, useMemo } from 'react';
import { MEDICAL_TENTS, LOCATIONS } from '../constants';
import { AIAssistant } from './AIAssistant';

interface PilgrimDashboardProps {
  identity: string;
  onTriggerSOS: (lat?: number, lng?: number) => void;
}

const USER_START_MAP = { x: 25, y: 40 };

export const PilgrimDashboard: React.FC<PilgrimDashboardProps> = ({ identity, onTriggerSOS }) => {
  const passStorageKey = `kumbhai_pass_${identity}`;
  
  const [bookingStatus] = useState(() => {
    const saved = localStorage.getItem(passStorageKey);
    if (saved) return JSON.parse(saved);
    return {
      id: `BK-${identity.slice(-4)}-${Math.floor(1000 + Math.random() * 9000)}`,
      name: identity.includes('@') ? identity.split('@')[0] : `Pilgrim ${identity.slice(-4)}`,
      timeSlot: '14:00 - 15:00',
      status: 'Confirmed',
      queuePosition: Math.floor(Math.random() * 800) + 100,
      estimatedWaitMinutes: Math.floor(Math.random() * 60) + 15
    };
  });

  const [sosLoading, setSosLoading] = useState(false);
  const [medLoading, setMedLoading] = useState(false);
  const [navLoadingId, setNavLoadingId] = useState<string | null>(null);
  const [selectedPointId, setSelectedPointId] = useState<string | null>(null);
  const [sosStatus, setSosStatus] = useState<'idle' | 'success'>('idle');
  const [showPass, setShowPass] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    localStorage.setItem(passStorageKey, JSON.stringify(bookingStatus));
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [bookingStatus, passStorageKey]);

  const handleSOS = () => {
    if (sosStatus === 'success' || sosLoading) return;
    setSosLoading(true);
    if ("vibrate" in navigator) navigator.vibrate([200, 100, 200]);
    const triggerAndSuccess = (lat?: number, lng?: number) => {
      onTriggerSOS(lat, lng);
      setSosLoading(false);
      setSosStatus('success');
      setTimeout(() => setSosStatus('idle'), 10000);
    };
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (p) => triggerAndSuccess(p.coords.latitude, p.coords.longitude),
        () => triggerAndSuccess(),
        { timeout: 8000 }
      );
    } else triggerAndSuccess();
  };

  const handleNavigateTo = (point: any) => {
    setNavLoadingId(point.id);
    setSelectedPointId(point.id);
    if ("vibrate" in navigator) navigator.vibrate(50);
    setTimeout(() => {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${point.lat},${point.lng}&travelmode=walking`;
      window.open(url, '_blank');
      setNavLoadingId(null);
    }, 1500);
  };

  const activePoint = useMemo(() => LOCATIONS.find(p => p.id === selectedPointId), [selectedPointId]);

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-24">
      <div className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-[70] transition-all duration-700 ${isOffline ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
        <div className="bg-slate-900/90 backdrop-blur-xl text-white px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl flex items-center space-x-3 border border-white/10">
          <div className="w-2.5 h-2.5 bg-orange-500 rounded-full animate-pulse shadow-[0_0_8px_#f97316]"></div>
          <span>Offline Recovery Active</span>
        </div>
      </div>

      <div className="divine-gradient rounded-[3rem] p-8 sm:p-12 text-white shadow-2xl shadow-orange-950/20 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-12 opacity-10 transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-[2s] pointer-events-none">
          <span className="text-[18rem]">🕉️</span>
        </div>
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.3em] opacity-60 mb-2">Pilgrim Identity Card</p>
              <h2 className="text-4xl sm:text-5xl font-black tracking-tighter mb-1">Namaste, {bookingStatus.name}</h2>
              <p className="text-lg font-bold opacity-80 font-mono">UID: {bookingStatus.id}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-xl px-4 py-2 rounded-2xl text-[10px] font-black tracking-widest uppercase border border-white/20 shadow-inner">
              {isOffline ? '📶 CACHED SESSION' : '🌐 LIVE SYNCED'}
            </div>
          </div>
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-3xl p-6 hover:bg-white/15 transition-all">
              <p className="text-[10px] uppercase font-black tracking-widest opacity-60 mb-1">Queue Position</p>
              <p className="text-4xl font-black tracking-tighter">{bookingStatus.queuePosition}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-3xl p-6 hover:bg-white/15 transition-all">
              <p className="text-[10px] uppercase font-black tracking-widest opacity-60 mb-1">Estimated Wait</p>
              <p className="text-4xl font-black tracking-tighter">{bookingStatus.estimatedWaitMinutes}<span className="text-lg ml-1 opacity-60">m</span></p>
            </div>
            <div className="hidden md:block bg-white/10 backdrop-blur-md border border-white/10 rounded-3xl p-6">
              <p className="text-[10px] uppercase font-black tracking-widest opacity-60 mb-1">Current Sector</p>
              <p className="text-xl font-black tracking-tight mt-2 uppercase">Ghat-04</p>
            </div>
            <div className="hidden md:block bg-white/10 backdrop-blur-md border border-white/10 rounded-3xl p-6">
              <p className="text-[10px] uppercase font-black tracking-widest opacity-60 mb-1">Status</p>
              <p className="text-xl font-black tracking-tight mt-2 uppercase">ON TRACK</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-5 space-y-8">
          <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-200/60 relative overflow-hidden group">
            <div className="absolute top-0 right-0 px-5 py-2 bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-widest border-b border-l border-green-100 rounded-bl-[2rem] shadow-sm">
              Secured Pass
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center tracking-tight">
              <span className="mr-4 text-3xl">🎫</span> Spiritual Entry
            </h3>
            <div className="space-y-6">
              <div className="flex justify-between items-center py-4 border-b border-slate-50">
                <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Selected Slot</span>
                <span className="font-black text-slate-900 text-lg">{bookingStatus.timeSlot}</span>
              </div>
              <button 
                onClick={() => setShowPass(true)}
                className="w-full bg-slate-900 text-white py-6 rounded-[2rem] font-black hover:bg-slate-800 transition-all flex items-center justify-center shadow-xl shadow-slate-200 group-hover:scale-[1.02]"
              >
                <span className="mr-3">📲</span> ACCESS DIGITAL PASS
              </button>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-200/60 group">
            <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center tracking-tight">
              <span className="mr-4 text-3xl">🛡️</span> Divine Safety
            </h3>
            <div className="space-y-4">
              <button 
                onClick={handleSOS} 
                disabled={sosLoading} 
                className={`w-full py-6 rounded-[2rem] text-sm font-black transition-all shadow-2xl relative overflow-hidden ${
                  sosStatus === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white hover:bg-red-700'
                }`}
              >
                {sosLoading && <div className="absolute inset-0 shimmer opacity-20"></div>}
                <span className="relative z-10 flex items-center justify-center">
                  {sosLoading ? 'DISPATCHING ASSISTANCE...' : sosStatus === 'success' ? '✓ ALERT BROADCASTED' : '🆘 EMERGENCY SOS'}
                </span>
              </button>
              <button 
                onClick={() => {
                  setMedLoading(true);
                  setTimeout(() => {
                    const tent = MEDICAL_TENTS[0];
                    window.open(`https://www.google.com/maps/dir/?api=1&destination=${tent.lat},${tent.lng}`, '_blank');
                    setMedLoading(false);
                  }, 1000);
                }} 
                disabled={medLoading} 
                className="w-full bg-slate-50 text-slate-700 py-5 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.2em] border-2 border-slate-100 hover:bg-slate-100 transition-all flex items-center justify-center"
              >
                {medLoading ? 'Locating Station...' : '🏥 Find Medical Post'}
              </button>
            </div>
          </div>
        </div>

        <div className="md:col-span-7">
          <AIAssistant />
        </div>
      </div>

      <div className="bg-white p-8 sm:p-10 rounded-[3.5rem] shadow-sm border border-slate-200/60 overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center">
              <span className="mr-4 text-3xl">🗺️</span> Smart Flow Navigation
            </h3>
            <p className="text-slate-400 text-sm font-medium mt-1">Real-time pathfinding across high-density sectors.</p>
          </div>
          <div className="flex items-center space-x-2 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
             <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
             <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Satellite Active</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 relative aspect-video bg-slate-950 rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-inner group">
            <img 
                src="https://picsum.photos/seed/kumbh-map-final/1600/900?grayscale" 
                className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:scale-105 transition-transform duration-[4s]" 
                alt="Tactical Map" 
            />
            
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
              {activePoint && (
                <path 
                  d={`M ${USER_START_MAP.x} ${USER_START_MAP.y} Q ${(USER_START_MAP.x + activePoint.x) / 2} ${(USER_START_MAP.y + activePoint.y) / 2 - 15}, ${activePoint.x} ${activePoint.y}`}
                  fill="none"
                  stroke="#f97316"
                  strokeWidth="0.8"
                  strokeDasharray="4,4"
                  className="animate-dash"
                />
              )}
            </svg>

            {LOCATIONS.map((point: any) => (
              <div 
                key={point.id} 
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ${selectedPointId === point.id ? 'z-30 scale-125' : 'z-10'}`}
                style={{ left: `${point.x}%`, top: `${point.y}%` }}
              >
                <div className={`w-4 h-4 rounded-full border-4 border-white shadow-2xl transition-all ${selectedPointId === point.id ? 'bg-orange-500 ring-8 ring-orange-500/20' : 'bg-slate-500/60'}`}></div>
              </div>
            ))}

            <div className="absolute top-[40%] left-[25%] transform -translate-x-1/2 -translate-y-1/2 z-20">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full animate-ping absolute -inset-3"></div>
              <div className="w-8 h-8 bg-blue-600 rounded-2xl border-2 border-white flex items-center justify-center shadow-2xl rotate-45">
                 <div className="w-2.5 h-2.5 bg-white rounded-full -rotate-45 animate-pulse"></div>
              </div>
            </div>

            {navLoadingId && (
              <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-50">
                <div className="text-center bg-white/10 p-8 rounded-[2rem] border border-white/10">
                  <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                  <p className="text-[11px] font-black text-white uppercase tracking-[0.3em] animate-pulse">Recalculating Flow Path...</p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Divine Destinations</p>
             <div className="space-y-3 max-h-[450px] overflow-y-auto no-scrollbar pr-1">
                {LOCATIONS.map((point: any) => (
                  <button 
                    key={point.id} 
                    onClick={() => handleNavigateTo(point)}
                    className={`w-full group relative flex items-center p-5 rounded-3xl border-2 transition-all text-left ${
                      selectedPointId === point.id 
                        ? 'bg-orange-50/80 border-orange-500/40 shadow-xl shadow-orange-100 ring-1 ring-orange-200' 
                        : 'bg-white border-slate-100 hover:border-slate-200'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-sm ${
                      selectedPointId === point.id ? 'bg-orange-600 text-white scale-110' : 'bg-slate-50 text-slate-400 group-hover:bg-slate-100'
                    }`}>
                      {navLoadingId === point.id ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <span className="text-xl">📍</span>
                      )}
                    </div>
                    <div className="ml-5 flex-1">
                      <span className={`text-[13px] font-black block tracking-tight ${selectedPointId === point.id ? 'text-orange-950' : 'text-slate-800'}`}>
                        {point.name}
                      </span>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className={`w-1.5 h-1.5 rounded-full ${point.id === 'gate-a' ? 'bg-red-500' : 'bg-green-500'}`}></div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                          {point.id === 'gate-a' ? 'HEAVY TRAFFIC' : 'SMOOTH PASSAGE'}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
             </div>
             
             {activePoint && (
               <div className="mt-8 p-6 bg-slate-900 text-white rounded-[2.5rem] animate-in slide-in-from-bottom-6 duration-500 shadow-2xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-4 opacity-5">
                    <span className="text-6xl">✨</span>
                 </div>
                 <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-400 mb-2">Tactical ETA</p>
                 <p className="text-3xl font-black tracking-tighter">~12 Mins</p>
                 <p className="text-[11px] font-medium mt-2 opacity-60 leading-relaxed italic">"Optimal walking path detected via Sector B to avoid current cluster at Main Plaza."</p>
               </div>
             )}
          </div>
        </div>
      </div>

      {showPass && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-2xl animate-in fade-in duration-500">
          <div className="relative w-full max-w-sm animate-in zoom-in-95 duration-700">
            <button onClick={() => setShowPass(false)} className="absolute -top-16 right-0 text-white p-3 hover:rotate-90 transition-all">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <div className="bg-white rounded-[3.5rem] overflow-hidden shadow-[0_35px_60px_-15px_rgba(0,0,0,0.5)] border-4 border-orange-500/30">
              <div className="bg-orange-600 p-10 text-white text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full shimmer opacity-10"></div>
                <h4 className="text-2xl font-black uppercase tracking-tighter">Kumbh Mela 2024</h4>
                <p className="text-[10px] font-bold opacity-70 uppercase tracking-[0.3em] mt-2">Verified Darshan Pass</p>
              </div>
              <div className="p-10 space-y-8">
                <div className="text-center space-y-6">
                  <div className="p-6 bg-slate-50 rounded-[3rem] border-2 border-slate-100 flex items-center justify-center shadow-inner group">
                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${bookingStatus.id}-${identity}&color=0f172a`} className="w-48 h-48 group-hover:scale-105 transition-transform" alt="QR" />
                  </div>
                  <div>
                    <p className="text-[11px] font-black text-slate-300 uppercase tracking-widest mb-1">Pilgrim Name</p>
                    <p className="text-2xl font-black text-slate-900 tracking-tight">{bookingStatus.name}</p>
                    <p className="text-[12px] font-mono text-slate-400 mt-1 font-bold">UID: {bookingStatus.id}</p>
                  </div>
                  <div className="pt-6 border-t border-slate-100 grid grid-cols-2 gap-4">
                    <div className="text-left">
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Assigned Slot</p>
                      <p className="text-sm font-black text-orange-600">{bookingStatus.timeSlot}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Entry Zone</p>
                      <p className="text-sm font-black text-slate-900">GATE ALPHA</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-orange-50/50 p-6 text-center border-t border-orange-100">
                 <p className="text-[10px] font-black text-orange-800 uppercase tracking-[0.2em] flex items-center justify-center">
                   <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-3 animate-pulse"></span>
                   VALID FOR SINGLE ENTRY
                 </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
