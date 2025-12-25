
import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { LOCATIONS } from '../constants';
import { getCrowdAnalysis } from '../services/geminiService';

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

export const AdminDashboard: React.FC = () => {
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [activeAlerts, setActiveAlerts] = useState([
    { id: 1, type: 'Crowd', location: 'Gate A', message: 'Density exceeded 80%', severity: 'Critical' },
    { id: 2, type: 'Medical', location: 'Prasad Hall', message: 'Heat exhaustion reported', severity: 'Warning' },
  ]);

  const handleAiRefresh = async () => {
    setLoadingAi(true);
    const result = await getCrowdAnalysis(LOCATIONS);
    setAiAnalysis(result);
    setLoadingAi(false);
  };

  useEffect(() => {
    handleAiRefresh();
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Visitors" value="4,281" change="+12% from avg" color="blue" />
        <StatCard title="Peak Density" value="High" change="Inner Sanctum" color="red" />
        <StatCard title="Security Staff" value="84" change="All zones active" color="green" />
        <StatCard title="Avg Wait Time" value="42m" change="-5m this hour" color="orange" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Real-time Heatmap Simulation */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800">Temple Live Heatmap</h3>
            <span className="flex items-center text-xs text-red-600 font-medium">
              <span className="w-2 h-2 bg-red-600 rounded-full mr-2 animate-ping"></span>
              LIVE CCTV FEED
            </span>
          </div>
          <div className="relative aspect-[16/9] bg-slate-100 rounded-lg overflow-hidden border border-slate-200 flex items-center justify-center">
            <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,_rgba(0,0,0,0.1)_1px,_transparent_1px)] bg-[length:20px_20px]"></div>
            
            {LOCATIONS.map(loc => (
              <div 
                key={loc.id} 
                className="absolute text-center" 
                style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
              >
                <div className={`w-12 h-12 rounded-full heatmap-pulse flex items-center justify-center text-[10px] font-bold text-white shadow-xl ${loc.id === 'inner-sanctum' ? 'bg-red-500' : 'bg-orange-500'}`}>
                  {Math.floor(Math.random() * 500) + 100}
                </div>
                <span className="block mt-1 text-[10px] font-semibold bg-white/80 px-1 rounded shadow-sm">{loc.name}</span>
              </div>
            ))}
            
            <img src="https://picsum.photos/seed/temple/1200/675" className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-30" alt="Blueprint" />
          </div>
        </div>

        {/* AI Insight Sidebar */}
        <div className="bg-slate-900 text-white p-6 rounded-xl shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold flex items-center">
              <span className="mr-2">✨</span> AI Prediction
            </h3>
            <button 
              onClick={handleAiRefresh}
              disabled={loadingAi}
              className="text-xs bg-slate-700 hover:bg-slate-600 px-2 py-1 rounded transition-colors"
            >
              {loadingAi ? 'Analyzing...' : 'Refresh'}
            </button>
          </div>
          
          {aiAnalysis ? (
            <div className="space-y-4">
              <div className="bg-slate-800 p-4 rounded-lg">
                <p className="text-xs text-slate-400 mb-1">Safety Rating</p>
                <div className="flex items-center">
                  <span className="text-3xl font-bold text-green-400">{aiAnalysis.safetyRating}</span>
                  <span className="ml-2 text-sm text-slate-300">/ 100</span>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-orange-400 mb-2">Critical Alerts</h4>
                <ul className="text-xs space-y-2">
                  {aiAnalysis.criticalAlerts.map((alert: string, i: number) => (
                    <li key={i} className="flex items-start">
                      <span className="mr-2 text-red-500">•</span> {alert}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-blue-400 mb-2">Management Actions</h4>
                <ul className="text-xs space-y-2">
                  {aiAnalysis.flowRecommendations.map((rec: string, i: number) => (
                    <li key={i} className="flex items-start">
                      <span className="mr-2 text-blue-500">→</span> {rec}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pt-2 border-t border-slate-800">
                <p className="text-[10px] text-slate-500 italic">
                  Prediction: {aiAnalysis.predictedRiskTrend}
                </p>
              </div>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-slate-500">
              <div className="animate-spin mb-4">🌀</div>
              <p className="text-sm">Generating AI Insights...</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Analysis */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Crowd Trend Analysis</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockChartData}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="count" stroke="#f97316" fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Active Alerts */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Active System Alerts</h3>
          <div className="space-y-3">
            {activeAlerts.map(alert => (
              <div key={alert.id} className={`p-4 rounded-lg flex items-center justify-between border-l-4 ${alert.severity === 'Critical' ? 'bg-red-50 border-red-500' : 'bg-orange-50 border-orange-500'}`}>
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 ${alert.severity === 'Critical' ? 'bg-red-200 text-red-600' : 'bg-orange-200 text-orange-600'}`}>
                    {alert.type === 'Crowd' ? '👥' : '🏥'}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{alert.message}</h4>
                    <p className="text-xs text-slate-500">{alert.location} • 2 mins ago</p>
                  </div>
                </div>
                <button className="text-xs bg-white border border-slate-200 px-3 py-1 rounded-md shadow-sm hover:bg-slate-50 transition-colors">
                  Deploy Unit
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ title: string; value: string; change: string; color: string }> = ({ title, value, change, color }) => {
  const colorMap: any = {
    blue: 'bg-blue-50 text-blue-600',
    red: 'bg-red-50 text-red-600',
    green: 'bg-green-50 text-green-600',
    orange: 'bg-orange-50 text-orange-600',
  };
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
      <div className="mt-2 flex items-baseline">
        <h4 className="text-2xl font-bold text-slate-900">{value}</h4>
      </div>
      <p className={`mt-1 text-xs font-medium px-2 py-0.5 rounded-full inline-block ${colorMap[color]}`}>
        {change}
      </p>
    </div>
  );
};
