
import React, { useState, useEffect, useMemo } from 'react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { LOCATIONS } from '../constants';
import { getCrowdAnalysis, getSearchGroundedInfo } from '../services/geminiService';
import { Alert as AlertType, UserRole, Severity } from '../types';

interface AdminDashboardProps {
  alerts: AlertType[];
  role: UserRole;
  onResolve?: (id: string) => void;
  onClearResolved?: () => void;
  onClearAll?: () => void;
  onAddAlert?: (alert: Omit<AlertType, 'id' | 'timestamp' | 'resolved'>) => void;
}

const SEVERITY_PRIORITY: Record<string, number> = {
  'Critical': 1,
  'Emergency': 2,
  'Warning': 3,
  'Info': 4
};

const StatCard: React.FC<{ title: string; value: string; change: string; color: string; icon: string }> = ({ title, value, change, color, icon }) => {
  const colors: Record<string, string> = {
    blue: 'text-blue-600 bg-blue-50 border-blue-100',
    red: 'text-red-600 bg-red-50 border-red-100',
    green: 'text-green-600 bg-green-50 border-green-100',
    orange: 'text-orange-600 bg-orange-50 border-orange-100',
  };
  return (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-200/60 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
      <div className="flex justify-between items-start mb-4">
        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-xl shadow-inner">
          {icon}
        </div>
        <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-tighter ${colors[color] || colors.blue}`}>
          {change}
        </span>
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
      <h4 className="text-3xl font-black text-slate-900 tracking-tighter">{value}</h4>
    </div>
  );
};

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ alerts, role, onResolve, onClearResolved, onClearAll, onAddAlert }) => {
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [activeTab, setActiveTab] = useState<'ops' | 'search' | 'surveillance' | 'notifications' | 'command'>(
    role === UserRole.ADMIN ? 'ops' : 'ops'
  );
  
  // Dispatch states
  const [dispatchTarget, setDispatchTarget] = useState<'Security' | 'Medical' | 'Emergency'>('Security');
  const [dispatchMessage, setDispatchMessage] = useState('');
  const [dispatchSeverity, setDispatchSeverity] = useState<Severity>('Warning');
  const [dispatchLocation, setDispatchLocation] = useState(LOCATIONS[0].name);
  const [isDispatching, setIsDispatching] = useState(false);

  const [searchQuery, setSearchQuery] = useState('Current weather and spiritual events at Sangam, Prayagraj');
  const [searchResult, setSearchResult] = useState<any>(null);
  const [loadingSearch, setLoadingSearch] = useState(false);

  const handleSearch = async () => {
    setLoadingSearch(true);
    const result = await getSearchGroundedInfo(searchQuery);
    setSearchResult(result);
    setLoadingSearch(false);
  };

  const handleDispatch = () => {
    if (!dispatchMessage.trim() || !onAddAlert) return;
    setIsDispatching(true);
    
    setTimeout(() => {
      onAddAlert({
        type: dispatchTarget as any,
        message: dispatchMessage,
        severity: dispatchSeverity,
        location: dispatchLocation,
      });
      setDispatchMessage('');
      setIsDispatching(false);
    }, 800);
  };

  const filteredAlerts = useMemo(() => {
    let roleFiltered = alerts;
    if (role === UserRole.SECURITY) {
      roleFiltered = alerts.filter(a => ['Crowd', 'Security', 'Emergency'].includes(a.type));
    } else if (role === UserRole.MEDICAL) {
      roleFiltered = alerts.filter(a => ['Medical', 'Emergency'].includes(a.type));
    }
    // ADMIN sees everything
    return [...roleFiltered].sort((a, b) => {
      if (a.resolved !== b.resolved) return a.resolved ? 1 : -1;
      return (SEVERITY_PRIORITY[a.severity] || 99) - (SEVERITY_PRIORITY[b.severity] || 99);
    });
  }, [alerts, role]);

  const activeCount = filteredAlerts.filter(a => !a.resolved).length;
  const mostUrgentAlert = useMemo(() => filteredAlerts.find(a => !a.resolved && (a.severity === 'Critical' || a.severity === 'Emergency')), [filteredAlerts]);

  const handleAiRefresh = async () => {
    setLoadingAi(true);
    const result = await getCrowdAnalysis(LOCATIONS);
    setAiAnalysis(result);
    setLoadingAi(false);
  };

  useEffect(() => { handleAiRefresh(); }, [alerts.length]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Tabbed Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex space-x-1 bg-slate-200/60 p-1.5 rounded-2xl w-fit overflow-x-auto no-scrollbar shadow-inner backdrop-blur-md">
          {[
            { id: 'ops', label: 'Operations', icon: '🏠' },
            ...(role === UserRole.ADMIN ? [{ id: 'command', label: 'Command', icon: '📡' }] : []),
            { id: 'surveillance', label: 'Surveillance', icon: '🎥' },
            { id: 'search', label: 'Intelligence', icon: '🔍' },
            { id: 'notifications', label: 'History', icon: '🔔' }
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all whitespace-nowrap flex items-center tracking-tight ${activeTab === tab.id ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-500 hover:text-slate-900'}`}
            >
              <span className="mr-2 opacity-70">{tab.icon}</span>
              {tab.label}
              {tab.id === 'notifications' && activeCount > 0 && <span className="ml-2 w-1.5 h-1.5 bg-red-500 rounded-full"></span>}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'ops' ? (
        <div className="space-y-8">
          {mostUrgentAlert && (
            <div className="bg-red-600 text-white p-6 rounded-[2.5rem] shadow-2xl animate-in slide-in-from-top-4 duration-500 flex items-center justify-between overflow-hidden relative">
              <div className="absolute inset-0 shimmer opacity-20 pointer-events-none"></div>
              <div className="flex items-center space-x-6 relative z-10">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-2xl">🚨</div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80 mb-1">Sector Priority Alpha</p>
                  <p className="text-xl font-black tracking-tight">{mostUrgentAlert.message}</p>
                  <p className="text-xs opacity-70 font-bold uppercase mt-1">Zone: {mostUrgentAlert.location}</p>
                </div>
              </div>
              <button 
                onClick={() => onResolve?.(mostUrgentAlert.id)}
                className="bg-white text-red-600 px-8 py-3 rounded-2xl font-black text-xs hover:scale-105 transition-all shadow-xl relative z-10 uppercase tracking-widest"
              >
                INTERVENE
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Crowd Density" value="4,281" change="+12% Peak" color="blue" icon="👥" />
            <StatCard title="Avg. Wait Time" value="42m" change="Flow-Optimized" color="orange" icon="⏳" />
            <StatCard title="Active Inbound" value="1.2k" change="Stable" color="green" icon="⛩️" />
            <StatCard title="Incident Response" value="1.8m" change="-30% Avg" color="red" icon="⚡" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
               <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden h-80">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-sm font-black text-slate-800 flex items-center uppercase tracking-widest">
                       Telemetry Trends
                    </h3>
                  </div>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={[{t:'12:00',f:400},{t:'13:00',f:300},{t:'14:00',f:600},{t:'15:00',f:800},{t:'16:00',f:500},{t:'17:00',f:700}]}>
                      <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="t" hide />
                      <YAxis hide />
                      <Tooltip contentStyle={{borderRadius:'16px', border:'none', boxShadow:'0 10px 25px rgba(0,0,0,0.1)', fontWeight:'bold'}} />
                      <Area type="monotone" dataKey="f" stroke="#f97316" fill="url(#colorFlow)" strokeWidth={4} />
                      <defs>
                        <linearGradient id="colorFlow" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f97316" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                    </AreaChart>
                  </ResponsiveContainer>
               </div>

               <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/40">
                    <h3 className="font-black text-slate-800 text-xs uppercase tracking-widest flex items-center">
                      <span className="mr-3">📋</span> Deployment Log
                    </h3>
                    <button onClick={onClearResolved} className="text-[10px] font-black text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">Clean Log</button>
                  </div>
                  <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto no-scrollbar">
                    {filteredAlerts.length > 0 ? filteredAlerts.map(alert => (
                      <div key={alert.id} className={`p-6 transition-all ${alert.resolved ? 'opacity-40 grayscale' : 'hover:bg-slate-50'}`}>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-5">
                            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-xl shadow-inner">
                              {alert.type === 'Crowd' ? '👥' : alert.type === 'Medical' ? '🚑' : alert.type === 'Security' ? '👮' : '🚨'}
                            </div>
                            <div>
                              <div className="flex items-center space-x-2 mb-1">
                                <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-lg ${alert.severity === 'Critical' ? 'bg-red-600 text-white' : alert.severity === 'Emergency' ? 'bg-orange-600 text-white' : 'bg-slate-200 text-slate-600'}`}>{alert.severity}</span>
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{new Date(alert.timestamp).toLocaleTimeString()}</span>
                              </div>
                              <p className="font-bold text-slate-900 tracking-tight">{alert.message}</p>
                              <p className="text-[11px] font-bold text-slate-400 mt-0.5 uppercase">SECTOR: {alert.location} | TYPE: {alert.type}</p>
                            </div>
                          </div>
                          {!alert.resolved && (
                            <button onClick={() => onResolve?.(alert.id)} className="px-5 py-2.5 bg-blue-50 text-blue-600 text-[10px] font-black rounded-xl hover:bg-blue-100 transition-all uppercase tracking-widest">Resolve</button>
                          )}
                        </div>
                      </div>
                    )) : (
                      <div className="p-20 text-center">
                        <span className="text-5xl opacity-20 block mb-4">✨</span>
                        <p className="text-slate-400 font-black uppercase text-xs tracking-[0.2em]">Zero Active Incidents</p>
                      </div>
                    )}
                  </div>
               </div>
            </div>

            <div className="space-y-8">
               <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-1000">
                    <span className="text-[8rem]">🧠</span>
                  </div>
                  <h3 className="text-lg font-black mb-6 flex items-center tracking-tight relative z-10">AI Deployment Logic</h3>
                  
                  {loadingAi ? (
                    <div className="space-y-6 animate-pulse relative z-10">
                       <div className="h-20 bg-white/5 rounded-3xl"></div>
                       <div className="h-40 bg-white/5 rounded-3xl"></div>
                    </div>
                  ) : aiAnalysis ? (
                    <div className="space-y-8 relative z-10">
                       <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md">
                          <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-3">Predicted Safety Threshold</p>
                          <div className="flex items-end justify-between">
                             <span className="text-4xl font-black tracking-tighter">{aiAnalysis.safetyRating}%</span>
                             <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden mb-2">
                                <div className="h-full bg-orange-500 shadow-[0_0_10px_#f97316]" style={{ width: `${aiAnalysis.safetyRating}%` }}></div>
                             </div>
                          </div>
                       </div>
                       
                       <div className="space-y-4">
                          <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Tactical Recommendations</p>
                          <div className="space-y-3">
                             {aiAnalysis.flowRecommendations.slice(0, 3).map((rec: string, i: number) => (
                               <div key={i} className="flex items-start bg-white/5 p-4 rounded-2xl border border-white/5 text-xs font-medium leading-relaxed">
                                 <span className="text-orange-500 mr-3 text-lg">›</span>
                                 {rec}
                               </div>
                             ))}
                          </div>
                       </div>

                       <button onClick={handleAiRefresh} className="w-full py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl text-[10px] font-black transition-all uppercase tracking-[0.2em] shadow-lg shadow-orange-950/20">
                          Recalculate Sector
                       </button>
                    </div>
                  ) : null}
               </div>
            </div>
          </div>
        </div>
      ) : activeTab === 'command' ? (
        <div className="bg-white p-10 rounded-[3rem] border border-slate-200/60 shadow-sm max-w-5xl mx-auto space-y-12 animate-in slide-in-from-bottom-8 duration-500">
          <div className="text-center space-y-3">
             <div className="inline-block bg-slate-900 text-white px-5 py-2 rounded-2xl text-[10px] font-black tracking-widest uppercase mb-4">Tactical Command Center</div>
             <h3 className="text-4xl font-black text-slate-900 tracking-tighter">Emergency Dispatch Unit</h3>
             <p className="text-slate-400 font-medium max-w-xl mx-auto">Issue direct orders to security and medical teams based on real-time intelligence feeds.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
             <div className="space-y-8">
                <div>
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">Target Sector Unit</label>
                   <div className="grid grid-cols-3 gap-3">
                      {['Security', 'Medical', 'Emergency'].map(target => (
                        <button 
                          key={target}
                          onClick={() => setDispatchTarget(target as any)}
                          className={`py-4 rounded-2xl border-2 font-black text-[11px] transition-all uppercase tracking-widest ${
                            dispatchTarget === target 
                              ? 'bg-slate-900 border-slate-900 text-white shadow-xl scale-105' 
                              : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300'
                          }`}
                        >
                          {target}
                        </button>
                      ))}
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                   <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">Sector Location</label>
                      <select 
                        value={dispatchLocation}
                        onChange={(e) => setDispatchLocation(e.target.value)}
                        className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-800 focus:border-slate-900 outline-none transition-all"
                      >
                        {LOCATIONS.map(loc => <option key={loc.id} value={loc.name}>{loc.name}</option>)}
                      </select>
                   </div>
                   <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">Alert Severity</label>
                      <select 
                        value={dispatchSeverity}
                        onChange={(e) => setDispatchSeverity(e.target.value as Severity)}
                        className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-800 focus:border-slate-900 outline-none transition-all"
                      >
                        <option value="Info">Info (Routine)</option>
                        <option value="Warning">Warning (Alert)</option>
                        <option value="Emergency">Emergency (Immediate)</option>
                        <option value="Critical">Critical (Danger)</option>
                      </select>
                   </div>
                </div>

                <div>
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">Command Directive</label>
                   <textarea 
                     value={dispatchMessage}
                     onChange={(e) => setDispatchMessage(e.target.value)}
                     className="w-full h-40 p-6 bg-slate-50 border-2 border-slate-100 rounded-3xl font-bold text-slate-800 focus:border-slate-900 outline-none transition-all resize-none shadow-inner"
                     placeholder="Type directive for the team..."
                   />
                </div>

                <button 
                  onClick={handleDispatch}
                  disabled={isDispatching || !dispatchMessage.trim()}
                  className="w-full bg-orange-600 text-white py-6 rounded-[2.5rem] font-black hover:bg-orange-700 transition-all shadow-2xl flex items-center justify-center space-x-3 uppercase tracking-[0.2em] text-sm disabled:opacity-50"
                >
                  {isDispatching ? (
                    <>
                      <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Transmitting...</span>
                    </>
                  ) : (
                    <>
                      <span>📡 DISPATCH DIRECTIVE</span>
                    </>
                  )}
                </button>
             </div>

             <div className="space-y-8">
                <div className="bg-slate-50 border border-slate-200 rounded-[2.5rem] p-8 space-y-6">
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                     <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3 animate-pulse"></span>
                     Live Unit Status
                   </h4>
                   <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                         <span className="text-xs font-black text-slate-800 uppercase tracking-tighter">Security Sector-A</span>
                         <span className="text-[9px] bg-green-50 text-green-600 px-2 py-1 rounded font-black uppercase">Active</span>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                         <span className="text-xs font-black text-slate-800 uppercase tracking-tighter">Security Sector-B</span>
                         <span className="text-[9px] bg-green-50 text-green-600 px-2 py-1 rounded font-black uppercase">Active</span>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                         <span className="text-xs font-black text-slate-800 uppercase tracking-tighter">Medical Triage-1</span>
                         <span className="text-[9px] bg-blue-50 text-blue-600 px-2 py-1 rounded font-black uppercase">Available</span>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                         <span className="text-xs font-black text-slate-800 uppercase tracking-tighter">Medical Triage-2</span>
                         <span className="text-[9px] bg-red-50 text-red-600 px-2 py-1 rounded font-black uppercase">Busy</span>
                      </div>
                   </div>
                </div>

                <div className="bg-slate-950 p-8 rounded-[2.5rem] shadow-xl text-white">
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-6">Dispatch History Preview</p>
                   <div className="space-y-4 max-h-[200px] overflow-y-auto no-scrollbar">
                      {alerts.filter(a => a.severity === 'Emergency' || a.severity === 'Critical').slice(0, 3).map(a => (
                        <div key={a.id} className="border-l-2 border-orange-500 pl-4 py-2">
                           <p className="text-[10px] font-black text-slate-500 uppercase tracking-tighter mb-1">{new Date(a.timestamp).toLocaleTimeString()}</p>
                           <p className="text-xs font-bold leading-snug">{a.message}</p>
                        </div>
                      ))}
                   </div>
                </div>
             </div>
          </div>
        </div>
      ) : activeTab === 'search' ? (
        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-200/60 space-y-10">
           <div className="text-center max-w-2xl mx-auto space-y-2">
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">Ground Intelligence</h3>
              <p className="text-slate-400 font-medium">Verified real-time search grounding for situational awareness across the Mela.</p>
           </div>
           
           <div className="flex flex-col sm:flex-row gap-3">
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 p-6 bg-slate-50 border-2 border-slate-100 rounded-3xl font-bold text-slate-800 focus:border-orange-500 outline-none transition-all shadow-inner"
                placeholder="Query for weather, news, or sector updates..."
              />
              <button 
                onClick={handleSearch}
                disabled={loadingSearch}
                className="bg-slate-900 text-white px-10 py-5 rounded-3xl font-black hover:bg-black disabled:opacity-50 transition-all uppercase tracking-widest shadow-xl flex items-center justify-center"
              >
                {loadingSearch ? 'VERIFYING...' : 'ANALYZE'}
              </button>
           </div>

           {searchResult && (
             <div className="p-8 bg-slate-50/50 rounded-[2.5rem] border border-slate-100 space-y-8 animate-in zoom-in-95 duration-500">
                <div className="prose prose-slate max-w-none">
                   <p className="text-slate-700 leading-relaxed font-medium text-lg italic">"{searchResult.text}"</p>
                </div>
                {searchResult.sources?.length > 0 && (
                  <div className="pt-8 border-t border-slate-200/60">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Grounded Verification Nodes</p>
                     <div className="flex flex-wrap gap-3">
                        {searchResult.sources.map((source: any, idx: number) => (
                          <a key={idx} href={source.web?.uri} target="_blank" rel="noopener noreferrer" className="bg-white px-5 py-2.5 rounded-2xl border border-slate-200 text-[10px] font-black text-blue-600 hover:border-blue-500 transition-all shadow-sm">
                            {source.web?.title || 'External Intelligence'}
                          </a>
                        ))}
                     </div>
                  </div>
                )}
             </div>
           )}
        </div>
      ) : activeTab === 'surveillance' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {[1, 2, 3, 4, 5, 6].map(i => (
             <div key={i} className="aspect-video bg-slate-950 rounded-[2.5rem] overflow-hidden relative group shadow-xl">
                <img src={`https://picsum.photos/seed/kumbh-cam-${i}/1200/800?grayscale`} alt={`Sector ${i}`} className="w-full h-full object-cover opacity-50 group-hover:scale-110 transition-transform duration-1000 group-hover:opacity-70" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="absolute top-6 left-6 flex items-center space-x-3">
                   <div className="w-2.5 h-2.5 bg-red-600 rounded-full animate-pulse shadow-[0_0_10px_red]"></div>
                   <span className="text-[11px] font-black text-white uppercase tracking-widest">SECTOR-00{i} LIVE FEED</span>
                </div>
                <div className="absolute bottom-6 left-6 flex items-center space-x-4">
                    <div className="text-[10px] font-black text-white/50 uppercase tracking-widest bg-white/10 px-3 py-1.5 rounded-lg border border-white/10 backdrop-blur-md">
                       PITCH: 22.4°
                    </div>
                    <div className="text-[10px] font-black text-white/50 uppercase tracking-widest bg-white/10 px-3 py-1.5 rounded-lg border border-white/10 backdrop-blur-md">
                       ZOOM: 2.4X
                    </div>
                </div>
             </div>
           ))}
        </div>
      ) : activeTab === 'notifications' ? (
        <div className="bg-white p-10 rounded-[3rem] border border-slate-200/60 shadow-sm max-w-4xl mx-auto">
           <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Transmission Logs</h3>
              <button onClick={onClearAll} className="text-[10px] font-black text-red-500 hover:text-red-700 uppercase tracking-widest">Wipe Terminal</button>
           </div>
           <div className="space-y-6">
              {filteredAlerts.length > 0 ? filteredAlerts.map(alert => (
                <div key={alert.id} className="flex items-start space-x-6 p-6 rounded-[2rem] bg-slate-50/50 border border-slate-100/60 transition-all hover:bg-slate-50">
                   <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm border border-slate-100">
                     {alert.type === 'Security' ? '👮' : alert.type === 'Medical' ? '🚑' : '📡'}
                   </div>
                   <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                         <p className="text-sm font-black text-slate-900 tracking-tight">{alert.message}</p>
                         <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{new Date(alert.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">SECTOR: {alert.location} | TYPE: {alert.type}</p>
                   </div>
                </div>
              )) : (
                <div className="text-center py-20">
                   <p className="text-slate-300 font-black uppercase text-xs tracking-widest">End of Stream</p>
                </div>
              )}
           </div>
        </div>
      ) : null}
    </div>
  );
};
