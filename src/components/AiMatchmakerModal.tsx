import React, { useState } from 'react';
import { Property, Language } from '../types';
import { translations } from '../data/translations';
import { X, Sparkles, Send, Bot, Building2, MapPin, Phone } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  properties: Property[];
  lang: Language;
  onViewDetails: (property: Property) => void;
}

export const AiMatchmakerModal: React.FC<Props> = ({
  isOpen,
  onClose,
  properties,
  lang,
  onViewDetails
}) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [matchedIds, setMatchedIds] = useState<string[]>([]);

  if (!isOpen) return null;

  const t = translations[lang];

  const handleAskAi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setAiResponse('');
    setMatchedIds([]);

    try {
      // Initialize Google GenAI SDK
      const apiKey = process.env.GEMINI_API_KEY || '';
      const ai = new GoogleGenAI({ apiKey });

      const propertySummary = properties
        .map(
          (p) =>
            `ID: ${p.id}, Title: ${p.title}, Category: ${p.category}, District: ${p.district}, Area: ${p.area}, Rent: ₹${p.monthlyRent}, Rooms: ${p.availableRooms}, Amenities: ${p.amenities.join(', ')}`
        )
        .join('\n');

      const systemInstruction = `You are Ghor Bisari AI Assistant, an expert rental advisor for Assam, India. 
      You help tenants find the best rental houses, PGs, hostels, and rooms across all 35 Assam districts from our database.
      Analyze the user's request and match them with the most suitable properties from the provided list.
      Return a friendly response in ${lang === 'as' ? 'Assamese (অসমীয়া)' : 'English'}, and list the matching property IDs as JSON array at the end in format [ID1, ID2].
      
      Available Properties:
      ${propertySummary}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [prompt],
        config: {
          systemInstruction,
          temperature: 0.4
        }
      });

      const text = response.text || 'Here are the best matching properties for you!';
      setAiResponse(text);

      // Extract bracketed IDs if any
      const match = text.match(/\[(.*?)\]/);
      if (match) {
        const ids = match[1]
          .split(',')
          .map((id) => id.trim().replace(/['"]/g, ''))
          .filter((id) => properties.some((p) => p.id === id));
        setMatchedIds(ids);
      }
    } catch (err) {
      console.error(err);
      // Fallback keyword matching if API key is missing or quota reached
      const query = prompt.toLowerCase();
      const matches = properties
        .filter(
          (p) =>
            p.title.toLowerCase().includes(query) ||
            p.district.toLowerCase().includes(query) ||
            p.area.toLowerCase().includes(query) ||
            p.category.toLowerCase().includes(query)
        )
        .map((p) => p.id);

      setMatchedIds(matches);
      setAiResponse(
        lang === 'as'
          ? `আপোনাৰ চৰ্ত অনুযায়ী আমি ${matches.length} টা ঘৰ বিচাৰি পাইছো:`
          : `Based on your requirements, here are ${matches.length} matching properties from our Assam listings:`
      );
    } finally {
      setLoading(false);
    }
  };

  const matchedProperties = properties.filter((p) => matchedIds.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-amber-200 my-auto flex flex-col">
        
        {/* Header */}
        <div className="sticky top-0 z-20 bg-gradient-to-r from-amber-600 to-amber-700 text-slate-950 px-6 py-4 flex items-center justify-between border-b border-amber-500">
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 bg-white text-amber-700 rounded-xl flex items-center justify-center shadow">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-serif text-white">{t.aiMatchmakerTitle}</h2>
              <p className="text-xs text-amber-100">Powered by Gemini AI</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-amber-800/40 hover:bg-amber-900 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          <form onSubmit={handleAskAi} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                {t.aiMatchmakerPrompt}
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  required
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g. 2 BHK flat in Guwahati under 15000"
                  className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-amber-500"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm rounded-xl shadow-md transition-all flex items-center space-x-2 disabled:opacity-50"
                >
                  {loading ? (
                    <span className="animate-spin">⏳</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>{t.aiAskBtn}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>

          {/* AI Response Output */}
          {aiResponse && (
            <div className="bg-amber-50/60 p-5 rounded-2xl border border-amber-200 space-y-3">
              <div className="flex items-center space-x-2 text-amber-800 font-bold text-xs uppercase">
                <Bot className="w-4 h-4" />
                <span>AI Recommendation</span>
              </div>
              <p className="text-slate-800 text-sm leading-relaxed whitespace-pre-line">
                {aiResponse.replace(/\[.*?\]/g, '')}
              </p>
            </div>
          )}

          {/* Matched Property Cards */}
          {matchedProperties.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 text-sm">
                Matched Properties ({matchedProperties.length}):
              </h4>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {matchedProperties.map((prop) => (
                  <div
                    key={prop.id}
                    onClick={() => {
                      onViewDetails(prop);
                      onClose();
                    }}
                    className="flex items-center justify-between p-3 bg-slate-50 hover:bg-emerald-50 rounded-2xl border border-slate-200 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <img src={prop.photos[0]} alt="" className="w-14 h-14 rounded-xl object-cover" />
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{prop.title}</div>
                        <div className="text-xs text-slate-500 flex items-center space-x-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-red-600" />
                          <span>{prop.district} • ₹{prop.monthlyRent}/mo</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-xl">
                      View
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
