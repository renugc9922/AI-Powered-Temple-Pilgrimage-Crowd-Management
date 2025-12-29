
import React, { useState, useEffect } from 'react';
import { UserRole, LoginMethod } from '../types';

interface LoginScreenProps {
  onLogin: (role: UserRole, identity: string) => void;
}

// Mock Registry provided by "Main Head"
const STAFF_REGISTRY = [
  { id: 'STAFF123', password: 'password123' },
  { id: 'ADMIN001', password: 'admin@kumbh' },
  { id: 'MEDIC99', password: 'medic@safe' },
  { id: 'POLICE100', password: 'security@kumbh' }
];

type LoginStep = 'gate' | 'verify' | 'role';
type UserPath = 'devotee' | 'authorized';

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [step, setStep] = useState<LoginStep>('gate');
  const [path, setPath] = useState<UserPath | null>(null);
  const [method, setMethod] = useState<LoginMethod>(LoginMethod.PHONE);
  const [value, setValue] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const validate = () => {
    if (!value.trim()) return "Please enter your identification credentials.";
    
    if (path === 'authorized') {
      if (!password.trim()) return "Password is required for authorized access.";
      return null;
    }

    const cleanValue = value.replace(/\s/g, '');
    switch (method) {
      case LoginMethod.PHONE:
        return /^\d{10}$/.test(cleanValue) ? null : "Please enter a valid 10-digit mobile number.";
      case LoginMethod.AADHAR:
        return /^\d{12}$/.test(cleanValue) ? null : "Aadhar must be exactly 12 digits.";
      case LoginMethod.PAN:
        return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value.toUpperCase()) ? null : "Invalid PAN format.";
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
    
    setTimeout(() => {
      setIsVerifying(false);
      const cleanID = value.toUpperCase().trim();
      
      if (path === 'authorized') {
        const staff = STAFF_REGISTRY.find(s => s.id === cleanID && s.password === password);
        if (!staff) {
          setError("Access Denied: Invalid Staff ID or Password combination.");
          return;
        }
        setStep('role');
      } else {
        // Devotees go straight to pilgrim dashboard
        onLogin(UserRole.PILGRIM, value);
      }
    }, 1500);
  };

  const selectPath = (selectedPath: UserPath) => {
    setPath(selectedPath);
    setMethod(selectedPath === 'devotee' ? LoginMethod.PHONE : LoginMethod.AADHAR);
    setStep('verify');
    setError(null);
    setValue('');
    setPassword('');
  };

  return (
    <div className={`min-h-screen bg-slate-50 flex items-center justify-center p-4 transition-opacity duration-1000 ${isMounted ? 'opacity-100' : 'opacity-0'}`}>
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-[0.03]">
        <div className="absolute -top-24 -left-24 w-96 h-96 border-[40px] border-orange-600 rounded-full"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 border-[40px] border-orange-600 rounded-full"></div>
      </div>

      <div className="bg-white max-w-lg w-full rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden relative border border-slate-100 transform transition-all duration-500">
        
        {/* Dynamic Header */}
        <div className={`p-10 text-center text-white relative transition-colors duration-500 ${
          path === 'authorized' ? 'bg-gradient-to-br from-slate-800 to-slate-950' : 'bg-gradient-to-br from-orange-500 to-orange-600'
        }`}>
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          <div className="relative z-10">
            <div className="inline-block p-4 bg-white/20 backdrop-blur-xl rounded-3xl mb-4 shadow-inner">
              <span className="text-5xl drop-shadow-lg block animate-pulse">
                {path === 'authorized' ? '🛡️' : '🕉️'}
              </span>
            </div>
            <h1 className="text-3xl font-black tracking-tighter uppercase mb-1">KumbhAI</h1>
            <p className="text-white/80 text-[10px] font-black tracking-[0.2em] uppercase opacity-80">
              {step === 'gate' ? 'Divine Gateway' : path === 'authorized' ? 'SECURE STAFF ACCESS' : 'DEVOTEE ENTRY'}
            </p>
          </div>
        </div>
        
        <div className="p-8 sm:p-10">
          {step === 'gate' ? (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-700">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Identify Your Gateway</h2>
                <p className="text-slate-400 text-sm mt-2">Choose the appropriate portal to continue.</p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <GateOption 
                  title="Pilgrims / Devotee"
                  desc="Darshan pass, navigation & safety"
                  icon="🙏"
                  color="orange"
                  onClick={() => selectPath('devotee')}
                />
                <GateOption 
                  title="Authorized Member"
                  desc="Security, Medical & Management"
                  icon="👮"
                  color="slate"
                  onClick={() => selectPath('authorized')}
                />
              </div>
            </div>
          ) : step === 'verify' ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="flex items-center justify-between">
                <button onClick={() => setStep('gate')} className="text-[10px] font-black text-slate-400 hover:text-orange-600 transition-colors flex items-center bg-slate-50 px-3 py-1.5 rounded-full">
                  ← BACK
                </button>
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Verification</span>
              </div>

              <div className="text-center">
                <h2 className="text-2xl font-black text-slate-900">{path === 'authorized' ? 'Staff Login' : 'Devotee Login'}</h2>
                <p className="text-slate-400 text-sm mt-1">
                  {path === 'authorized' ? 'Enter ID provided by Head Office' : 'Verify using mobile or ID card'}
                </p>
              </div>

              {path === 'devotee' && (
                <div className="flex justify-center space-x-2">
                  {[LoginMethod.PHONE, LoginMethod.AADHAR].map((m) => (
                    <button 
                      key={m}
                      onClick={() => { setMethod(m); setValue(''); setError(null); }}
                      className={`px-4 py-2 rounded-xl border-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                        method === m ? 'bg-orange-50 border-orange-500 text-orange-600 shadow-md scale-105' : 'bg-white border-slate-100 text-slate-300'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              )}

              <div className="space-y-3">
                <div className="relative">
                  <input 
                    type="text"
                    value={value}
                    onChange={(e) => { setValue(e.target.value); setError(null); }}
                    placeholder={path === 'authorized' ? 'Unique Staff ID' : `Enter ${method}`}
                    className={`w-full p-4 bg-slate-50 border-2 rounded-2xl focus:border-orange-500 outline-none font-bold text-slate-800 transition-all text-center ${error ? 'border-red-200' : 'border-slate-100'}`}
                  />
                </div>

                {path === 'authorized' && (
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setError(null); }}
                      placeholder="Security Password"
                      className={`w-full p-4 bg-slate-50 border-2 rounded-2xl focus:border-slate-800 outline-none font-bold text-slate-800 transition-all text-center ${error ? 'border-red-200' : 'border-slate-100'}`}
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
                    >
                      {showPassword ? '👁️' : '🔒'}
                    </button>
                  </div>
                )}
                
                {error && (
                  <p className="text-[10px] text-red-500 font-bold text-center uppercase tracking-wider animate-pulse">{error}</p>
                )}
              </div>

              <button 
                onClick={handleVerify}
                disabled={isVerifying || !value.trim()}
                className={`w-full text-white py-5 rounded-2xl font-black transition-all flex items-center justify-center space-x-3 text-sm tracking-widest uppercase shadow-xl active:scale-95 ${
                  path === 'authorized' ? 'bg-slate-900 hover:bg-black' : 'bg-orange-600 hover:bg-orange-700'
                }`}
              >
                {isVerifying ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <span>Log In</span>
                )}
              </button>
              
              {path === 'authorized' && (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                   <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-2">Internal Staff Directory</p>
                   <div className="flex flex-wrap justify-center gap-2">
                      <span className="text-[8px] bg-white px-2 py-1 rounded border font-mono">ID: STAFF123 | Pass: password123</span>
                      <span className="text-[8px] bg-white px-2 py-1 rounded border font-mono">ID: ADMIN001 | Pass: admin@kumbh</span>
                   </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-700">
              <div className="text-center pb-4">
                <h2 className="text-2xl font-black text-slate-900">Station Allocation</h2>
                <p className="text-slate-400 text-sm mt-1">Verification complete. Select your post.</p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <RoleCard title="Operations Admin" desc="Central Hub Command" icon="📊" color="blue" onClick={() => onLogin(UserRole.ADMIN, value)} />
                <RoleCard title="Security Sector" desc="Crowd & Surveillance" icon="👮" color="slate" onClick={() => onLogin(UserRole.SECURITY, value)} />
                <RoleCard title="Medical Support" desc="Emergency Triage" icon="🚑" color="red" onClick={() => onLogin(UserRole.MEDICAL, value)} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const GateOption: React.FC<{ title: string; desc: string; icon: string; color: 'orange' | 'slate'; onClick: () => void; }> = ({ title, desc, icon, color, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center p-5 rounded-[1.5rem] border-2 transition-all group text-left ${
    color === 'orange' ? 'border-orange-50 hover:border-orange-400 hover:bg-orange-50' : 'border-slate-50 hover:border-slate-400 hover:bg-slate-50'
  }`}>
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mr-5 shadow-sm transition-transform group-hover:scale-110 ${
      color === 'orange' ? 'bg-orange-100' : 'bg-slate-100'
    }`}>
      {icon}
    </div>
    <div className="flex-1">
      <h3 className="font-black text-slate-900 text-base">{title}</h3>
      <p className="text-[11px] text-slate-400 font-medium leading-tight">{desc}</p>
    </div>
    <div className="text-slate-200 group-hover:translate-x-1 transition-all">→</div>
  </button>
);

const RoleCard: React.FC<{ title: string; desc: string; icon: string; color: string; onClick: () => void; }> = ({ title, desc, icon, color, onClick }) => {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100 hover:border-blue-500',
    slate: 'bg-slate-50 text-slate-600 border-slate-100 hover:border-slate-500',
    red: 'bg-red-50 text-red-600 border-red-100 hover:border-red-500'
  };
  return (
    <button onClick={onClick} className={`w-full flex items-center p-4 rounded-2xl border-2 transition-all group ${colorMap[color]} text-left`}>
      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-xl mr-4 group-hover:rotate-12 transition-transform shadow-sm">
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="font-black text-slate-900 text-sm">{title}</h3>
        <p className="text-[9px] text-slate-400 font-bold uppercase">{desc}</p>
      </div>
      <span className="opacity-0 group-hover:opacity-100 transition-opacity">›</span>
    </button>
  );
};
