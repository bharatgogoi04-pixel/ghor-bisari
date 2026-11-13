import React, { useState } from 'react';
import { Property, Owner, Language } from '../types';
import { translations } from '../data/translations';
import { Plus, Edit, Trash2, CheckCircle2, AlertCircle, Building2, Phone, Mail, X, ShieldCheck, RefreshCw, Check, Clock } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentOwner: Owner;
  properties: Property[];
  onOpenAddModal: () => void;
  onEditProperty: (property: Property) => void;
  onDeleteProperty: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onRenewProperty: (id: string) => void;
  onAdminApprove?: (id: string, approved: boolean) => void;
  lang: Language;
}

// Authorized admin emails configuration (secure server-side / whitelist check)
const ADMIN_EMAILS = ['admin@ghorbisari.com', 'bharatgogoi04@gmail.com'];

export const OwnerDashboard: React.FC<Props> = ({
  isOpen,
  onClose,
  currentOwner,
  properties,
  onOpenAddModal,
  onEditProperty,
  onDeleteProperty,
  onToggleStatus,
  onRenewProperty,
  onAdminApprove,
  lang
}) => {
  const [isAdminMode, setIsAdminMode] = useState(false);

  if (!isOpen) return null;

  const t = translations[lang];
  const myProperties = properties.filter((p) => p.ownerId === currentOwner.id);
  const activeCount = myProperties.filter((p) => p.status === 'AVAILABLE').length;
  const pendingCount = myProperties.filter((p) => p.status === 'PENDING_APPROVAL' || p.status === 'PAYMENT_PENDING').length;

  const isUserAdmin = ADMIN_EMAILS.includes(currentOwner.email.toLowerCase());

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto border border-emerald-100 flex flex-col my-auto">
        
        {/* Header */}
        <div className="sticky top-0 z-20 bg-emerald-950 text-white px-6 py-5 flex items-center justify-between border-b border-emerald-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-slate-950 font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-serif">
                {isAdminMode && isUserAdmin ? 'Admin Approval Panel' : t.ownerDashboardTitle}
              </h2>
              <p className="text-xs text-emerald-200">
                {isAdminMode && isUserAdmin ? 'Review UTR & Approve Listings' : `Welcome, ${currentOwner.name}`}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {isUserAdmin && (
              <button
                onClick={() => setIsAdminMode(!isAdminMode)}
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs"
              >
                {isAdminMode ? 'Owner Dashboard' : 'Admin Panel'}
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-emerald-900 hover:bg-red-800 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-6 space-y-6">
          
          {!isAdminMode || !isUserAdmin ? (
            <>
              {/* Stats Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 flex items-center space-x-4">
                  <div className="w-12 h-12 bg-emerald-600 text-white rounded-xl flex items-center justify-center font-bold text-lg">
                    {myProperties.length}
                  </div>
                  <div>
                    <div className="text-xs text-emerald-800 font-bold uppercase">{t.totalListings}</div>
                    <div className="text-lg font-black text-emerald-950">Properties Listed</div>
                  </div>
                </div>

                <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 flex items-center space-x-4">
                  <div className="w-12 h-12 bg-amber-500 text-slate-950 rounded-xl flex items-center justify-center font-bold text-lg">
                    {activeCount}
                  </div>
                  <div>
                    <div className="text-xs text-amber-800 font-bold uppercase">{t.activeListings}</div>
                    <div className="text-lg font-black text-slate-900">Available Now</div>
                  </div>
                </div>

                <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100 flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-600 text-white rounded-xl flex items-center justify-center font-bold text-lg">
                    {pendingCount}
                  </div>
                  <div>
                    <div className="text-xs text-purple-800 font-bold uppercase">Pending Approval</div>
                    <div className="text-lg font-black text-purple-950">Payment Verification</div>
                  </div>
                </div>
              </div>

              {/* Action Header */}
              <div className="flex items-center justify-between pt-2">
                <h3 className="text-lg font-bold text-slate-900 font-serif">
                  {t.myListings}
                </h3>
                <button
                  onClick={onOpenAddModal}
                  className="flex items-center space-x-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl shadow-md transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t.addNewProperty} (₹99 / 30 Days)</span>
                </button>
              </div>

              {/* My Properties List */}
              {myProperties.length === 0 ? (
                <div className="bg-slate-50 rounded-2xl p-12 text-center border border-slate-200 space-y-3">
                  <Building2 className="w-12 h-12 text-slate-400 mx-auto" />
                  <h4 className="font-bold text-slate-700">No properties listed yet.</h4>
                  <p className="text-xs text-slate-500">Click the button above to add your first rental property.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {myProperties.map((prop) => (
                    <div
                      key={prop.id}
                      className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center space-x-4">
                        <img
                          src={prop.photos[0]}
                          alt=""
                          className="w-20 h-20 rounded-xl object-cover flex-shrink-0 bg-slate-100"
                        />
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                              prop.status === 'AVAILABLE' ? 'bg-emerald-100 text-emerald-800' :
                              prop.status === 'PENDING_APPROVAL' ? 'bg-amber-100 text-amber-800' :
                              prop.status === 'EXPIRED' ? 'bg-red-100 text-red-800' : 'bg-purple-100 text-purple-800'
                            }`}>
                              {prop.status}
                            </span>
                            <span className="text-xs text-slate-500 font-medium">
                              {prop.district} • UTR: {prop.utrNumber || 'N/A'}
                            </span>
                          </div>
                          <h4 className="font-bold text-slate-900 text-base">{prop.title}</h4>
                          <div className="text-xs text-amber-600 font-bold mt-0.5">
                            ₹{prop.monthlyRent.toLocaleString('en-IN')}/month • Expires: {new Date(prop.expiresAt || Date.now()).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                        {prop.status === 'EXPIRED' && (
                          <button
                            onClick={() => onRenewProperty(prop.id)}
                            className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl flex items-center space-x-1"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span>Renew ₹99</span>
                          </button>
                        )}

                        <button
                          onClick={() => onToggleStatus(prop.id)}
                          className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                            prop.status === 'AVAILABLE'
                              ? 'bg-amber-100 hover:bg-amber-200 text-amber-900'
                              : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900'
                          }`}
                        >
                          {prop.status === 'AVAILABLE' ? t.markRented : t.markAvailable}
                        </button>

                        <button
                          onClick={() => onEditProperty(prop)}
                          className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
                          title={t.edit}
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => {
                            if (window.confirm(t.confirmDelete)) {
                              onDeleteProperty(prop.id);
                            }
                          }}
                          className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors"
                          title={t.delete}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            /* Admin Panel: Review all pending listings */
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 text-lg">Pending Listings Approval Queue</h3>
              {properties.filter(p => p.status === 'PENDING_APPROVAL' || p.status === 'PAYMENT_PENDING').length === 0 ? (
                <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-2xl">
                  No pending listings to review. All caught up!
                </div>
              ) : (
                <div className="space-y-4">
                  {properties
                    .filter(p => p.status === 'PENDING_APPROVAL' || p.status === 'PAYMENT_PENDING')
                    .map(prop => (
                      <div key={prop.id} className="bg-slate-50 p-4 rounded-2xl border border-amber-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex items-center space-x-4">
                          <img src={prop.photos[0]} alt="" className="w-16 h-16 rounded-xl object-cover" />
                          <div>
                            <div className="font-bold text-slate-900">{prop.title}</div>
                            <div className="text-xs text-slate-600">Owner ID: {prop.ownerId}</div>
                            <div className="text-xs font-bold text-amber-700 mt-1">
                              UTR: {prop.utrNumber} | District: {prop.district}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => onAdminApprove && onAdminApprove(prop.id, true)}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center space-x-1"
                          >
                            <Check className="w-4 h-4" />
                            <span>Approve & Make Live</span>
                          </button>
                          <button
                            onClick={() => onAdminApprove && onAdminApprove(prop.id, false)}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
