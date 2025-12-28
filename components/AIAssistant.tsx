
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
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
        <span className="mr-2">⚡</span> Quick AI Assistant
      </h3>
      <form onSubmit={handleAsk} className="space-y-4">
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask me anything about the Mela..."
          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none"
        />
        <button 
          type="submit"
          disabled={loading || !query.trim()}
          className="w-full bg-orange-600 text-white py-2 rounded-xl font-bold hover:bg-orange-700 disabled:opacity-50 transition-all"
        >
          {loading ? 'Thinking...' : 'Get Instant Answer'}
        </button>
      </form>
      {response && (
        <div className="mt-4 p-4 bg-orange-50 rounded-xl border border-orange-100 text-sm text-slate-700 animate-in fade-in duration-300">
          <p className="font-bold text-orange-800 mb-1">Response:</p>
          {response}
        </div>
      )}
    </div>
  );
};
