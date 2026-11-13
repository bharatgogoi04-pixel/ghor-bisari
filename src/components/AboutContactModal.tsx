import React from 'react';
import { Language } from '../types';
import { translations } from '../data/translations';
import { X, Home, Mail, Phone, MapPin, ShieldCheck } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  type: 'about' | 'contact';
  lang: Language;
}

export const AboutContactModal: React.FC<Props> = ({
  isOpen,
  onClose,
  type,
  lang
}) => {
  if (!isOpen) return null;

  const t = translations[lang];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-emerald-100">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 to-emerald-900 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-emerald-900 hover:bg-red-800 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="mx-auto w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center mb-3 shadow">
            <Home className="w-6 h-6 text-slate-950" />
          </div>

          <h2 className="text-2xl font-bold font-serif">
            {type === 'about' ? t.aboutUs : t.contactUs}
          </h2>
          <p className="text-emerald-200 text-xs mt-1">
            ঘৰ বিচাৰি | GHOR BISARI - Find Your Home. Connect Directly.
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {type === 'about' ? (
            <div className="space-y-4 text-slate-700 text-sm leading-relaxed">
              <p>{t.aboutContent}</p>
              <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 space-y-2">
                <div className="font-bold text-emerald-900 flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-700" />
                  <span>Direct Owner Connection</span>
                </div>
                <p className="text-xs text-slate-600">
                  No middleman commissions. Communicate directly with verified property owners across all 35 Assam districts.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4 text-slate-700 text-sm leading-relaxed">
              <p>{t.contactContent}</p>
              
              <div className="space-y-3 pt-2">
                <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <Phone className="w-5 h-5 text-emerald-700 flex-shrink-0" />
                  <div>
                    <div className="text-xs text-slate-500 font-semibold">Helpline Number</div>
                    <div className="font-bold text-slate-900">+91 98765 43210</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <Mail className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <div>
                    <div className="text-xs text-slate-500 font-semibold">Support Email</div>
                    <div className="font-bold text-slate-900">support@ghorbisari.com</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <MapPin className="w-5 h-5 text-amber-600 flex-shrink-0" />
                  <div>
                    <div className="text-xs text-slate-500 font-semibold">Head Office</div>
                    <div className="font-bold text-slate-900">GS Road, Guwahati, Assam - 781005</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={onClose}
            className="w-full mt-4 py-3 bg-emerald-900 hover:bg-emerald-950 text-white font-bold text-xs rounded-xl transition-all shadow"
          >
            {t.close}
          </button>
        </div>

      </div>
    </div>
  );
};
