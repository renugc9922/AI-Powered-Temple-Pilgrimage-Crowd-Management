
import React, { useState } from 'react';
import { MOCK_USER } from '../constants';

export const PilgrimDashboard: React.FC = () => {
  const [bookingStatus, setBookingStatus] = useState(MOCK_USER.booking);

  return (
    <div className="space-y-8">
      {/* Welcome & Status */}
      <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold">Namaste, {MOCK_USER.name}</h2>
          <p className="opacity-90">Your Darshan is scheduled for today.</p>
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="bg-white/20 backdrop-blur-md rounded-xl p-4">
              <p className="text-xs uppercase opacity-70">Queue Number</p>
              <p className="text-3xl font-bold">{bookingStatus.queuePosition}</p>
            </div>
            <div className="bg-white/20 backdrop-blur-md rounded-xl p-4">
              <p className="text-xs uppercase opacity-70">Estimated Wait</p>
              <p className="text-3xl font-bold">{bookingStatus.estimatedWaitMinutes}m</p>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 p-8 opacity-20 transform translate-x-4 -translate-y-4">
          <span className="text-9xl">🕉️</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Booking Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Current Booking Details</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-slate-100">
              <span className="text-slate-500">Booking ID</span>
              <span className="font-mono font-bold">{bookingStatus.id}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-slate-100">
              <span className="text-slate-500">Assigned Time Slot</span>
              <span className="font-semibold">{bookingStatus.timeSlot}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-slate-100">
              <span className="text-slate-500">Current Status</span>
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                {bookingStatus.status}
              </span>
            </div>
            <div className="pt-4">
              <button className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800 transition-colors flex items-center justify-center">
                <span className="mr-2">🎟️</span> Download E-Ticket
              </button>
            </div>
          </div>
        </div>

        {/* Live Safety Info */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Live Temple Safety</h3>
          <div className="space-y-4">
            <div className="flex items-center p-3 bg-blue-50 rounded-lg">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-4 text-xl">ℹ️</div>
              <div>
                <p className="text-sm font-bold text-blue-800">Route Update</p>
                <p className="text-xs text-blue-600">Gate B is currently less congested. Use for exit.</p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-green-50 rounded-lg">
              <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center mr-4 text-xl">✅</div>
              <div>
                <p className="text-sm font-bold text-green-800">Darshan Flow</p>
                <p className="text-xs text-green-600">Crowd movement is smooth in the main hall.</p>
              </div>
            </div>
            <div className="pt-4 grid grid-cols-2 gap-3">
              <button className="bg-red-50 text-red-600 py-3 rounded-lg text-sm font-bold border border-red-100 hover:bg-red-100 transition-colors">
                🆘 EMERGENCY SOS
              </button>
              <button className="bg-blue-50 text-blue-600 py-3 rounded-lg text-sm font-bold border border-blue-100 hover:bg-blue-100 transition-colors">
                🏥 FIRST AID LOCATOR
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Map Preview for Pilgrim */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Temple Layout & Safe Zones</h3>
        <div className="relative aspect-video bg-slate-100 rounded-lg border border-slate-200 overflow-hidden">
          <img src="https://picsum.photos/seed/map/1200/600" className="w-full h-full object-cover opacity-50 grayscale" alt="Map" />
          <div className="absolute top-1/2 left-1/4 w-4 h-4 bg-blue-500 rounded-full animate-ping"></div>
          <div className="absolute top-1/2 left-1/4 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-[8px] text-white">YOU</span>
          </div>
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm p-2 rounded shadow-md text-[10px] space-y-1">
            <div className="flex items-center"><span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span> Safe Zone</div>
            <div className="flex items-center"><span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span> High Density</div>
            <div className="flex items-center"><span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span> Restricted</div>
          </div>
        </div>
      </div>
    </div>
  );
};
