import React from 'react';
import { Language, FilterState, RentalCategory, ASSAM_DISTRICTS } from '../types';
import { translations } from '../data/translations';
import { Search, MapPin, Building, IndianRupee, SlidersHorizontal, Sparkles } from 'lucide-react';

interface Props {
  lang: Language;
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onSearch: () => void;
  onOpenAiMatchmaker: () => void;
}

const CATEGORIES: RentalCategory[] = [
  'Rental House',
  'Single Room',
  'Paying Guest (PG)',
  'Student Hostel',
  'Sharing Room',
  'Family Accommodation'
];

export const Hero: React.FC<Props> = ({
  lang,
  filters,
  onFilterChange,
  onSearch,
  onOpenAiMatchmaker
}) => {
  const t = translations[lang];

  const handleInputChange = (field: keyof FilterState, value: any) => {
    onFilterChange({
      ...filters,
      [field]: value
    });
  };

  const subtitleText = lang === 'as' 
    ? "অসমৰ ৩৫ খন জিলাৰ পৰা ভাড়া ঘৰ, একক কোঠা, পি.জি., ছাত্ৰাবাস আৰু পৰিয়ালৰ আৱাস বিচাৰি উলিয়াওক। দালাল অবিহনে মালিকৰ সৈতে পোনপটীয়াকৈ কথা পাতিব।"
    : "Find rental houses, single rooms, PGs, hostels, and family accommodations across all 35 Assam districts. Connect directly with owners.";

  return (
    <div className="relative bg-gradient-to-b from-emerald-900 via-emerald-800 to-emerald-950 text-white py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Decorative Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:16px_16px]" />

      <div className="max-w-5xl mx-auto relative z-10 text-center space-y-6">
        
        {/* Badge */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs sm:text-sm font-semibold tracking-wide">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{lang === 'as' ? "অসমৰ প্ৰথম পোনপটীয়া ভাড়া ঘৰ প্লেটফৰ্ম" : "Assam's Premier Direct Rental Platform"}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold font-serif tracking-tight">
          {lang === 'as' ? "আপোনাৰ ঘৰ বিচাৰক। পোনে পোনে যোগাযোগ কৰক।" : "Find Your Home. Connect Directly."}
        </h1>
        
        <p className="max-w-2xl mx-auto text-emerald-100/90 text-sm sm:text-base">
          {subtitleText}
        </p>

        {/* Search & Filter Box */}
        <div className="bg-white text-slate-900 rounded-3xl p-4 sm:p-6 shadow-2xl border border-emerald-100 space-y-4 text-left">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Search Query */}
            <div className="relative">
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                {lang === 'as' ? "মূল শব্দ বা অঞ্চল" : "Search Keyword"}
              </label>
              <div className="relative">
                <Search className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={filters.searchQuery}
                  onChange={(e) => handleInputChange('searchQuery', e.target.value)}
                  placeholder={t.searchPlaceholder}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm font-medium"
                />
              </div>
            </div>

            {/* District Selector */}
            <div className="relative">
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                {t.selectDistrict}
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3.5 w-5 h-5 text-red-600" />
                <select
                  value={filters.district}
                  onChange={(e) => handleInputChange('district', e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm font-medium appearance-none cursor-pointer"
                >
                  <option value="">{t.allDistricts}</option>
                  {ASSAM_DISTRICTS.map((dist) => (
                    <option key={dist} value={dist}>
                      {dist}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Category Selector */}
            <div className="relative">
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                {t.selectCategory}
              </label>
              <div className="relative">
                <Building className="absolute left-3.5 top-3.5 w-5 h-5 text-amber-600" />
                <select
                  value={filters.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm font-medium appearance-none cursor-pointer"
                >
                  <option value="">{t.allCategories}</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

          </div>

          {/* Secondary Row: Rent Range & Action */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 items-center">
            
            {/* Min Rent */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                {t.minRent}
              </label>
              <input
                type="number"
                value={filters.minRent || ''}
                onChange={(e) => handleInputChange('minRent', Number(e.target.value))}
                placeholder="0"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            {/* Max Rent */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                {t.maxRent}
              </label>
              <input
                type="number"
                value={filters.maxRent || ''}
                onChange={(e) => handleInputChange('maxRent', Number(e.target.value))}
                placeholder="50000"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            {/* Search Button */}
            <div className="sm:pt-5 flex space-x-2">
              <button
                onClick={onSearch}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-600/30 transition-all flex items-center justify-center space-x-2"
              >
                <Search className="w-5 h-5" />
                <span>{t.searchBtn}</span>
              </button>
              <button
                onClick={onOpenAiMatchmaker}
                className="px-4 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl shadow-md transition-all flex items-center justify-center"
                title={t.aiMatchmaker}
              >
                <Sparkles className="w-5 h-5" />
              </button>
            </div>

          </div>

        </div>

        {/* Quick District Pills */}
        <div className="pt-2">
          <div className="text-xs text-emerald-200 font-medium mb-2 uppercase tracking-wide">
            {lang === 'as' ? "জনপ্ৰিয় জিলাসমূহ:" : "Popular Assam Districts:"}
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {['Kamrup Metropolitan', 'Dibrugarh', 'Jorhat', 'Cachar', 'Sonitpur', 'Sivasagar', 'Tinsukia', 'Nagaon'].map((dist) => (
              <button
                key={dist}
                onClick={() => {
                  handleInputChange('district', dist);
                  onSearch();
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  filters.district === dist
                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                    : 'bg-emerald-900/80 hover:bg-emerald-800 text-emerald-100 border border-emerald-700'
                }`}
              >
                {dist}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
