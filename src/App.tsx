import React, { useState, useEffect } from 'react';
import { Property, Owner, Language, FilterState } from './types';
import { 
  getStoredLanguage, 
  saveStoredLanguage, 
  getStoredFavorites, 
  saveStoredFavorites 
} from './utils/storage';
import { auth, db } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, doc, getDoc, setDoc, addDoc, updateDoc, deleteDoc, onSnapshot, query } from 'firebase/firestore';

import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { PropertyList } from './components/PropertyList';
import { PropertyDetailModal } from './components/PropertyDetailModal';
import { OwnerAuthModal } from './components/OwnerAuthModal';
import { OwnerDashboard } from './components/OwnerDashboard';
import { AddPropertyModal } from './components/AddPropertyModal';
import { AiMatchmakerModal } from './components/AiMatchmakerModal';
import { AboutContactModal } from './components/AboutContactModal';
import { SavedPropertiesDrawer } from './components/SavedPropertiesDrawer';
import { LanguageSelectorModal } from './components/LanguageSelectorModal';
import { translations } from './data/translations';
import { Phone, Mail, MapPin } from 'lucide-react';

export default function App() {
  const [lang, setLang] = useState<Language>(getStoredLanguage());
  const [properties, setProperties] = useState<Property[]>([]);
  const [currentOwner, setCurrentOwner] = useState<Owner | null>(null);
  const [favorites, setFavorites] = useState<string[]>(getStoredFavorites());

  // First launch modal check
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean>(!localStorage.getItem('ghor_bisari_lang_v1'));

  // Modals state
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);

  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);

  // Filters state
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    district: '',
    category: '',
    minRent: 0,
    maxRent: 100000
  });

  // Listen to Firebase Auth state and fetch properties from Firestore
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const ownerDocRef = doc(db, 'owners', user.uid);
          const ownerSnap = await getDoc(ownerDocRef);
          if (ownerSnap.exists()) {
            setCurrentOwner(ownerSnap.data() as Owner);
          } else {
            const fallbackOwner: Owner = {
              id: user.uid,
              name: user.displayName || 'Property Owner',
              email: user.email || '',
              phone: user.phoneNumber || '+919876543210',
              createdAt: new Date().toISOString()
            };
            await setDoc(ownerDocRef, fallbackOwner);
            setCurrentOwner(fallbackOwner);
          }
        } catch (err) {
          console.error("Error fetching owner profile:", err);
        }
      } else {
        setCurrentOwner(null);
      }
    });

    const q = query(collection(db, 'properties'));
    const unsubscribeProps = onSnapshot(q, (snapshot) => {
      const propsList: Property[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as Property;
        // Check automatic expiry
        if (data.expiresAt && new Date(data.expiresAt).getTime() < Date.now() && data.status === 'AVAILABLE') {
          data.status = 'EXPIRED';
        }
        propsList.push({ ...data, id: docSnap.id });
      });
      propsList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setProperties(propsList);
    }, (error) => {
      console.error("Error listening to properties:", error);
    });

    return () => {
      unsubscribeAuth();
      unsubscribeProps();
    };
  }, []);

  const handleSelectLang = (newLang: Language) => {
    setLang(newLang);
    saveStoredLanguage(newLang);
    setIsFirstLaunch(false);
  };

  const handleToggleFavorite = (id: string) => {
    let updated: string[];
    if (favorites.includes(id)) {
      updated = favorites.filter((f) => f !== id);
    } else {
      updated = [...favorites, id];
    }
    setFavorites(updated);
    saveStoredFavorites(updated);
  };

  const handleSaveProperty = async (property: Property) => {
    try {
      if (editingProperty) {
        const propRef = doc(db, 'properties', property.id);
        await updateDoc(propRef, { ...property });
      } else {
        const colRef = collection(db, 'properties');
        await addDoc(colRef, property);
      }
      setEditingProperty(null);
    } catch (err) {
      console.error("Error saving property:", err);
      alert("Failed to save property. Please check permissions.");
    }
  };

  const handleDeleteProperty = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'properties', id));
    } catch (err) {
      console.error("Error deleting property:", err);
      alert("Failed to delete property.");
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      const prop = properties.find((p) => p.id === id);
      if (!prop) return;
      const newStatus = prop.status === 'AVAILABLE' ? 'RENTED' : 'AVAILABLE';
      await updateDoc(doc(db, 'properties', id), { status: newStatus });
    } catch (err) {
      console.error("Error toggling status:", err);
    }
  };

  const handleRenewProperty = async (id: string) => {
    try {
      const newExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      await updateDoc(doc(db, 'properties', id), {
        status: 'PENDING_APPROVAL',
        paymentStatus: 'VERIFIED',
        expiresAt: newExpiresAt
      });
      alert("Listing renewal submitted for verification!");
    } catch (err) {
      console.error("Error renewing property:", err);
    }
  };

  const handleAdminApprove = async (id: string, approved: boolean) => {
    try {
      await updateDoc(doc(db, 'properties', id), {
        status: approved ? 'AVAILABLE' : 'EXPIRED',
        paymentStatus: approved ? 'VERIFIED' : 'REJECTED'
      });
      alert(approved ? "Listing approved and made live!" : "Listing rejected.");
    } catch (err) {
      console.error("Error updating approval:", err);
    }
  };

  const handleLogoutOwner = async () => {
    await signOut(auth);
    setCurrentOwner(null);
  };

  // Filter properties (public visitors only see AVAILABLE properties unless it's their own)
  const filteredProperties = properties.filter((p) => {
    const isOwnerListing = currentOwner && p.ownerId === currentOwner.id;
    const isPublicVisible = p.status === 'AVAILABLE' || isOwnerListing;

    const matchesSearch =
      !filters.searchQuery ||
      p.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      p.area.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      p.district.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(filters.searchQuery.toLowerCase());

    const matchesDistrict = !filters.district || p.district === filters.district;
    const matchesCategory = !filters.category || p.category === filters.category;
    const matchesMinRent = !filters.minRent || p.monthlyRent >= filters.minRent;
    const matchesMaxRent = !filters.maxRent || p.monthlyRent <= filters.maxRent;

    return isPublicVisible && matchesSearch && matchesDistrict && matchesCategory && matchesMinRent && matchesMaxRent;
  });

  const t = translations[lang];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      <LanguageSelectorModal
        currentLang={lang}
        onSelectLang={handleSelectLang}
        isOpen={isFirstLaunch}
        isFirstLaunch={true}
      />

      <LanguageSelectorModal
        currentLang={lang}
        onSelectLang={handleSelectLang}
        isOpen={isLangModalOpen}
        onClose={() => setIsLangModalOpen(false)}
        isFirstLaunch={false}
      />

      <Navbar
        lang={lang}
        onOpenLangModal={() => setIsLangModalOpen(true)}
        currentOwner={currentOwner}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenDashboard={() => setIsDashboardOpen(true)}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
        favoritesCount={favorites.length}
        onOpenAiMatchmaker={() => setIsAiModalOpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
        onOpenContact={() => setIsContactOpen(true)}
        onLogout={handleLogoutOwner}
        onGoHome={() => {
          setFilters({ searchQuery: '', district: '', category: '', minRent: 0, maxRent: 100000 });
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      <Hero
        lang={lang}
        filters={filters}
        onFilterChange={setFilters}
        onSearch={() => {
          const element = document.getElementById('listings-section');
          if (element) element.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenAiMatchmaker={() => setIsAiModalOpen(true)}
      />

      <div id="listings-section" className="flex-1">
        <PropertyList
          properties={filteredProperties}
          lang={lang}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
          onViewDetails={(prop) => setSelectedProperty(prop)}
        />
      </div>

      <footer className="bg-emerald-950 text-emerald-200 py-12 px-4 sm:px-6 lg:px-8 border-t border-emerald-900 mt-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-3">
            <div className="text-xl font-bold font-serif text-amber-400 flex items-center space-x-2">
              <span>ঘৰ বিচাৰি</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-900 text-white">GHOR BISARI</span>
            </div>
            <p className="text-xs text-emerald-300 leading-relaxed">
              {t.tagline}
            </p>
            <div className="text-xs text-emerald-400 font-medium">
              © 2026 Ghor Bisari. Powered by Firebase.
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white text-sm mb-3 font-serif uppercase tracking-wider">
              {lang === 'as' ? 'দ্ৰুত লিংকসমূহ' : 'Quick Links'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setIsAboutOpen(true)} className="hover:text-amber-300 transition-colors">
                  {t.aboutUs}
                </button>
              </li>
              <li>
                <button onClick={() => setIsContactOpen(true)} className="hover:text-amber-300 transition-colors">
                  {t.contactUs}
                </button>
              </li>
              <li>
                <button onClick={() => setIsAiModalOpen(true)} className="hover:text-amber-300 transition-colors">
                  {t.aiMatchmaker}
                </button>
              </li>
              <li>
                <button onClick={() => setIsAuthModalOpen(true)} className="hover:text-amber-300 transition-colors">
                  {t.ownerRegistration}
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white text-sm mb-3 font-serif uppercase tracking-wider">
              {lang === 'as' ? '৩৫ খন জিলা কভাৰেজ' : '35 Districts Coverage'}
            </h4>
            <p className="text-xs text-emerald-300 leading-relaxed">
              {lang === 'as'
                ? 'কামৰূপ, ডিব্ৰুগড়, যোৰহাট, কাছাৰ, শোণিতপুৰ, শিৱসাগৰ, তিনিচুকীয়া আদি সকলো ৩৫ খন জিলাত উপলব্ধ।'
                : 'Covering Kamrup Metro, Dibrugarh, Jorhat, Cachar, Sonitpur, Sivasagar, Tinsukia, and all 35 districts of Assam.'}
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white text-sm mb-3 font-serif uppercase tracking-wider">
              {t.contactUs}
            </h4>
            <div className="space-y-2 text-xs text-emerald-300">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-amber-400" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-amber-400" />
                <span>support@ghorbisari.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>GS Road, Guwahati, Assam</span>
              </div>
            </div>
          </div>

        </div>
      </footer>

      <PropertyDetailModal
        property={selectedProperty}
        lang={lang}
        isOpen={Boolean(selectedProperty)}
        onClose={() => setSelectedProperty(null)}
        isFavorite={selectedProperty ? favorites.includes(selectedProperty.id) : false}
        onToggleFavorite={handleToggleFavorite}
      />

      <OwnerAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        lang={lang}
      />

      {currentOwner && (
        <OwnerDashboard
          isOpen={isDashboardOpen}
          onClose={() => setIsDashboardOpen(false)}
          currentOwner={currentOwner}
          properties={properties}
          onOpenAddModal={() => {
            setEditingProperty(null);
            setIsAddModalOpen(true);
          }}
          onEditProperty={(prop) => {
            setEditingProperty(prop);
            setIsAddModalOpen(true);
          }}
          onDeleteProperty={handleDeleteProperty}
          onToggleStatus={handleToggleStatus}
          onRenewProperty={handleRenewProperty}
          onAdminApprove={handleAdminApprove}
          lang={lang}
        />
      )}

      {currentOwner && (
        <AddPropertyModal
          isOpen={isAddModalOpen}
          onClose={() => {
            setIsAddModalOpen(false);
            setEditingProperty(null);
          }}
          currentOwner={currentOwner}
          onSaveProperty={handleSaveProperty}
          editingProperty={editingProperty}
          lang={lang}
        />
      )}

      <AiMatchmakerModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        properties={properties}
        lang={lang}
        onViewDetails={(prop) => setSelectedProperty(prop)}
      />

      <AboutContactModal
        isOpen={isAboutOpen || isContactOpen}
        onClose={() => {
          setIsAboutOpen(false);
          setIsContactOpen(false);
        }}
        type={isAboutOpen ? 'about' : 'contact'}
        lang={lang}
      />

      <SavedPropertiesDrawer
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        favorites={favorites}
        properties={properties}
        onViewDetails={(prop) => setSelectedProperty(prop)}
        onToggleFavorite={handleToggleFavorite}
        lang={lang}
      />

    </div>
  );
}
