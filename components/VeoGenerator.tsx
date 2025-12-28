
import React, { useState, useRef } from 'react';
import { generateVeoVideo } from '../services/geminiService';

export const VeoGenerator: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [status, setStatus] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!image) return;
    setLoading(true);
    setStatus('Initializing Veo engine...');
    
    try {
      const hasKey = await window.aistudio.hasSelectedApiKey();
      if (!hasKey) {
        await window.aistudio.openSelectKey();
      }

      setStatus('Uploading image & generating frames (this takes 1-2 mins)...');
      const url = await generateVeoVideo(image, prompt, aspectRatio);
      setVideoUrl(url);
      setStatus('');
    } catch (error: any) {
      console.error(error);
      setStatus('Failed to generate video. Please ensure a paid API key is selected.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
        <span className="mr-2">🎬</span> Veo Image Animator
      </h3>
      
      <div className="space-y-4">
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="aspect-video bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 transition-all overflow-hidden relative"
        >
          {image ? (
            <img src={image} className="w-full h-full object-cover" alt="Selected" />
          ) : (
            <>
              <span className="text-3xl mb-2">📸</span>
              <p className="text-xs text-slate-500 font-bold">CLICK TO UPLOAD PHOTO</p>
            </>
          )}
          <input type="file" ref={fileInputRef} onChange={handleFileChange} hidden accept="image/*" />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button 
            onClick={() => setAspectRatio('16:9')}
            className={`py-2 text-xs font-bold rounded-lg border transition-all ${aspectRatio === '16:9' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200'}`}
          >
            LANDSCAPE (16:9)
          </button>
          <button 
            onClick={() => setAspectRatio('9:16')}
            className={`py-2 text-xs font-bold rounded-lg border transition-all ${aspectRatio === '9:16' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200'}`}
          >
            PORTRAIT (9:16)
          </button>
        </div>

        <textarea 
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Optional: Describe how you want it animated..."
          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-orange-500 outline-none h-20 resize-none"
        />

        <button 
          onClick={handleGenerate}
          disabled={loading || !image}
          className="w-full bg-slate-900 text-white py-4 rounded-xl font-black hover:bg-slate-800 disabled:opacity-50 transition-all flex flex-col items-center justify-center"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white mb-1" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-[10px] animate-pulse uppercase tracking-widest">{status}</span>
            </>
          ) : (
            <span>GENERATE VEO ANIMATION</span>
          )}
        </button>

        {videoUrl && (
          <div className="mt-6 space-y-2">
             <p className="text-xs font-bold text-green-600">✓ Animation Ready!</p>
             <video src={videoUrl} controls className="w-full rounded-xl shadow-xl bg-black aspect-video" autoPlay loop muted />
             <a href={videoUrl} download="kumbh-veo.mp4" className="block text-center text-xs font-bold text-blue-600 hover:underline">Download Video</a>
          </div>
        )}
      </div>
    </div>
  );
};
