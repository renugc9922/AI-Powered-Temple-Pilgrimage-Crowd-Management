
import React, { useState, useEffect, useMemo } from 'react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { LOCATIONS } from '../constants';
import { getCrowdAnalysis, getSearchGroundedInfo } from '../services/geminiService';
import { Alert as AlertType, UserRole } from '../types';
import { ImageGenerator } from './ImageGenerator';

const mockChartData = [
  { time: '08:00', count: 450 },
  { time: '09:00', count: 800 },
  { time: '10:00', count: 1200 },
  { time: '11:00', count: 1500 },
  { time: '12:00', count: 1400 },
  { time: '13:00', count: 1100 },
  { time: '14:00', count: 1800 },
  { time: '15:00', count: 2200 },
];

interface AdminDashboardProps {
  alerts: AlertType[];
  role: UserRole;
  onResolve?: (id: string) => void;
  onClearResolved?: () => void;
  onClearAll?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ alerts, role, onResolve, onClearResolved, onClearAll }) => {
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [activeTab, setActiveTab] = useState<'ops' | 'visuals' | 'search' | 'notifications'>('ops');
  const [searchQuery, setSearchQuery] = useState('Current news and weather events around Prayagraj Kumbh Mela');
  const [searchResult, setSearchResult] = useState<any>(null);
  const [loadingSearch, setLoadingSearch] = useState(false);

  const handleSearch = async () => {
    setLoadingSearch(true);
    const result = await getSearchGroundedInfo(searchQuery);
    setSearchResult(result);
    setLoadingSearch(false);
  };

  // RBAC: Filter alerts based on role specialization
  const filteredAlerts = useMemo(() => {
    if (role === UserRole.ADMIN) return alerts;
    if (role === UserRole.SECURITY) {
      return alerts.filter(a => ['Crowd', 'Security', 'Emergency'].includes(a.type));
    }
    if (role === UserRole.MEDICAL) {
      return alerts.filter(a => ['Medical', 'Emergency'].includes(a.type));
    }
    return [];
  }, [alerts, role]);

  const resolvedCount = filteredAlerts.filter(a => a.resolved).length;
  const totalCount = filteredAlerts.length;

  const getMapPosition = useMemo(() => (lat?: number, lng?: number) => {
    if (!lat || !lng) return { x: 50, y: 50 };
    const x = 20 + ((Math.abs(lng * 10000) % 60));
    const y = 20 + ((Math.abs(lat * 10000) % 60));
    return { x, y };
  }, []);

  const handleAiRefresh = async () => {
    setLoadingAi(true);
    const result = await getCrowdAnalysis(LOCATIONS);
    setAiAnalysis(result);
    setLoadingAi(false);
  };

  const handleClearResolved = () => {
    if (resolvedCount === 0) return;
    const confirm = window.confirm(`Cleanup Action: You are about to remove ${resolvedCount} resolved items for your sector. Continue?`);
    if (confirm) {
      onClearResolved?.();
    }
  };

  useEffect(() => {
    handleAiRefresh();
  }, [alerts.length]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex space-x-1 bg-slate-200 p-1 rounded-xl w-fit">
        <button 
          onClick={() => setActiveTab('ops')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'ops' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
        >
          {role === UserRole.MEDICAL ? 'Triage Center' : role === UserRole.SECURITY ? 'Command Center' : 'Operations Center'}
        </button>
        
        {role === UserRole.ADMIN && (
          <>
            <button 
              onClick={() => setActiveTab('visuals')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'visuals' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Visual Generator
            </button>
            <button 
              onClick={() => setActiveTab('search')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'search' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Ground Search
            </button>
          </>
        )}

        <button 
          onClick={() => setActiveTab('notifications')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'notifications' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
        >
          Notifications {totalCount > 0 && <span className="ml-1 px-1.5 py-0.5 bg-red-500 text-white rounded-full text-[8px]">{totalCount}</span>}
        </button>
      </div>

      {activeTab === 'ops' ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {role === UserRole.MEDICAL ? (
              <>
                <StatCard title="Total Triage Cases" value="24" change="Last 2h" color="red" />
                <StatCard title="Medical Units" value="12" change="Active in Field" color="green" />
                <StatCard title="Wait for Bed" value="8m" change="Emergency Ward" color="orange" />
                <StatCard title="Heat Risk" value="High" change="42°C Forecast" color="blue" />
              </>
            ) : (
              <>
                <StatCard title="Active Pilgrims" value="4,281" change="+12% trend" color="blue" />
                <StatCard title="Zone Density" value="Critical" change="Inner Sanctum" color="red" />
                <StatCard title="On-Duty Units" value="84" change="Police + Medical" color="green" />
                <StatCard title="Est. Wait" value="42m" change="-5m this hour" color="orange" />
              </>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-800">
                  {role === UserRole.MEDICAL ? 'Medical Facility Status' : 'Sector Deployment Map'}
                </h3>
                <span className="flex items-center text-[10px] text-red-600 font-bold bg-red-50 px-2 py-1 rounded-full border border-red-100 uppercase tracking-widest">
                  <span className="w-1.5 h-1.5 bg-red-600 rounded-full mr-2 animate-pulse"></span>
                  Real-time Data
                </span>
              </div>
              
              <div className="relative aspect-[16/9] bg-slate-900 rounded-xl overflow-hidden shadow-inner border border-slate-300">
                <img src={`https://picsum.photos/seed/${role}/1200/675`} className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay" alt="Blueprint" />
                <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,_white_1px,_transparent_1px)] bg-[length:40px_40px]"></div>
                
                {LOCATIONS.map(loc => (
                  <div key={loc.id} className="absolute text-center transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000" style={{ left: `${loc.x}%`, top: `${loc.y}%` }}>
                    <div className={`w-10 h-10 rounded-full heatmap-pulse flex items-center justify-center text-[9px] font-black text-white shadow-2xl border-2 border-white/20 ${loc.id === 'inner-sanctum' ? 'bg-red-500' : 'bg-orange-500'}`}>
                      {role === UserRole.MEDICAL ? 'H' : Math.floor(Math.random() * 500) + 100}
                    </div>
                    <span className="block mt-1 text-[9px] font-bold text-white bg-slate-900/80 px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap">{loc.name}</span>
                  </div>
                ))}

                {filteredAlerts.filter(a => a.type === 'Emergency' && !a.resolved).map(alert => {
                  const pos = getMapPosition(alert.lat, alert.lng);
                  return (
                    <div key={alert.id} className="absolute z-50 transform -translate-x-1/2 -translate-y-1/2" style={{ left: `${pos.x}%`, top: `${pos.y}%` }}>
                       <div className="relative group">
                         <div className="w-20 h-20 bg-red-600 rounded-full animate-ping absolute -inset-5 opacity-20"></div>
                         <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center relative border-4 border-red-600 shadow-[0_0_30px_rgba(220,38,38,0.8)] cursor-pointer hover:scale-110 transition-transform">
                            <span className="text-2xl animate-bounce">🆘</span>
                         </div>
                       </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl border border-slate-800">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold flex items-center">
                  <span className="mr-2 text-blue-400">✨</span> AI Specialization
                </h3>
                <button onClick={handleAiRefresh} disabled={loadingAi} className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors">
                  🔄
                </button>
              </div>
              
              {aiAnalysis ? (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-blue-900/50 to-slate-800 p-4 rounded-xl border border-blue-800/50">
                    <p className="text-[10px] text-blue-300 font-bold uppercase tracking-widest mb-1">Sector Health</p>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-4xl font-black text-blue-400">{aiAnalysis.safetyRating}</span>
                      <span className="text-slate-500 font-medium">/ 100</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-orange-400 uppercase tracking-wider">Expert Advice</h4>
                    <ul className="space-y-2">
                      {aiAnalysis.criticalAlerts?.slice(0, 3).map((alert: string, i: number) => (
                        <li key={i} className="text-[11px] bg-slate-800/50 p-2 rounded-lg border border-slate-700 text-slate-300">
                           {alert}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-slate-500">
                  <div className="w-8 h-8 border-2 border-slate-700 border-t-blue-500 rounded-full animate-spin mb-4"></div>
                  <p className="text-xs font-bold">Generating Insights...</p>
                </div>
              )}
            </div>
          </div>
        </>
      ) : activeTab === 'visuals' ? (
        <ImageGenerator />
      ) : activeTab === 'search' ? (
        <GroundSearch result={searchResult} loading={loadingSearch} onSearch={handleSearch} query={searchQuery} setQuery={setSearchQuery} />
      ) : (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col h-full min-h-[600px]">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2 border-b border-slate-100 pb-4">
            <h3 className="text-lg font-bold text-slate-800 flex items-center">
              <span>{role} Notification Feed</span>
              <span className="ml-3 text-[10px] bg-blue-100 px-2 py-1 rounded-full font-bold text-blue-600">FILTERED FOR YOU</span>
            </h3>
            <div className="flex items-center space-x-2">
              {resolvedCount > 0 && (
                <button 
                  onClick={handleClearResolved} 
                  className="text-[10px] font-black text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-200 px-3 py-1.5 rounded-lg transition-all"
                >
                  CLEAN RESOLVED ({resolvedCount})
                </button>
              )}
            </div>
          </div>
          <div className="space-y-3 flex-1 overflow-y-auto pr-2 pt-4">
            {filteredAlerts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 py-12">
                <span className="text-4xl mb-2">✅</span>
                <p className="text-sm font-medium">No alerts for your specialization.</p>
              </div>
            ) : filteredAlerts.map(alert => (
              <div key={alert.id} className={`p-4 rounded-xl border-l-4 shadow-sm transition-all hover:translate-x-1 ${alert.resolved ? 'bg-slate-50 border-slate-200 opacity-60' : alert.type === 'Emergency' ? 'bg-red-50 border-red-600 ring-2 ring-red-100' : 'bg-white border-slate-300'}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 shrink-0 shadow-sm ${alert.resolved ? 'bg-slate-200 text-slate-400' : 'bg-white text-slate-900 border border-slate-200'}`}>
                      {alert.resolved ? '✓' : alert.type === 'Emergency' ? '🆘' : alert.type === 'Medical' ? '🏥' : '👥'}
                    </div>
                    <div>
                      <h4 className={`text-sm font-black tracking-tight ${alert.resolved ? 'text-slate-400 line-through' : 'text-slate-800'}`}>{alert.message}</h4>
                      <p className="text-[11px] text-slate-500 font-medium mt-1 uppercase tracking-tight">{alert.location} • {new Date(alert.timestamp).toLocaleTimeString()}</p>
                    </div>
                  </div>
                  <button onClick={() => onResolve?.(alert.id)} className="text-[9px] font-bold px-3 py-1.5 rounded-lg border bg-slate-50 hover:bg-slate-100">
                    {alert.resolved ? 'Undo' : 'Resolve'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const GroundSearch: React.FC<any> = ({ result, loading, onSearch, query, setQuery }) => (
  <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 animate-in fade-in zoom-in-95 duration-300">
    <div className="mb-6">
      <h3 className="text-xl font-black text-slate-900">Mela Ground Intelligence</h3>
      <p className="text-sm text-slate-500">Search-grounded information from external news using Gemini 3 Flash.</p>
    </div>
    <div className="flex space-x-4 mb-8">
      <input 
        type="text" 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-1 p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-blue-500 outline-none"
      />
      <button 
        onClick={onSearch}
        disabled={loading}
        className="bg-blue-600 text-white px-8 rounded-xl font-black hover:bg-blue-700 transition-all disabled:opacity-50"
      >
        {loading ? 'SEARCHING...' : 'GROUND SEARCH'}
      </button>
    </div>
    {result && (
      <div className="space-y-6">
        <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100 text-slate-800">
          <div className="prose prose-sm max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap">
            {result.text}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {result.sources?.map((chunk: any, i: number) => chunk.web?.uri && (
            <a key={i} href={chunk.web.uri} target="_blank" className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-[10px] font-bold text-blue-600 shadow-sm">
              🔗 {chunk.web.title || 'View Source'}
            </a>
          ))}
        </div>
      </div>
    )}
  </div>
);

const StatCard: React.FC<{ title: string; value: string; change: string; color: string }> = ({ title, value, change, color }) => {
  const colorMap: any = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    red: 'bg-red-50 text-red-600 border-red-100',
    green: 'bg-green-50 text-green-600 border-green-100',
    orange: 'bg-orange-50 text-orange-600 border-orange-100',
  };
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 transition-all hover:shadow-md">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
      <div className="mt-2 flex items-baseline">
        <h4 className="text-3xl font-black text-slate-900 tracking-tighter">{value}</h4>
      </div>
      <p className={`mt-2 text-[10px] font-black px-2.5 py-1 rounded-full inline-block border ${colorMap[color]}`}>
        {change}
      </p>
    </div>
  );
};
