import React from 'react';
import { Property, Language } from '../types';
import { translations } from '../data/translations';
import { X, Heart, MapPin, Building2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  favorites: string[];
  properties: Property[];
  onViewDetails: (property: Property) => void;
  onToggleFavorite: (id: string) => void;
  lang: Language;
}

export const SavedPropertiesDrawer: React.FC<Props> = ({
  isOpen,
  onClose,
  favorites,
  properties,
  onViewDetails,
  onToggleFavorite,
  lang
}) => {
  if (!isOpen) return null;

  const t = translations[lang];
  const favProperties = properties.filter((p) => favorites.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col border-l border-emerald-100">
        
        {/* Header */}
        <div className="bg-emerald-950 text-white p-6 flex items-center justify-between border-b border-emerald-800">
          <div className="flex items-center space-x-2">
            <Heart className="w-5 h-5 text-red-500 fill-red-500" />
            <h2 className="text-xl font-bold font-serif">{t.favorites}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-emerald-900 hover:bg-red-800 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 overflow-y-auto space-y-4">
          {favProperties.length === 0 ? (
            <div className="text-center py-20 space-y-3">
              <Heart className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-700">No saved properties yet</h3>
              <p className="text-xs text-slate-500">Click the heart icon on any property card to save it here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {favProperties.map((prop) => (
                <div
                  key={prop.id}
                  onClick={() => {
                    onViewDetails(prop);
                    onClose();
                  }}
                  className="bg-slate-50 hover:bg-emerald-50/50 p-4 rounded-2xl border border-slate-200 cursor-pointer transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center space-x-3">
                    <img src={prop.photos[0]} alt="" className="w-16 h-16 rounded-xl object-cover" />
                    <div>
                      <div className="font-bold text-slate-900 text-sm line-clamp-1 group-hover:text-emerald-700">
                        {prop.title}
                      </div>
                      <div className="text-xs text-slate-500 flex items-center space-x-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-red-600" />
                        <span>{prop.district} • ₹{prop.monthlyRent}/mo</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(prop.id);
                    }}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-xl"
                  >
                    <Heart className="w-4 h-4 fill-red-600" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
