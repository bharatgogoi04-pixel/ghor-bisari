import React, { useState, useEffect } from 'react';
import { Property, RentalCategory, AssamDistrict, Owner, Language, ASSAM_DISTRICTS } from '../types';
import { translations } from '../data/translations';
import { X, Plus, Building, MapPin, IndianRupee, BedDouble, Phone, QrCode, ShieldCheck, Upload, Image as ImageIcon } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentOwner: Owner;
  onSaveProperty: (property: Property) => void;
  editingProperty: Property | null;
  lang: Language;
}

const CATEGORIES: RentalCategory[] = [
  'Rental House',
  'Single Room',
  'Paying Guest (PG)',
  'Student Hostel',
  'Sharing Room',
  'Family Accommodation'
];

export const AddPropertyModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentOwner,
  onSaveProperty,
  editingProperty,
  lang
}) => {
  const t = translations[lang];

  const [step, setStep] = useState<'details' | 'payment'>('details');

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<RentalCategory>('Rental House');
  const [district, setDistrict] = useState<AssamDistrict>('Kamrup Metropolitan');
  const [area, setArea] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [monthlyRent, setMonthlyRent] = useState<number>(10000);
  const [availableRooms, setAvailableRooms] = useState<number>(1);
  const [description, setDescription] = useState('');
  const [contactPhone, setContactPhone] = useState(currentOwner.phone);
  const [photosInput, setPhotosInput] = useState('');
  const [amenitiesInput, setAmenitiesInput] = useState('24/7 Water, Parking, Electricity');

  // Payment fields
  const [utrNumber, setUtrNumber] = useState('');
  const [paymentScreenshot, setPaymentScreenshot] = useState('');

  useEffect(() => {
    if (editingProperty) {
      setTitle(editingProperty.title);
      setCategory(editingProperty.category);
      setDistrict(editingProperty.district);
      setArea(editingProperty.area);
      setFullAddress(editingProperty.fullAddress);
      setMonthlyRent(editingProperty.monthlyRent);
      setAvailableRooms(editingProperty.availableRooms);
      setDescription(editingProperty.description);
      setContactPhone(editingProperty.contactPhone);
      setPhotosInput(editingProperty.photos.join(', '));
      setAmenitiesInput(editingProperty.amenities.join(', '));
      setUtrNumber(editingProperty.utrNumber || '');
      setPaymentScreenshot(editingProperty.paymentScreenshot || '');
      setStep('details');
    } else {
      setTitle('');
      setCategory('Rental House');
      setDistrict('Kamrup Metropolitan');
      setArea('');
      setFullAddress('');
      setMonthlyRent(10000);
      setAvailableRooms(1);
      setDescription('');
      setContactPhone(currentOwner.phone);
      setPhotosInput(
        'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80'
      );
      setAmenitiesInput('24/7 Water, Parking, Secure Compound');
      setUtrNumber('');
      setPaymentScreenshot('');
      setStep('details');
    }
  }, [editingProperty, isOpen, currentOwner]);

  if (!isOpen) return null;

  // Handle local image file upload converted to base64
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        if (result) {
          setPhotosInput((prev) => (prev ? `${prev}, ${result}` : result));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProperty) {
      handleSubmitProperty();
    } else {
      setStep('payment');
    }
  };

  const handleSubmitProperty = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const photos = photosInput
      .split(',')
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    const amenities = amenitiesInput
      .split(',')
      .map((a) => a.trim())
      .filter((a) => a.length > 0);

    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    const property: Property = {
      id: editingProperty ? editingProperty.id : `prop-${Date.now()}`,
      ownerId: currentOwner.id,
      ownerName: currentOwner.name,
      title,
      category,
      photos: photos.length > 0 ? photos : ['https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80'],
      monthlyRent: Number(monthlyRent),
      district,
      area,
      fullAddress,
      availableRooms: Number(availableRooms),
      description,
      contactPhone,
      status: editingProperty ? editingProperty.status : 'PENDING_APPROVAL',
      paymentStatus: editingProperty ? editingProperty.paymentStatus : 'VERIFIED',
      utrNumber: utrNumber || 'UPI-MANUAL-VERIFIED',
      paymentScreenshot: paymentScreenshot || 'https://images.unsplash.com/photo-1556742049-0a67d553c2a5?auto=format&fit=crop&w=400&q=80',
      expiresAt: editingProperty?.expiresAt || expiresAt,
      createdAt: editingProperty ? editingProperty.createdAt : new Date().toISOString(),
      amenities
    };

    onSaveProperty(property);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-emerald-100 my-auto">
        
        {/* Header */}
        <div className="sticky top-0 z-20 bg-emerald-950 text-white px-6 py-4 flex items-center justify-between border-b border-emerald-800">
          <div>
            <h2 className="text-xl font-bold font-serif">
              {editingProperty ? 'Edit Property Listing' : t.addNewProperty}
            </h2>
            <p className="text-xs text-amber-300">
              {step === 'payment' ? 'Step 2: ₹99 Listing Fee Payment' : 'Step 1: Property Details'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-emerald-900 hover:bg-red-800 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === 'details' ? (
          <form onSubmit={handleProceedToPayment} className="p-6 space-y-4">
            
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                {t.propertyTitle} *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Spacious 2 BHK Independent House"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {t.category} *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as RentalCategory)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-600"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {t.district} * (All 35 Districts)
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value as AssamDistrict)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-600"
                >
                  {ASSAM_DISTRICTS.map((dist) => (
                    <option key={dist} value={dist}>{dist}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {t.area} *
                </label>
                <input
                  type="text"
                  required
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="e.g. Ulubari, Guwahati"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {t.monthlyRent} *
                </label>
                <input
                  type="number"
                  required
                  value={monthlyRent}
                  onChange={(e) => setMonthlyRent(Number(e.target.value))}
                  placeholder="10000"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                {t.fullAddress} *
              </label>
              <input
                type="text"
                required
                value={fullAddress}
                onChange={(e) => setFullAddress(e.target.value)}
                placeholder="House No, Street, Locality, P.O., PIN Code"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {t.availableRooms} *
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={availableRooms}
                  onChange={(e) => setAvailableRooms(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {t.contactPhone} *
                </label>
                <input
                  type="tel"
                  required
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="+919864012345"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>

            {/* Photo Upload & URL input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                {t.photos}
              </label>
              <div className="space-y-2">
                <input
                  type="text"
                  value={photosInput}
                  onChange={(e) => setPhotosInput(e.target.value)}
                  placeholder="https://image1.jpg, https://image2.jpg"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-600"
                />
                <div className="flex items-center space-x-2">
                  <label className="cursor-pointer px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors">
                    <Upload className="w-4 h-4 text-emerald-700" />
                    <span>Upload Image from Device</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageFileUpload}
                      className="hidden"
                    />
                  </label>
                  <span className="text-[11px] text-slate-500">Photos are stored permanently in Firestore.</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                {t.amenities}
              </label>
              <input
                type="text"
                value={amenitiesInput}
                onChange={(e) => setAmenitiesInput(e.target.value)}
                placeholder="Wi-Fi, Parking, Water 24/7"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                {t.description} *
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe facilities, nearby landmarks, rules..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-600 resize-none"
              />
            </div>

            <div className="pt-4 flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all"
              >
                {t.cancel}
              </button>
              <button
                type="submit"
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-600/30 transition-all flex items-center justify-center space-x-2"
              >
                <span>Proceed to ₹99 Payment →</span>
              </button>
            </div>

          </form>
        ) : (
          <div className="p-6 space-y-6">
            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-slate-800 space-y-2">
              <div className="font-bold text-amber-900 flex items-center space-x-2">
                <IndianRupee className="w-5 h-5 text-amber-600" />
                <span>Listing Fee: ₹99 for 30 Days</span>
              </div>
              <p className="text-xs text-slate-600">
                Scan the UPI QR code below using Google Pay, PhonePe, or Paytm (Configure your UPI ID in settings). After payment, enter your UTR / Reference number and screenshot.
              </p>
            </div>

            {/* UPI QR Display */}
            <div className="flex flex-col items-center justify-center bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3">
              <div className="w-48 h-48 bg-white p-3 rounded-2xl shadow border border-slate-200 flex items-center justify-center">
                <QrCode className="w-40 h-40 text-slate-900" />
              </div>
              <div className="text-center">
                <div className="text-xs font-bold text-slate-500">UPI ID (Configurable Placeholder)</div>
                <div className="text-base font-black text-slate-900">your-upi-id@okaxis</div>
              </div>
            </div>

            <form onSubmit={handleSubmitProperty} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  UPI UTR / Reference Number *
                </label>
                <input
                  type="text"
                  required
                  value={utrNumber}
                  onChange={(e) => setUtrNumber(e.target.value)}
                  placeholder="e.g. 405628192039"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Payment Screenshot (Image URL or Upload) *
                </label>
                <input
                  type="text"
                  required
                  value={paymentScreenshot}
                  onChange={(e) => setPaymentScreenshot(e.target.value)}
                  placeholder="https://image-url.com/screenshot.jpg"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="pt-4 flex space-x-3">
                <button
                  type="button"
                  onClick={() => setStep('details')}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center space-x-2"
                >
                  <ShieldCheck className="w-5 h-5" />
                  <span>Submit for Verification</span>
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
