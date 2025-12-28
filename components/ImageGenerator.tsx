
import React, { useState } from 'react';
import { generateTempleImage } from '../services/geminiService';

export const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('An artistic aerial view of a grand ancient Hindu temple during Kumbh Mela, vibrant orange flags, spiritual atmosphere, cinematic lighting, ultra-detailed');
  const [size, setSize] = useState<"1K" | "2K" | "4K">("1K");
  const [loading, setLoading] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);

    try {
      // Check for API key selection before proceeding with high-quality generation
      const hasKey = await window.aistudio.hasSelectedApiKey();
      if (!hasKey) {
        await window.aistudio.openSelectKey();
        // Per guidelines, assume key selection was successful and proceed immediately
      }

      const imageUrl = await generateTempleImage(prompt, size);
      if (imageUrl) {
        setGeneratedImageUrl(imageUrl);
      } else {
        setError("Model did not return an image. Try a different prompt.");
      }
    } catch (err: any) {
      // Handle the "Requested entity was not found" error by prompting for key again
      if (err.message === "API_KEY_ERROR") {
        await window.aistudio.openSelectKey();
        setError("Please ensure you've selected a valid API key from a paid GCP project with billing enabled.");
      } else {
        setError("Failed to generate image. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-slate-900">AI Visual Generator</h3>
          <p className="text-sm text-slate-500">Create high-resolution marketing and educational content using Nano Banana Pro.</p>
        </div>
        <div className="text-right">
          <a 
            href="https://ai.google.dev/gemini-api/docs/billing" 
            target="_blank" 
            className="text-[10px] text-blue-600 font-bold hover:underline uppercase tracking-widest"
          >
            Billing Requirements
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Visual Prompt</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all resize-none"
              placeholder="Describe the scene you want to visualize..."
            />
          </div>

          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Resolution (Image Size)</label>
            <div className="grid grid-cols-3 gap-2">
              {(["1K", "2K", "4K"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`py-2 rounded-lg font-bold text-sm transition-all border ${
                    size === s 
                      ? 'bg-orange-600 border-orange-700 text-white shadow-md' 
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            className="w-full bg-slate-900 text-white py-4 rounded-xl font-black hover:bg-slate-800 active:scale-95 transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>GENERATING {size} MASTERPIECE...</span>
              </>
            ) : (
              <>
                <span>🎨 GENERATE PRO VISUAL</span>
              </>
            )}
          </button>

          {error && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-xs text-red-600 font-medium">
              ⚠️ {error}
            </div>
          )}
        </div>

        <div className="relative aspect-square bg-slate-100 rounded-2xl border-2 border-dashed border-slate-300 overflow-hidden flex items-center justify-center group">
          {generatedImageUrl ? (
            <>
              <img src={generatedImageUrl} alt="Generated Temple Visual" className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <a 
                  href={generatedImageUrl} 
                  download="temple-visual.png"
                  className="bg-white text-slate-900 px-6 py-2 rounded-full font-bold shadow-2xl hover:bg-slate-100 transition-all"
                >
                  Download {size}
                </a>
              </div>
            </>
          ) : (
            <div className="text-center px-8">
              <span className="text-4xl mb-4 block grayscale opacity-40">🖼️</span>
              <p className="text-slate-400 font-medium text-sm">Preview will appear here.<br/>Generating {size} content requires a billing-enabled API key.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
