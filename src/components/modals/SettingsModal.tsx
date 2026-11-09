import React, { useState } from 'react';
import {
  X,
  Settings,
  Shield,
  CreditCard,
  Globe,
  Wifi,
  Banknote,
  KeyRound,
  Eye,
  Check,
  AlertCircle,
  HelpCircle,
  RotateCcw,
} from 'lucide-react';
import { CardSettings, CardDetails } from '../../types/card';

interface SettingsModalProps {
  card: CardDetails;
  settings: CardSettings;
  isOpen: boolean;
  onClose: () => void;
  onUpdateSettings: (newSettings: Partial<CardSettings>) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  card,
  settings,
  isOpen,
  onClose,
  onUpdateSettings,
}) => {
  const [activeTab, setActiveTab] = useState<'limits' | 'channels' | 'security'>('limits');
  const [showPinModal, setShowPinModal] = useState(false);
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [pinStep, setPinStep] = useState<'old' | 'new' | 'confirm'>('old');
  const [pinError, setPinError] = useState('');
  const [pinSuccess, setPinSuccess] = useState(false);

  if (!isOpen) return null;

  const formatAmount = (val: number) => new Intl.NumberFormat('de-DE').format(val);

  // Handle PIN input
  const handlePinDigit = (digit: string) => {
    setPinError('');
    if (pinStep === 'old') {
      if (currentPin.length < 4) {
        const updated = currentPin + digit;
        setCurrentPin(updated);
        if (updated.length === 4) {
          if (updated === settings.pinCode) {
            setPinStep('new');
          } else {
            setPinError('Code PIN actuel incorrect');
            setCurrentPin('');
          }
        }
      }
    } else if (pinStep === 'new') {
      if (newPin.length < 4) {
        const updated = newPin + digit;
        setNewPin(updated);
        if (updated.length === 4) {
          onUpdateSettings({ pinCode: updated });
          setPinSuccess(true);
          setTimeout(() => {
            setShowPinModal(false);
            setPinStep('old');
            setCurrentPin('');
            setNewPin('');
            setPinSuccess(false);
          }, 1500);
        }
      }
    }
  };

  const handleBackspacePin = () => {
    if (pinStep === 'old') {
      setCurrentPin((prev) => prev.slice(0, -1));
    } else {
      setNewPin((prev) => prev.slice(0, -1));
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
      <div className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col shadow-2xl animate-slideUp overflow-hidden">
        {/* Header */}
        <div className="p-5 pb-3 border-b border-zinc-100 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center">
                <Settings className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-zinc-900 leading-tight">
                  Paramètres de la carte
                </h3>
                <p className="text-xs text-zinc-500">
                  Carte Visa •••• {card.last4}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              type="button"
              className="w-8 h-8 rounded-full bg-zinc-100 text-zinc-500 hover:bg-zinc-200 flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="grid grid-cols-3 gap-1 bg-zinc-100 p-1 rounded-xl mt-4 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('limits')}
              className={`py-1.5 rounded-lg transition-all ${
                activeTab === 'limits' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              Plafonds
            </button>
            <button
              onClick={() => setActiveTab('channels')}
              className={`py-1.5 rounded-lg transition-all ${
                activeTab === 'channels' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              Canaux
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`py-1.5 rounded-lg transition-all ${
                activeTab === 'security' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              Code PIN
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 no-scrollbar">
          {/* TAB 1: LIMITS */}
          {activeTab === 'limits' && (
            <div className="space-y-5">
              {/* Plafond de paiement mensuel */}
              <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-200/70 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-zinc-900 block">
                      Plafond mensuel de paiement
                    </span>
                    <span className="text-[11px] text-zinc-500">
                      Magasins, internet et abonnements
                    </span>
                  </div>
                  <span className="text-sm font-extrabold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200/50">
                    {formatAmount(settings.monthlyLimit)} F
                  </span>
                </div>

                {/* Progress bar */}
                <div>
                  <div className="flex justify-between text-[11px] font-medium text-zinc-500 mb-1.5">
                    <span>Dépensé : {formatAmount(settings.monthlySpent)} F</span>
                    <span>Restant : {formatAmount(Math.max(0, settings.monthlyLimit - settings.monthlySpent))} F</span>
                  </div>
                  <div className="w-full h-2.5 bg-zinc-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 rounded-full transition-all"
                      style={{
                        width: `${Math.min(100, (settings.monthlySpent / settings.monthlyLimit) * 100)}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Slider */}
                <div className="pt-2">
                  <div className="flex justify-between text-[10px] text-zinc-400 font-semibold mb-1">
                    <span>100.000 F</span>
                    <span>Ajuster le plafond</span>
                    <span>2.000.000 F</span>
                  </div>
                  <input
                    type="range"
                    min="100000"
                    max="2000000"
                    step="50000"
                    value={settings.monthlyLimit}
                    onChange={(e) => onUpdateSettings({ monthlyLimit: Number(e.target.value) })}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>
              </div>

              {/* Plafond hebdomadaire DAB */}
              <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-200/70 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-zinc-900 block">
                      Plafond de retrait DAB (7 jours)
                    </span>
                    <span className="text-[11px] text-zinc-500">
                      Distributeurs automatiques de billets
                    </span>
                  </div>
                  <span className="text-sm font-extrabold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/50">
                    {formatAmount(settings.weeklyAtmLimit)} F
                  </span>
                </div>

                {/* Progress bar */}
                <div>
                  <div className="flex justify-between text-[11px] font-medium text-zinc-500 mb-1.5">
                    <span>Retiré : {formatAmount(settings.weeklyAtmSpent)} F</span>
                    <span>Restant : {formatAmount(Math.max(0, settings.weeklyAtmLimit - settings.weeklyAtmSpent))} F</span>
                  </div>
                  <div className="w-full h-2.5 bg-zinc-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full transition-all"
                      style={{
                        width: `${Math.min(100, (settings.weeklyAtmSpent / settings.weeklyAtmLimit) * 100)}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Slider */}
                <div className="pt-2">
                  <div className="flex justify-between text-[10px] text-zinc-400 font-semibold mb-1">
                    <span>50.000 F</span>
                    <span>Ajuster le plafond</span>
                    <span>500.000 F</span>
                  </div>
                  <input
                    type="range"
                    min="50000"
                    max="500000"
                    step="25000"
                    value={settings.weeklyAtmLimit}
                    onChange={(e) => onUpdateSettings({ weeklyAtmLimit: Number(e.target.value) })}
                    className="w-full accent-amber-600 cursor-pointer"
                  />
                </div>
              </div>

              <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-2xl flex items-start gap-2.5 text-xs text-indigo-900">
                <Shield className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <span>
                  Vos modifications de plafonds prennent effet immédiatement sans frais ni démarche supplémentaire.
                </span>
              </div>
            </div>
          )}

          {/* TAB 2: CHANNELS */}
          {activeTab === 'channels' && (
            <div className="space-y-3">
              {/* Channel 1: Online Payments */}
              <div className="p-3.5 bg-white border border-zinc-200/80 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-zinc-900 block">
                      Paiements sur Internet
                    </span>
                    <span className="text-[11px] text-zinc-500">
                      Achats e-commerce et abonnements
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    onUpdateSettings({ onlinePaymentsEnabled: !settings.onlinePaymentsEnabled })
                  }
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 cursor-pointer ${
                    settings.onlinePaymentsEnabled ? 'bg-indigo-600 justify-end' : 'bg-zinc-300 justify-start'
                  }`}
                >
                  <div className="bg-white w-4 h-4 rounded-full shadow-md" />
                </button>
              </div>

              {/* Channel 2: Contactless */}
              <div className="p-3.5 bg-white border border-zinc-200/80 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Wifi className="w-5 h-5 rotate-90" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-zinc-900 block">
                      Paiement sans contact (NFC)
                    </span>
                    <span className="text-[11px] text-zinc-500">
                      Jusqu'à 30.000 F sans saisir le code PIN
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    onUpdateSettings({ contactlessEnabled: !settings.contactlessEnabled })
                  }
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 cursor-pointer ${
                    settings.contactlessEnabled ? 'bg-emerald-600 justify-end' : 'bg-zinc-300 justify-start'
                  }`}
                >
                  <div className="bg-white w-4 h-4 rounded-full shadow-md" />
                </button>
              </div>

              {/* Channel 3: ATM Withdrawals */}
              <div className="p-3.5 bg-white border border-zinc-200/80 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Banknote className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-zinc-900 block">
                      Retraits aux distributeurs (DAB)
                    </span>
                    <span className="text-[11px] text-zinc-500">
                      Retrait d'espèces sur tous les DAB Visa
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    onUpdateSettings({ atmWithdrawalsEnabled: !settings.atmWithdrawalsEnabled })
                  }
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 cursor-pointer ${
                    settings.atmWithdrawalsEnabled ? 'bg-amber-600 justify-end' : 'bg-zinc-300 justify-start'
                  }`}
                >
                  <div className="bg-white w-4 h-4 rounded-full shadow-md" />
                </button>
              </div>

              {/* Channel 4: International */}
              <div className="p-3.5 bg-white border border-zinc-200/80 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-violet-50 text-violet-600 flex items-center justify-center">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-zinc-900 block">
                      Paiements Internationaux
                    </span>
                    <span className="text-[11px] text-zinc-500">
                      Hors zone UEMOA / à l'étranger
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    onUpdateSettings({
                      internationalPaymentsEnabled: !settings.internationalPaymentsEnabled,
                    })
                  }
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 cursor-pointer ${
                    settings.internationalPaymentsEnabled ? 'bg-violet-600 justify-end' : 'bg-zinc-300 justify-start'
                  }`}
                >
                  <div className="bg-white w-4 h-4 rounded-full shadow-md" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: SECURITY & PIN */}
          {activeTab === 'security' && (
            <div className="space-y-4">
              <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <KeyRound className="w-5 h-5 text-indigo-600" />
                    <div>
                      <span className="text-xs font-bold text-zinc-900 block">
                        Code PIN de la carte
                      </span>
                      <span className="text-[11px] text-zinc-500">
                        Code secret à 4 chiffres pour DAB et TPE
                      </span>
                    </div>
                  </div>
                  <span className="font-mono text-sm tracking-widest text-zinc-600 font-bold bg-white px-2 py-0.5 rounded border border-zinc-200">
                    ••••
                  </span>
                </div>

                <button
                  onClick={() => setShowPinModal(true)}
                  type="button"
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-2"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>Modifier le code PIN</span>
                </button>
              </div>

              {/* Card Replacement */}
              <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-200/80 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-zinc-900 block">
                    Remplacer la carte
                  </span>
                  <span className="text-[11px] text-zinc-500">
                    En cas de détérioration ou perte
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => alert("Votre demande de renouvellement de carte a été enregistrée. Un agent Djamo vous contactera.")}
                  className="px-3.5 py-1.5 rounded-full border border-zinc-300 text-xs font-bold text-zinc-700 hover:bg-white active:scale-95 transition-all"
                >
                  Commander
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-100 bg-zinc-50 flex justify-end shrink-0">
          <button
            onClick={onClose}
            type="button"
            className="w-full py-3 bg-zinc-900 hover:bg-black text-white rounded-full text-xs font-bold shadow-md active:scale-95 transition-all"
          >
            Enregistrer les modifications
          </button>
        </div>

        {/* PIN Change Dialog Sub-modal */}
        {showPinModal && (
          <div className="absolute inset-0 bg-white z-30 p-5 flex flex-col justify-between animate-fadeIn">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                <h4 className="text-base font-bold text-zinc-900">
                  {pinStep === 'old' ? 'Entrez le PIN actuel' : 'Choisissez un nouveau PIN'}
                </h4>
                <button
                  onClick={() => {
                    setShowPinModal(false);
                    setCurrentPin('');
                    setNewPin('');
                    setPinStep('old');
                  }}
                  className="w-8 h-8 rounded-full bg-zinc-100 text-zinc-500 hover:bg-zinc-200 flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="text-center py-6">
                <p className="text-xs text-zinc-500 mb-4">
                  {pinStep === 'old'
                    ? 'Saisissez votre code PIN actuel (Par défaut: 2468)'
                    : 'Définissez votre nouveau code à 4 chiffres'}
                </p>

                {/* PIN Dots */}
                <div className="flex items-center justify-center gap-4 my-2">
                  {[0, 1, 2, 3].map((idx) => {
                    const val = pinStep === 'old' ? currentPin : newPin;
                    const filled = idx < val.length;
                    return (
                      <div
                        key={idx}
                        className={`w-4 h-4 rounded-full border-2 transition-all ${
                          filled
                            ? 'bg-indigo-600 border-indigo-600 scale-110'
                            : 'border-zinc-300 bg-white'
                        }`}
                      />
                    );
                  })}
                </div>

                {pinError && (
                  <p className="text-xs text-rose-600 font-semibold mt-3 flex items-center justify-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {pinError}
                  </p>
                )}

                {pinSuccess && (
                  <p className="text-xs text-emerald-600 font-semibold mt-3 flex items-center justify-center gap-1">
                    <Check className="w-4 h-4" />
                    Code PIN modifié avec succès !
                  </p>
                )}
              </div>

              {/* Numeric Keypad */}
              <div className="grid grid-cols-3 gap-2.5 max-w-[260px] mx-auto">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => handlePinDigit(num)}
                    className="h-12 rounded-xl bg-zinc-100 hover:bg-zinc-200 active:scale-95 text-lg font-bold text-zinc-800 transition-all flex items-center justify-center"
                  >
                    {num}
                  </button>
                ))}
                <div />
                <button
                  type="button"
                  onClick={() => handlePinDigit('0')}
                  className="h-12 rounded-xl bg-zinc-100 hover:bg-zinc-200 active:scale-95 text-lg font-bold text-zinc-800 transition-all flex items-center justify-center"
                >
                  0
                </button>
                <button
                  type="button"
                  onClick={handleBackspacePin}
                  className="h-12 rounded-xl bg-zinc-100 hover:bg-zinc-200 active:scale-95 text-sm font-semibold text-zinc-700 transition-all flex items-center justify-center"
                >
                  Effacer
                </button>
              </div>
            </div>

            <div className="pt-2 text-center">
              <span className="text-[11px] text-zinc-400">
                Ne partagez jamais votre code PIN avec qui que ce soit.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
