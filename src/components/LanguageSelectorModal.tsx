import React from 'react';
import { Language } from '../types';
import { translations } from '../data/translations';
import { Globe, Check } from 'lucide-react';

interface Props {
  currentLang: Language;
  onSelectLang: (lang: Language) => void;
  isOpen: boolean;
  onClose?: () => void;
  isFirstLaunch?: boolean;
}

export const LanguageSelectorModal: React.FC<Props> = ({
  currentLang,
  onSelectLang,
  isOpen,
  onClose,
  isFirstLaunch = false
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-emerald-100">
        <div className="bg-gradient-to-r from-emerald-900 to-emerald-800 p-6 text-white text-center relative">
          <div className="mx-auto w-14 h-14 bg-amber-500/20 rounded-full flex items-center justify-center mb-3 border border-amber-400/40">
            <Globe className="w-7 h-7 text-amber-400" />
          </div>
          <h2 className="text-2xl font-bold font-serif">
            {isFirstLaunch ? 'ঘৰ বিচাৰিলৈ স্বাগতম' : 'Select Language / ভাষা বাছক'}
          </h2>
          <p className="text-emerald-200 text-sm mt-1">
            {isFirstLaunch ? 'Find Your Home. Connect Directly.' : 'Choose your preferred language'}
          </p>
        </div>

        <div className="p-6 space-y-4">
          <button
            onClick={() => {
              onSelectLang('as');
              if (onClose) onClose();
            }}
            className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
              currentLang === 'as'
                ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold shadow-sm'
                : 'border-slate-200 hover:border-emerald-300 text-slate-700 bg-white'
            }`}
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">অ</span>
              <div className="text-left">
                <div className="text-lg font-bold">অসমীয়া (Assamese)</div>
                <div className="text-xs text-slate-500">অসমৰ নিজা ভাষাত ঘৰ বিচাৰক</div>
              </div>
            </div>
            {currentLang === 'as' && <Check className="w-6 h-6 text-emerald-600" />}
          </button>

          <button
            onClick={() => {
              onSelectLang('en');
              if (onClose) onClose();
            }}
            className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
              currentLang === 'en'
                ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold shadow-sm'
                : 'border-slate-200 hover:border-emerald-300 text-slate-700 bg-white'
            }`}
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl font-serif">A</span>
              <div className="text-left">
                <div className="text-lg font-bold">English</div>
                <div className="text-xs text-slate-500">Browse and search in English</div>
              </div>
            </div>
            {currentLang === 'en' && <Check className="w-6 h-6 text-emerald-600" />}
          </button>

          {isFirstLaunch && (
            <button
              onClick={() => {
                onSelectLang('as');
                if (onClose) onClose();
              }}
              className="w-full mt-4 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-600/30 transition-all flex items-center justify-center space-x-2"
            >
              <span>{translations[currentLang].proceed}</span>
            </button>
          )}

          {!isFirstLaunch && onClose && (
            <button
              onClick={onClose}
              className="w-full mt-2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-all"
            >
              {translations[currentLang].close}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
