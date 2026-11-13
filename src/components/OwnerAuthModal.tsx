import React, { useState } from 'react';
import { Owner, Language } from '../types';
import { translations } from '../data/translations';
import { X, ShieldCheck, Mail, Lock, User, Phone, LogIn, UserPlus } from 'lucide-react';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const OwnerAuthModal: React.FC<Props> = ({
  isOpen,
  onClose,
  lang
}) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const t = translations[lang];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegistering) {
        if (!name || !email || !password || !phone) {
          setError('Please fill in all required fields.');
          setLoading(false);
          return;
        }
        // Create user with Firebase Auth
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        const uid = cred.user.uid;

        const newOwner: Owner = {
          id: uid,
          name,
          email,
          phone,
          createdAt: new Date().toISOString()
        };

        // Save owner profile in Firestore
        await setDoc(doc(db, 'owners', uid), newOwner);
        onClose();
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        onClose();
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-emerald-100">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 to-emerald-900 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-emerald-900/80 hover:bg-red-800 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="mx-auto w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center mb-3 shadow">
            <ShieldCheck className="w-6 h-6 text-slate-950" />
          </div>
          
          <h2 className="text-2xl font-bold font-serif">
            {isRegistering ? t.register : t.login}
          </h2>
          <p className="text-emerald-200 text-xs mt-1">
            {lang === 'as' ? 'ফায়াৰবেজ প্ৰমাণীকৰণ (Firebase Auth)' : 'Secure Firebase Authentication'}
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl">
              {error}
            </div>
          )}

          {isRegistering && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {t.name}
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Bhaben Hazarika"
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {t.phone}
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+919864012345"
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              {t.email}
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="owner@gmail.com"
                className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              {t.password}
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-600/30 transition-all flex items-center justify-center space-x-2 mt-4 disabled:opacity-50"
          >
            {loading ? (
              <span>⏳ Processing...</span>
            ) : isRegistering ? (
              <>
                <UserPlus className="w-5 h-5" />
                <span>{t.register}</span>
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                <span>{t.login}</span>
              </>
            )}
          </button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-xs text-emerald-800 hover:text-emerald-950 font-semibold"
            >
              {isRegistering
                ? 'Already have an owner account? Login here'
                : 'New property owner? Register here'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
