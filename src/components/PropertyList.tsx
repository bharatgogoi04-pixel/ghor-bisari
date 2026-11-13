import React from 'react';
import { Property, Language } from '../types';
import { PropertyCard } from './PropertyCard';
import { translations } from '../data/translations';
import { Home, SearchX } from 'lucide-react';

interface Props {
  properties: Property[];
  lang: Language;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onViewDetails: (property: Property) => void;
  title?: string;
}

export const PropertyList: React.FC<Props> = ({
  properties,
  lang,
  favorites,
  onToggleFavorite,
  onViewDetails,
  title
}) => {
  const t = translations[lang];

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900">
            {title || t.latestProperties}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {lang === 'as' ? "অসমৰ বিভিন্ন জিলাৰ পৰা verified ভাড়া ঘৰসমূহ" : "Verified rental properties across Assam districts"}
          </p>
        </div>
        <div className="text-xs font-bold px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800">
          {properties.length} {lang === 'as' ? "টা ঘৰ উপলব্ধ" : "Properties Available"}
        </div>
      </div>

      {properties.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm max-w-lg mx-auto space-y-4 my-8">
          <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto">
            <SearchX className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-800">
            {t.noPropertiesFound}
          </h3>
          <p className="text-sm text-slate-500">
            {lang === 'as' ? "অনুগ্ৰহ কৰি আন জিলা বা শিতান বাছনি কৰি চাওক।" : "Please try searching with another district or category."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              lang={lang}
              isFavorite={favorites.includes(property.id)}
              onToggleFavorite={onToggleFavorite}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      )}
    </section>
  );
};
