
import React, { useState } from 'react';
import { getFastResponse } from '../services/geminiService';

export const AIAssistant: React.FC = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    const result = await getFastResponse(query);
    setResponse(result || '');
    setLoading(false);
  };

  return (
    <div className="bg-white p-8 sm:p-10 rounded-[3rem] shadow-sm border border-slate-200/60 relative overflow-hidden group h-full flex flex-col">
      <div className="absolute top-0 right-0 p-8 opacity-5 text-6xl group-hover:rotate-12 transition-all">✨</div>
      
      <div className="mb-8">
        <h3 className="text-2xl font-black text-slate-900 flex items-center tracking-tight">
          <span className="mr-4 text-3xl">⚡</span> Divine Guide
        </h3>
        <p className="text-slate-400 text-sm font-medium mt-1">Instant spiritual and logistical assistance.</p>
      </div>

      <div className="flex-1 flex flex-col space-y-6">
        <div className="flex-1 min-h-[120px] bg-slate-50 rounded-[2.5rem] border border-slate-100/60 p-6 overflow-y-auto no-scrollbar relative shadow-inner">
           {response ? (
             <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
               <div className="flex items-center space-x-2 mb-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-[10px] font-black text-orange-800 uppercase tracking-widest">Divine Assistant</span>
               </div>
               <p className="text-sm font-medium text-slate-700 leading-relaxed italic">"{response}"</p>
             </div>
           ) : (
             <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <p className="text-slate-300 text-sm font-medium italic">"Where is the nearest Prasad distribution center?"</p>
                <p className="text-[10px] text-slate-200 font-bold uppercase tracking-widest mt-2">Try asking the guide above</p>
             </div>
           )}
           {loading && (
             <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center rounded-[2.5rem]">
               <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 bg-orange-600 rounded-full animate-bounce [animation-delay:0.4s]"></div>
               </div>
             </div>
           )}
        </div>

        <form onSubmit={handleAsk} className="relative">
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search the divine hub..."
            className="w-full p-6 bg-white border-2 border-slate-100 rounded-[2.5rem] text-sm font-bold text-slate-800 focus:border-orange-500 outline-none transition-all pr-24 shadow-sm"
          />
          <button 
            type="submit"
            disabled={loading || !query.trim()}
            className="absolute right-3 top-3 bottom-3 px-6 bg-orange-600 text-white rounded-[2rem] font-black hover:bg-orange-700 disabled:opacity-50 transition-all flex items-center justify-center shadow-lg shadow-orange-900/10 text-[10px] uppercase tracking-widest"
          >
            {loading ? '...' : 'Ask'}
          </button>
        </form>
      </div>
    </div>
  );
};
