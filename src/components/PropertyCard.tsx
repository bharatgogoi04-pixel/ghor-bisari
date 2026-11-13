import React from 'react';
import { Property, Language } from '../types';
import { translations } from '../data/translations';
import { MapPin, Phone, MessageCircle, Heart, Building2, CheckCircle2, AlertCircle, BedDouble } from 'lucide-react';

interface Props {
  property: Property;
  lang: Language;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onViewDetails: (property: Property) => void;
}

export const PropertyCard: React.FC<Props> = ({
  property,
  lang,
  isFavorite,
  onToggleFavorite,
  onViewDetails
}) => {
  const t = translations[lang];

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const text = encodeURIComponent(
      `Hello ${property.ownerName}, I found your property "${property.title}" in ${property.district} (${property.area}) listed on Ghor Bisari (ঘৰ বিচাৰি) for ₹${property.monthlyRent}/month. Is it still available?`
    );
    window.open(`https://wa.me/${property.contactPhone.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
  };

  const handleCall = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.location.href = `tel:${property.contactPhone}`;
  };

  return (
    <div 
      onClick={() => onViewDetails(property)}
      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-slate-100 overflow-hidden flex flex-col cursor-pointer group"
    >
      {/* Photo & Top Badges */}
      <div className="relative h-52 sm:h-56 overflow-hidden bg-slate-100">
        <img
          src={property.photos[0] || 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80'}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

        {/* Status Badge */}
        <div className="absolute top-3 left-3 flex items-center space-x-1.5">
          {property.status === 'AVAILABLE' ? (
            <span className="px-3 py-1 rounded-full bg-emerald-600 text-white font-bold text-xs shadow-md flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{t.available}</span>
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full bg-red-600 text-white font-bold text-xs shadow-md flex items-center space-x-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{t.rentedOut}</span>
            </span>
          )}
          <span className="px-2.5 py-1 rounded-full bg-slate-900/80 text-amber-300 font-semibold text-xs backdrop-blur-sm">
            {property.category}
          </span>
        </div>

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(property.id);
          }}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white text-slate-700 shadow-md transition-transform active:scale-95"
          title={t.favorites}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'text-red-600 fill-red-600' : 'text-slate-600'}`} />
        </button>

        {/* Rent & District overlay at bottom of image */}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white">
          <div>
            <div className="text-xs text-amber-300 font-semibold flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5 text-red-400" />
              <span>{property.district} • {property.area}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xl font-black text-amber-400 font-serif drop-shadow">
              ₹{property.monthlyRent.toLocaleString('en-IN')}
              <span className="text-xs font-sans text-white/80 font-normal">/mo</span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        
        <div>
          <h3 className="font-bold text-slate-900 text-base line-clamp-1 group-hover:text-emerald-700 transition-colors">
            {property.title}
          </h3>
          <p className="text-xs text-slate-500 mt-1 line-clamp-2">
            {property.description}
          </p>
        </div>

        {/* Rooms & Amenities Tags */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
          <span className="px-2 py-1 bg-slate-100 rounded-md text-slate-700 text-xs font-medium flex items-center space-x-1">
            <BedDouble className="w-3.5 h-3.5 text-emerald-700" />
            <span>{property.availableRooms} Room(s)</span>
          </span>
          {property.amenities.slice(0, 2).map((amenity, idx) => (
            <span key={idx} className="px-2 py-1 bg-emerald-50 rounded-md text-emerald-800 text-xs font-medium">
              {amenity}
            </span>
          ))}
        </div>

        {/* Direct Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <button
            onClick={handleCall}
            className="flex items-center justify-center space-x-1.5 py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold text-xs rounded-xl transition-colors border border-emerald-200"
          >
            <Phone className="w-4 h-4 text-emerald-700" />
            <span>{t.callNow}</span>
          </button>
          
          <button
            onClick={handleWhatsApp}
            className="flex items-center justify-center space-x-1.5 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors shadow-sm"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{t.whatsapp}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
