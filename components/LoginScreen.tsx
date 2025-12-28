
import React, { useState, useEffect } from 'react';
import { UserRole, LoginMethod } from '../types';

interface LoginScreenProps {
  onLogin: (role: UserRole, identity: string) => void;
}

const AUTHORIZED_STAFF_IDS = ['STAFF123', '999988887777', 'ADMIN001', 'MEDIC99', 'POLICE100'];

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [step, setStep] = useState<'verify' | 'role'>('verify');
  const [method, setMethod] = useState<LoginMethod>(LoginMethod.PHONE);
  const [value, setValue] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const validate = () => {
    if (!value.trim()) return "Please enter your identification credentials.";
    
    const cleanValue = value.replace(/\s/g, '');
    
    // Special bypass for demo key
    if (cleanValue.toUpperCase() === 'STAFF123') return null;

    switch (method) {
      case LoginMethod.PHONE:
        return /^\d{10}$/.test(cleanValue) ? null : "Please enter a valid 10-digit mobile number.";
      case LoginMethod.AADHAR:
        return /^\d{12}$/.test(cleanValue) ? null : "Aadhar must be exactly 12 digits.";
      case LoginMethod.PAN:
        return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value.toUpperCase()) ? null : "Invalid PAN format (e.g., ABCDE1234F).";
      case LoginMethod.EMAIL:
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? null : "Please enter a valid email address.";
      default:
        return null;
    }
  };

  const handleVerify = () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setIsVerifying(true);
    
    // Simulate divine verification delay
    setTimeout(() => {
      setIsVerifying(false);
      setStep('role');
    }, 1500);
  };

  const handleSelectRole = (role: UserRole) => {
    const cleanValue = value.toUpperCase().replace(/\s/g, '');
    const isStaff = role !== UserRole.PILGRIM;
    const isAuthorized = AUTHORIZED_STAFF_IDS.includes(cleanValue);

    if (isStaff && !isAuthorized) {
      setError(`Sector Access Denied: ID "${value}" is not listed in the specialized command database.`);
      return;
    }

    onLogin(role, value);
  };

  return (
    <div className={`min-h-screen bg-slate-50 flex items-center justify-center p-4 transition-opacity duration-1000 ${isMounted ? 'opacity-100' : 'opacity-0'}`}>
      {/* Decorative background pattern */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-[0.03]">
        <div className="absolute -top-24 -left-24 w-96 h-96 border-[40px] border-orange-600 rounded-full"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 border-[40px] border-orange-600 rounded-full"></div>
      </div>

      <div className="bg-white max-w-md w-full rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden relative border border-slate-100 transform transition-all duration-500 hover:shadow-[0_30px_60px_rgba(249,115,22,0.15)]">
        
        {/* Header Section */}
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-12 text-center text-white relative">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          <div className="relative z-10">
            <div className="inline-block p-4 bg-white/20 backdrop-blur-xl rounded-3xl mb-4 shadow-inner">
              <span className="text-5xl drop-shadow-lg block animate-pulse">🕉️</span>
            </div>
            <h1 className="text-3xl font-black tracking-tighter uppercase mb-1">KumbhAI</h1>
            <p className="text-orange-100 text-xs font-bold tracking-[0.3em] uppercase opacity-80">Divine Gatekeeper</p>
          </div>
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-white rotate-45 rounded-lg border-t border-l border-slate-100"></div>
        </div>
        
        <div className="p-10 pt-12">
          {step === 'verify' ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both">
              <div className="text-center">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Identity Access</h2>
                <p className="text-slate-400 text-sm mt-2 font-medium">Verify your credentials to begin the journey.</p>
              </div>

              {/* Method Selection */}
              <div className="grid grid-cols-4 gap-3">
                {[
                  { m: LoginMethod.PHONE, i: "📱", l: "Phone" },
                  { m: LoginMethod.AADHAR, i: "🆔", l: "Aadhar" },
                  { m: LoginMethod.PAN, i: "💳", l: "PAN" },
                  { m: LoginMethod.EMAIL, i: "📧", l: "Email" }
                ].map(({ m, i, l }) => (
                  <button 
                    key={m}
                    onClick={() => { setMethod(m); setValue(''); setError(null); }}
                    className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-300 group ${
                      method === m 
                        ? 'bg-orange-50 border-orange-500 shadow-[0_8px_20px_-5px_rgba(249,115,22,0.3)] scale-105' 
                        : 'bg-white border-slate-50 hover:border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span className={`text-2xl mb-1 group-hover:scale-110 transition-transform duration-300 ${method === m ? 'animate-bounce' : 'grayscale opacity-60'}`}>{i}</span>
                    <span className={`text-[9px] font-black uppercase tracking-wider ${method === m ? 'text-orange-600' : 'text-slate-400'}`}>{l}</span>
                  </button>
                ))}
              </div>

              {/* Input Section */}
              <div className="space-y-3">
                <div className="relative group">
                  <input 
                    type={method === LoginMethod.EMAIL ? 'email' : 'text'}
                    value={value}
                    onChange={(e) => { setValue(e.target.value); setError(null); }}
                    placeholder={
                      method === LoginMethod.PHONE ? '9876543210' :
                      method === LoginMethod.AADHAR ? '0000 0000 0000' :
                      method === LoginMethod.PAN ? 'ABCDE1234F' : 'your@email.com'
                    }
                    className={`w-full p-5 bg-slate-50 border-2 ${error ? 'border-red-200 ring-4 ring-red-50' : 'border-slate-100'} rounded-3xl focus:ring-8 focus:ring-orange-500/10 focus:border-orange-500 outline-none font-bold text-slate-800 transition-all text-xl placeholder:text-slate-300 text-center tracking-tight`}
                  />
                  {error && (
                    <div className="absolute -top-12 left-0 right-0 animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="bg-red-500 text-white text-[10px] font-bold px-4 py-2 rounded-full shadow-lg mx-auto w-fit flex items-center space-x-2">
                        <span>⚠️</span>
                        <span>{error}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Verify Button */}
              <button 
                onClick={handleVerify}
                disabled={isVerifying || !value.trim()}
                className="w-full relative overflow-hidden group bg-slate-900 text-white py-6 rounded-3xl font-black hover:bg-black active:scale-[0.97] transition-all shadow-2xl shadow-slate-200 disabled:opacity-50 disabled:grayscale flex items-center justify-center space-x-3 text-sm tracking-[0.2em] uppercase"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-white/5 to-orange-500/0 transform -translate-x-full group-hover:animate-[shimmer_2s_infinite]"></div>
                {isVerifying ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-orange-500" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Consulting Records...</span>
                  </>
                ) : (
                  <span>Verify Identity</span>
                )}
              </button>
              
              <div className="text-center">
                <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                  Authority Demo Key: <span className="text-slate-900 font-black">STAFF123</span>
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-700 fill-mode-both">
              <div className="flex items-center justify-between mb-2">
                 <button 
                  onClick={() => { setStep('verify'); setError(null); }}
                  className="text-xs font-black text-slate-400 hover:text-orange-600 transition-colors flex items-center bg-slate-50 px-4 py-2 rounded-full border border-slate-100"
                >
                  <span className="mr-2">←</span> Change ID
                </button>
                <div className="flex items-center space-x-2 bg-green-50 px-4 py-2 rounded-full border border-green-100">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-[10px] font-black text-green-700 uppercase">Authenticated</span>
                </div>
              </div>

              <div className="text-center pb-4">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Divine Calling</h2>
                <p className="text-slate-400 text-sm mt-2 font-medium">Select your role to proceed into the Mela.</p>
              </div>

              {error && (
                <div className="bg-red-50 border-2 border-red-100 p-5 rounded-3xl text-xs text-red-600 font-bold animate-shake">
                  ⛔ {error}
                </div>
              )}
              
              <div className="grid grid-cols-1 gap-3">
                <RoleOption 
                  title="Pilgrim Access" 
                  desc="Queue Position & Navigation" 
                  icon="🚶" 
                  onClick={() => handleSelectRole(UserRole.PILGRIM)}
                  color="orange"
                />
                <RoleOption 
                  title="Admin Operations" 
                  desc="AI Predictions & Global Stats" 
                  icon="📊" 
                  onClick={() => handleSelectRole(UserRole.ADMIN)}
                  restricted
                  color="blue"
                />
                <RoleOption 
                  title="Security Command" 
                  desc="Real-time Sector Monitoring" 
                  icon="👮" 
                  onClick={() => handleSelectRole(UserRole.SECURITY)}
                  restricted
                  color="slate"
                />
                <RoleOption 
                  title="Medical Triage" 
                  desc="Field Hospital Coordination" 
                  icon="🚑" 
                  onClick={() => handleSelectRole(UserRole.MEDICAL)}
                  restricted
                  color="red"
                />
              </div>
            </div>
          )}
        </div>
      </div>
      
      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
    </div>
  );
};

const RoleOption: React.FC<{ title: string; desc: string; icon: string; onClick: () => void; restricted?: boolean; color: string; }> = ({ title, desc, icon, onClick, restricted, color }) => {
  const colorClasses: any = {
    orange: 'hover:border-orange-500 hover:bg-orange-50 group-hover:bg-orange-100 text-orange-600',
    blue: 'hover:border-blue-500 hover:bg-blue-50 group-hover:bg-blue-100 text-blue-600',
    slate: 'hover:border-slate-800 hover:bg-slate-50 group-hover:bg-slate-200 text-slate-800',
    red: 'hover:border-red-500 hover:bg-red-50 group-hover:bg-red-100 text-red-600'
  };

  return (
    <button 
      onClick={onClick}
      className={`w-full text-left p-5 rounded-[1.8rem] border-2 transition-all duration-300 group flex items-center space-x-5 border-slate-50 bg-white hover:shadow-xl hover:shadow-slate-100 active:scale-[0.98] ${colorClasses[color].split(' group-hover')[0]}`}
    >
      <div className={`text-3xl w-14 h-14 rounded-2xl flex items-center justify-center bg-slate-50 transition-all duration-300 group-hover:scale-110 ${colorClasses[color].split('hover:')[2]}`}>
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex items-center">
          <h3 className="font-black text-slate-900 text-base tracking-tight">{title}</h3>
          {restricted && (
            <span className="ml-3 text-[7px] bg-slate-900 text-white px-2 py-0.5 rounded-full font-black uppercase tracking-widest">Authorized</span>
          )}
        </div>
        <p className="text-xs text-slate-400 font-medium mt-0.5">{desc}</p>
      </div>
      <div className="text-slate-200 group-hover:text-slate-900 transition-colors transform group-hover:translate-x-1 duration-300">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </div>
    </button>
  );
};
