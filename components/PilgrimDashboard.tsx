
import React, { useState } from 'react';
import { MOCK_USER, MEDICAL_TENTS } from '../constants';
import { AIAssistant } from './AIAssistant';
import { VeoGenerator } from './VeoGenerator';

interface PilgrimDashboardProps {
  onTriggerSOS: (lat?: number, lng?: number) => void;
}

export const PilgrimDashboard: React.FC<PilgrimDashboardProps> = ({ onTriggerSOS }) => {
  const [bookingStatus] = useState(MOCK_USER.booking);
  const [sosLoading, setSosLoading] = useState(false);
  const [medLoading, setMedLoading] = useState(false);
  const [sosStatus, setSosStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [showPass, setShowPass] = useState(false);

  const handleSOS = () => {
    if (sosStatus === 'success' || sosLoading) return;
    setSosLoading(true);
    setSosStatus('idle');
    if ("vibrate" in navigator) navigator.vibrate([200, 100, 200]);

    const triggerAndSuccess = (lat?: number, lng?: number) => {
      onTriggerSOS(lat, lng);
      setSosLoading(false);
      setSosStatus('success');
      setTimeout(() => setSosStatus('idle'), 10000);
    };

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => triggerAndSuccess(position.coords.latitude, position.coords.longitude),
        () => triggerAndSuccess(),
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
      );
    } else triggerAndSuccess();
  };

  const handleFindMedical = () => {
    setMedLoading(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude: uLat, longitude: uLng } = position.coords;
          let nearest = MEDICAL_TENTS[0];
          let minDistance = Infinity;
          MEDICAL_TENTS.forEach(tent => {
            const dist = Math.sqrt(Math.pow(tent.lat - uLat, 2) + Math.pow(tent.lng - uLng, 2));
            if (dist < minDistance) { minDistance = dist; nearest = tent; }
          });
          const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${uLat},${uLng}&destination=${nearest.lat},${nearest.lng}&travelmode=walking`;
          window.open(mapsUrl, '_blank');
          setMedLoading(false);
        },
        () => {
          alert("Could not access location. Please follow physical signage for Medical Tents.");
          setMedLoading(false);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
      setMedLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="bg-gradient-to-br from-orange-600 to-red-700 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold">Namaste, {MOCK_USER.name}</h2>
          <p className="opacity-90">Kumbh Mela Smart Assistant is active.</p>
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4">
              <p className="text-[10px] uppercase font-bold tracking-widest opacity-70">Current Queue</p>
              <p className="text-3xl font-black">{bookingStatus.queuePosition}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4">
              <p className="text-[10px] uppercase font-bold tracking-widest opacity-70">Wait Time</p>
              <p className="text-3xl font-black">{bookingStatus.estimatedWaitMinutes}<span className="text-lg ml-1">min</span></p>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-4 -translate-y-4 select-none">
          <span className="text-[12rem]">🕉️</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
              <span className="mr-2">🎫</span> Your Darshan Pass
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-slate-50 text-sm">
                <span className="text-slate-500">Pass ID</span>
                <span className="font-mono font-bold text-slate-900">{bookingStatus.id}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-slate-50 text-sm">
                <span className="text-slate-500">Valid Slot</span>
                <span className="font-bold text-slate-900">{bookingStatus.timeSlot}</span>
              </div>
              <button 
                onClick={() => setShowPass(true)}
                className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 active:scale-[0.98] transition-all flex items-center justify-center shadow-lg shadow-slate-200"
              >
                <span className="mr-2">📲</span> Show Digital Pass
              </button>
            </div>
          </div>
          <AIAssistant />
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
              <span className="mr-2">🛡️</span> Safety & Emergency
            </h3>
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 flex items-start">
                <span className="text-xl mr-3 mt-0.5">📢</span>
                <div>
                  <p className="text-sm font-bold text-blue-900 leading-tight">Crowd Advisory</p>
                  <p className="text-xs text-blue-700 mt-1">Movement is steady. No major bottlenecks detected on your route.</p>
                </div>
              </div>
              
              <div className="pt-2 grid grid-cols-1 gap-3">
                <button onClick={handleSOS} disabled={sosLoading} className={`group py-4 rounded-xl text-base font-black transition-all shadow-xl active:scale-95 ${sosStatus === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white hover:bg-red-700'}`}>
                   {sosLoading ? 'TRANSMITTING...' : sosStatus === 'success' ? '✓ ALERT BROADCASTED' : '🆘 SEND SOS EMERGENCY'}
                </button>
                <button onClick={handleFindMedical} disabled={medLoading} className="bg-slate-50 text-slate-700 py-3 rounded-xl text-sm font-bold border border-slate-200 hover:bg-slate-100 transition-colors flex items-center justify-center">
                  {medLoading ? 'FINDING...' : '🏥 Find Nearest Medical Tent'}
                </button>
              </div>
            </div>
          </div>
          <VeoGenerator />
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
          <span className="mr-2">🗺️</span> Dynamic Navigation
        </h3>
        <div className="relative aspect-[21/9] bg-slate-100 rounded-xl border border-slate-200 overflow-hidden group">
          <img src="https://picsum.photos/seed/temple-map/1600/700" className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 transition-all duration-700" alt="Map View" />
          <div className="absolute top-[40%] left-[25%] w-6 h-6 z-20">
            <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-50"></div>
            <div className="w-6 h-6 bg-blue-600 rounded-full border-2 border-white flex items-center justify-center shadow-lg">
              <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Digital Pass Modal */}
      {showPass && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative w-full max-w-sm animate-in zoom-in-95 duration-500">
            {/* Close Button */}
            <button 
              onClick={() => setShowPass(false)}
              className="absolute -top-12 right-0 text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* The Physical-looking Ticket */}
            <div className="bg-white rounded-[2rem] overflow-hidden shadow-2xl relative flex flex-col border-4 border-orange-500">
              {/* Top Section - Brand/Header */}
              <div className="bg-orange-600 p-6 text-white text-center relative">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[length:20px_20px]"></div>
                <div className="text-3xl mb-1">🕉️</div>
                <h4 className="text-xl font-black uppercase tracking-tighter">Kumbh Mela 2024</h4>
                <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest mt-1">Special Darshan Pass</p>
                
                {/* Hologram Strip */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 via-yellow-200 to-orange-400 animate-pulse"></div>
              </div>

              {/* Middle Section - Ticket Content */}
              <div className="p-8 space-y-6 relative bg-white">
                {/* Status Badge */}
                <div className="absolute top-4 right-4 flex items-center bg-green-50 px-3 py-1 rounded-full border border-green-100">
                   <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                   <span className="text-[10px] font-black text-green-700 uppercase">ACTIVE</span>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pilgrim Name</p>
                    <p className="text-lg font-black text-slate-900">{MOCK_USER.name}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pass ID</p>
                      <p className="font-mono font-black text-slate-800">{bookingStatus.id}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sector</p>
                      <p className="font-black text-slate-800">Inner Sanctum</p>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 text-center">Time Slot Validity</p>
                    <p className="text-xl font-black text-orange-600 text-center">{bookingStatus.timeSlot}</p>
                  </div>
                </div>

                {/* QR Code Area */}
                <div className="flex flex-col items-center justify-center space-y-3 pt-2">
                  <div className="p-3 bg-white border-4 border-slate-100 rounded-3xl shadow-sm group">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${bookingStatus.id}-${MOCK_USER.name}`} 
                      alt="QR Code" 
                      className="w-40 h-40 object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center">Scan at Entry Gate (Gate A)</p>
                </div>
              </div>

              {/* Bottom Section - Tear-off style */}
              <div className="bg-slate-50 p-4 border-t-2 border-dashed border-slate-200 relative">
                {/* Decorative Side Cutouts */}
                <div className="absolute -left-3 -top-3 w-6 h-6 bg-slate-900/80 rounded-full"></div>
                <div className="absolute -right-3 -top-3 w-6 h-6 bg-slate-900/80 rounded-full"></div>

                <div className="flex items-center justify-between">
                  <div className="text-[10px] text-slate-400 font-medium">
                    <p>Issue Date: Oct 2024</p>
                    <p>Digital Security Hash: 8XF2-9921-JK0L</p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-2 bg-white rounded-xl shadow-sm border border-slate-200 hover:bg-slate-100 transition-colors">
                      <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </button>
                    <button className="p-2 bg-white rounded-xl shadow-sm border border-slate-200 hover:bg-slate-100 transition-colors">
                      <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Hint Text */}
            <p className="mt-6 text-center text-white/60 text-[10px] font-bold uppercase tracking-widest">
              Please present this pass to temple authorities upon request
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
