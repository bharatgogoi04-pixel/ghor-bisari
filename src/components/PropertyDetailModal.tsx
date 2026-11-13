import React, { useState } from 'react';
import { Property, Language } from '../types';
import { translations } from '../data/translations';
import { X, MapPin, Phone, MessageCircle, Building2, User, BedDouble, CheckCircle2, AlertCircle, Heart, Share2, Sparkles } from 'lucide-react';

interface Props {
  property: Property | null;
  lang: Language;
  isOpen: boolean;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export const PropertyDetailModal: React.FC<Props> = ({
  property,
  lang,
  isOpen,
  onClose,
  isFavorite,
  onToggleFavorite
}) => {
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [inquirySent, setInquirySent] = useState(false);
  const [inquirerName, setInquirerName] = useState('');
  const [inquirerPhone, setInquirerPhone] = useState('');
  const [inquirerMsg, setInquirerMsg] = useState('');

  if (!isOpen || !property) return null;

  const t = translations[lang];

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      `Hello ${property.ownerName}, I am interested in your property "${property.title}" located at ${property.district} (${property.area}) listed on Ghor Bisari (ঘৰ বিচাৰি) for ₹${property.monthlyRent}/month. Please share more details.`
    );
    window.open(`https://wa.me/${property.contactPhone.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
  };

  const handleCall = () => {
    window.location.href = `tel:${property.contactPhone}`;
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInquirySent(true);
    setTimeout(() => {
      setInquirySent(false);
      setInquirerName('');
      setInquirerPhone('');
      setInquirerMsg('');
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-emerald-100 flex flex-col my-auto">
        
        {/* Header Bar */}
        <div className="sticky top-0 z-20 bg-emerald-950 text-white px-6 py-4 flex items-center justify-between border-b border-emerald-800">
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full bg-amber-500 text-slate-950 font-bold text-xs">
              {property.category}
            </span>
            <span className="text-xs text-emerald-200">
              {property.district}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onToggleFavorite(property.id)}
              className="p-2 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-white transition-colors"
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'text-red-500 fill-red-500' : 'text-white'}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-emerald-900 hover:bg-red-800 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          
          {/* Photo Gallery Carousel */}
          <div className="space-y-3">
            <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden bg-slate-900 shadow-lg">
              <img
                src={property.photos[activePhotoIdx] || property.photos[0]}
                alt={property.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-white text-xs font-semibold">
                Photo {activePhotoIdx + 1} of {property.photos.length}
              </div>
            </div>

            {property.photos.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {property.photos.map((photo, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActivePhotoIdx(idx)}
                    className={`relative w-20 h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                      activePhotoIdx === idx ? 'border-amber-500 scale-105 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={photo} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title & Rent Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                {property.status === 'AVAILABLE' ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{t.available}</span>
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 font-bold text-xs flex items-center space-x-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{t.rentedOut}</span>
                  </span>
                )}
                <span className="text-xs text-slate-500 font-medium flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-red-600" />
                  <span>{property.area}, {property.district}</span>
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900">
                {property.title}
              </h1>
            </div>

            <div className="text-right bg-emerald-50 px-5 py-3 rounded-2xl border border-emerald-100">
              <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider">{t.monthlyRent}</div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-900 font-serif">
                ₹{property.monthlyRent.toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          {/* Grid Layout: Details & Owner Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left 2 Cols: Full Description & Amenities */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 font-serif">
                  {t.description}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  {property.description}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-3 font-serif">
                  {lang === 'as' ? 'অঞ্চল আৰু ঠিকনা' : 'Full Address & Location'}
                </h3>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2 text-sm text-slate-700">
                  <div className="flex items-start space-x-2">
                    <MapPin className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-slate-900">{property.fullAddress}</div>
                      <div className="text-xs text-slate-500 mt-0.5">District: {property.district}, Assam</div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-3 font-serif">
                  {t.amenities}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {property.amenities.map((amenity, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-xl text-xs font-semibold"
                    >
                      ✓ {amenity}
                    </span>
                  ))}
                  <span className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold">
                    🛏 {property.availableRooms} Available Room(s)
                  </span>
                </div>
              </div>
            </div>

            {/* Right Col: Owner Contact Card & Inquiry */}
            <div className="space-y-6">
              
              <div className="bg-gradient-to-br from-emerald-900 to-emerald-950 text-white rounded-2xl p-6 shadow-xl space-y-4 border border-emerald-800">
                <div className="flex items-center space-x-3 pb-4 border-b border-emerald-800">
                  <div className="w-12 h-12 bg-amber-500 text-slate-950 rounded-xl flex items-center justify-center font-bold text-lg shadow">
                    {property.ownerName.charAt(0)}
                  </div>
                  <div>
                    <div className="text-xs text-emerald-300 font-medium">Property Owner / গৰাকী</div>
                    <div className="text-lg font-bold">{property.ownerName}</div>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <button
                    onClick={handleCall}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow transition-all flex items-center justify-center space-x-2"
                  >
                    <Phone className="w-5 h-5" />
                    <span>{t.callNow}: {property.contactPhone}</span>
                  </button>

                  <button
                    onClick={handleWhatsApp}
                    className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow transition-all flex items-center justify-center space-x-2"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>{t.whatsapp} Chat</span>
                  </button>
                </div>
              </div>

              {/* Direct Inquiry Form */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                <h4 className="font-bold text-slate-900 text-base">
                  {lang === 'as' ? 'মালিকলৈ পোনপটীয়া বাৰ্তা পঠাওক' : 'Send Direct Inquiry'}
                </h4>
                
                {inquirySent ? (
                  <div className="p-4 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold text-center">
                    ✓ Inquiry sent successfully! Owner will contact you soon.
                  </div>
                ) : (
                  <form onSubmit={handleInquirySubmit} className="space-y-3">
                    <div>
                      <input
                        type="text"
                        required
                        value={inquirerName}
                        onChange={(e) => setInquirerName(e.target.value)}
                        placeholder={t.name}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium"
                      />
                    </div>
                    <div>
                      <input
                        type="tel"
                        required
                        value={inquirerPhone}
                        onChange={(e) => setInquirerPhone(e.target.value)}
                        placeholder={t.phone}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium"
                      />
                    </div>
                    <div>
                      <textarea
                        rows={2}
                        value={inquirerMsg}
                        onChange={(e) => setInquirerMsg(e.target.value)}
                        placeholder={lang === 'as' ? 'আপোনাৰ বাৰ্তা লিখক...' : 'Write your message...'}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium resize-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2.5 bg-slate-900 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl transition-all"
                    >
                      {t.submit}
                    </button>
                  </form>
                )}
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
