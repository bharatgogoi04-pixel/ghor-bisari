import React from 'react';
import { Language, Owner } from '../types';
import { translations } from '../data/translations';
import { Home, Globe, Heart, User, LogOut, PlusCircle, ShieldCheck, Sparkles } from 'lucide-react';

interface Props {
  lang: Language;
  onOpenLangModal: () => void;
  currentOwner: Owner | null;
  onOpenAuthModal: () => void;
  onOpenDashboard: () => void;
  onOpenFavorites: () => void;
  favoritesCount: number;
  onOpenAiMatchmaker: () => void;
  onOpenAbout: () => void;
  onOpenContact: () => void;
  onLogout: () => void;
  onGoHome: () => void;
}

export const Navbar: React.FC<Props> = ({
  lang,
  onOpenLangModal,
  currentOwner,
  onOpenAuthModal,
  onOpenDashboard,
  onOpenFavorites,
  favoritesCount,
  onOpenAiMatchmaker,
  onOpenAbout,
  onOpenContact,
  onLogout,
  onGoHome
}) => {
  const t = translations[lang];

  return (
    <header className="sticky top-0 z-40 bg-emerald-950 text-white shadow-lg border-b border-emerald-800">
      {/* Top Gamusa Red Accent Bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-red-600 via-amber-500 to-red-600" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Title */}
          <button 
            onClick={onGoHome}
            className="flex items-center space-x-3 text-left group focus:outline-none"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-red-600 flex items-center justify-center shadow-md shadow-emerald-950/50 border border-amber-400/30 group-hover:scale-105 transition-transform">
              <Home className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black font-serif tracking-wide text-amber-400 flex items-center space-x-2">
                <span>ঘৰ বিচাৰি</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-800 text-emerald-100 font-sans font-medium border border-emerald-700">
                  GHOR BISARI
                </span>
              </div>
              <div className="text-xs text-emerald-200/80 font-medium">
                {t.tagline}
              </div>
            </div>
          </button>

          {/* Nav Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            
            {/* AI Matchmaker button */}
            <button
              onClick={onOpenAiMatchmaker}
              className="hidden md:flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-amber-500/20 to-amber-600/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/30 text-sm font-semibold transition-all"
              title={t.aiMatchmaker}
            >
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>AI Match</span>
            </button>

            {/* Favorites */}
            <button
              onClick={onOpenFavorites}
              className="relative p-2.5 rounded-xl bg-emerald-900/80 hover:bg-emerald-800 text-emerald-100 transition-colors border border-emerald-700"
              title={t.favorites}
            >
              <Heart className="w-5 h-5 text-red-400 fill-red-400/20" />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center shadow">
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* Language Switcher */}
            <button
              onClick={onOpenLangModal}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-emerald-900/80 hover:bg-emerald-800 text-emerald-100 border border-emerald-700 text-sm font-medium transition-colors"
            >
              <Globe className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">{lang === 'as' ? 'অসমীয়া' : 'English'}</span>
            </button>

            {/* Owner Auth / Dashboard */}
            {currentOwner ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={onOpenDashboard}
                  className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium text-sm shadow-md shadow-red-900/30 transition-all border border-red-500/40"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span className="hidden md:inline">{currentOwner.name}</span>
                  <span className="md:hidden">Dashboard</span>
                </button>
                <button
                  onClick={onLogout}
                  className="p-2.5 rounded-xl bg-emerald-900 hover:bg-red-900/50 text-emerald-200 hover:text-white transition-colors border border-emerald-700"
                  title={t.logout}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all"
              >
                <User className="w-4 h-4" />
                <span>{t.ownerRegistration}</span>
              </button>
            )}

          </div>
        </div>
      </div>

      {/* Sub menu links */}
      <div className="bg-emerald-900/60 border-t border-emerald-800/60 py-2 px-4 text-xs font-medium text-emerald-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto space-x-6 whitespace-nowrap">
          <div className="flex items-center space-x-6">
            <button onClick={onGoHome} className="hover:text-amber-300 transition-colors">
              {lang === 'as' ? 'মুখ্য পৃষ্ঠা' : 'Home'}
            </button>
            <button onClick={onOpenAbout} className="hover:text-amber-300 transition-colors">
              {t.aboutUs}
            </button>
            <button onClick={onOpenContact} className="hover:text-amber-300 transition-colors">
              {t.contactUs}
            </button>
            <button onClick={onOpenAiMatchmaker} className="md:hidden text-amber-300 flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Matchmaker</span>
            </button>
          </div>
          <div className="text-amber-400 font-semibold">
            {lang === 'as' ? 'অসমৰ সকলো ৩৫ খন জিলাৰ পোনপটীয়া ভাড়া ঘৰ' : 'Direct Rental Housing Across All 35 Districts of Assam'}
          </div>
        </div>
      </div>
    </header>
  );
};
