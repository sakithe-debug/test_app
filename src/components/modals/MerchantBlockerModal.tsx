import React, { useState } from 'react';
import {
  X,
  Search,
  Ban,
  CheckCircle2,
  Plus,
  ShieldAlert,
  Smartphone,
  Tv,
  Radio,
  ShoppingBag,
  Car,
  Bot,
  Globe,
  SlidersHorizontal,
} from 'lucide-react';
import { Merchant } from '../../types/card';

interface MerchantBlockerModalProps {
  merchants: Merchant[];
  isOpen: boolean;
  onClose: () => void;
  onToggleMerchant: (merchantId: string) => void;
  onToggleAllMerchants: (blockAll: boolean) => void;
  onAddCustomMerchant: (name: string, category: Merchant['category'], description: string) => void;
}

export const MerchantBlockerModal: React.FC<MerchantBlockerModalProps> = ({
  merchants,
  isOpen,
  onClose,
  onToggleMerchant,
  onToggleAllMerchants,
  onAddCustomMerchant,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMerchantName, setNewMerchantName] = useState('');
  const [newMerchantDesc, setNewMerchantDesc] = useState('');
  const [newMerchantCat, setNewMerchantCat] = useState<Merchant['category']>('streaming');

  if (!isOpen) return null;

  const blockedCount = merchants.filter((m) => m.isBlocked).length;
  const allBlocked = merchants.length > 0 && merchants.every((m) => m.isBlocked);

  const filteredMerchants = merchants.filter((merchant) => {
    const matchesSearch =
      merchant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      merchant.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'blocked') return merchant.isBlocked;
    if (selectedFilter === 'active') return !merchant.isBlocked;
    return merchant.category === selectedFilter;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMerchantName.trim()) return;
    onAddCustomMerchant(
      newMerchantName.trim(),
      newMerchantCat,
      newMerchantDesc.trim() || 'Marchand personnalisé bloqué'
    );
    setNewMerchantName('');
    setNewMerchantDesc('');
    setShowAddModal(false);
  };

  const getMerchantIcon = (m: Merchant) => {
    switch (m.iconName) {
      case 'google':
        return (
          <div className="w-10 h-10 rounded-full bg-white border border-zinc-200 flex items-center justify-center font-bold text-base text-zinc-800 shadow-xs">
            <span className="text-red-500 font-extrabold">G</span>
          </div>
        );
      case 'apple':
        return (
          <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm shadow-xs">
            <Smartphone className="w-5 h-5 text-white" />
          </div>
        );
      case 'netflix':
        return (
          <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center font-black text-rose-600 text-sm shadow-xs">
            N
          </div>
        );
      case 'meta':
        return (
          <div className="w-10 h-10 rounded-full bg-[#0081FB] text-white flex items-center justify-center font-bold text-sm shadow-xs">
            f
          </div>
        );
      case 'spotify':
        return (
          <div className="w-10 h-10 rounded-full bg-[#1DB954] text-black flex items-center justify-center font-bold shadow-xs">
            <Radio className="w-5 h-5 text-black" />
          </div>
        );
      case 'amazon':
        return (
          <div className="w-10 h-10 rounded-full bg-[#232F3E] text-amber-400 flex items-center justify-center font-bold text-xs shadow-xs">
            a
          </div>
        );
      case 'car':
        return (
          <div className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center shadow-xs">
            <Car className="w-5 h-5" />
          </div>
        );
      case 'bot':
        return (
          <div className="w-10 h-10 rounded-full bg-emerald-700 text-white flex items-center justify-center shadow-xs">
            <Bot className="w-5 h-5" />
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm shadow-xs">
            <ShoppingBag className="w-5 h-5" />
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
      <div className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col shadow-2xl animate-slideUp overflow-hidden">
        {/* Header */}
        <div className="p-5 pb-3 border-b border-zinc-100 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
                <Ban className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-zinc-900 leading-tight">
                  Paiements marchands
                </h3>
                <p className="text-xs text-zinc-500">
                  {blockedCount} sur {merchants.length} bloqués
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

          <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
            Bloquez les abonnements et débits automatiques récurrents. Tout prélèvement tenté par un marchand bloqué sera rejeté sans frais.
          </p>

          {/* Master Toggle Banner */}
          <div className="mt-3 p-3 bg-zinc-50 border border-zinc-200/80 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShieldAlert className="w-5 h-5 text-rose-500" />
              <div>
                <span className="text-xs font-bold text-zinc-900 block">
                  Bloquer tous les marchands
                </span>
                <span className="text-[11px] text-zinc-500">
                  {allBlocked ? 'Tous les marchands sont rejetés' : 'Rejeter tous les prélèvements en ligne'}
                </span>
              </div>
            </div>
            <button
              onClick={() => onToggleAllMerchants(!allBlocked)}
              type="button"
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 cursor-pointer ${
                allBlocked ? 'bg-rose-600 justify-end' : 'bg-zinc-300 justify-start'
              }`}
            >
              <div className="bg-white w-4 h-4 rounded-full shadow-md" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative mt-3">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher Google, Netflix, Apple, Uber..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-100 focus:bg-white text-xs pl-9 pr-8 py-2.5 rounded-xl border border-transparent focus:border-indigo-500 focus:outline-none transition-all placeholder:text-zinc-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filters pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-2.5 text-[11px] font-semibold">
            {[
              { id: 'all', label: 'Tous' },
              { id: 'blocked', label: `Bloqués (${blockedCount})` },
              { id: 'streaming', label: 'Streaming' },
              { id: 'tech', label: 'Tech & Apps' },
              { id: 'ecommerce', label: 'E-commerce' },
              { id: 'ads', label: 'Publicités' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedFilter(f.id)}
                className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors ${
                  selectedFilter === f.id
                    ? 'bg-zinc-900 text-white'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Merchants List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5 no-scrollbar">
          {filteredMerchants.length === 0 ? (
            <div className="text-center py-10">
              <Ban className="w-10 h-10 text-zinc-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-zinc-700">Aucun marchand trouvé</p>
              <p className="text-xs text-zinc-400 mt-1">
                Vous pouvez ajouter un marchand manuellement pour le bloquer.
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                type="button"
                className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-full text-xs font-bold hover:bg-indigo-700"
              >
                + Ajouter ce marchand
              </button>
            </div>
          ) : (
            filteredMerchants.map((merchant) => (
              <div
                key={merchant.id}
                className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                  merchant.isBlocked
                    ? 'bg-rose-50/40 border-rose-200/80 shadow-xs'
                    : 'bg-white border-zinc-100 shadow-xs hover:border-zinc-200'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 pr-3">
                  {getMerchantIcon(merchant)}
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-zinc-900 truncate">
                        {merchant.name}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          merchant.isBlocked
                            ? 'bg-rose-100 text-rose-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {merchant.isBlocked ? 'Bloqué' : 'Autorisé'}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 truncate mt-0.5">
                      {merchant.description}
                    </p>
                    {merchant.isBlocked && merchant.lastAttemptAmount && (
                      <p className="text-[10px] text-rose-600 font-semibold mt-0.5">
                        Dernière tentative rejetée : {new Intl.NumberFormat('de-DE').format(merchant.lastAttemptAmount)} F
                      </p>
                    )}
                  </div>
                </div>

                {/* Toggle Button */}
                <button
                  onClick={() => onToggleMerchant(merchant.id)}
                  type="button"
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 shrink-0 cursor-pointer ${
                    merchant.isBlocked ? 'bg-rose-600 justify-end' : 'bg-emerald-500 justify-start'
                  }`}
                  aria-label={merchant.isBlocked ? 'Autoriser ce marchand' : 'Bloquer ce marchand'}
                >
                  <div className="bg-white w-4 h-4 rounded-full shadow-md" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-zinc-100 bg-zinc-50 flex items-center justify-between gap-3 shrink-0">
          <button
            onClick={() => setShowAddModal(true)}
            type="button"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white border border-zinc-200 text-xs font-bold text-zinc-800 hover:bg-zinc-100 shadow-xs active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4 text-indigo-600 stroke-[3]" />
            <span>Ajouter un marchand</span>
          </button>

          <button
            onClick={onClose}
            type="button"
            className="px-6 py-2.5 bg-zinc-900 hover:bg-black text-white rounded-full text-xs font-bold shadow-md active:scale-95 transition-all"
          >
            Terminé
          </button>
        </div>

        {/* Sub-modal: Add Custom Merchant */}
        {showAddModal && (
          <div className="absolute inset-0 bg-white z-20 p-5 flex flex-col justify-between animate-fadeIn">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                <h4 className="text-base font-bold text-zinc-900">
                  Bloquer un marchand personnalisé
                </h4>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="w-8 h-8 rounded-full bg-zinc-100 text-zinc-500 hover:bg-zinc-200 flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddSubmit} className="space-y-4 pt-4">
                <div>
                  <label className="text-xs font-bold text-zinc-700 block mb-1">
                    Nom du marchand ou site
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Canal+, Deezer, AliExpress, OpenAI"
                    value={newMerchantName}
                    onChange={(e) => setNewMerchantName(e.target.value)}
                    className="w-full text-sm p-3 rounded-xl border border-zinc-300 focus:border-indigo-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-700 block mb-1">
                    Catégorie
                  </label>
                  <select
                    value={newMerchantCat}
                    onChange={(e) => setNewMerchantCat(e.target.value as Merchant['category'])}
                    className="w-full text-sm p-3 rounded-xl border border-zinc-300 focus:border-indigo-600 focus:outline-none bg-white"
                  >
                    <option value="streaming">Streaming & Multimédia</option>
                    <option value="tech">Tech & Applications</option>
                    <option value="ecommerce">E-commerce & Achats</option>
                    <option value="ads">Publicités (Meta, Google, TikTok)</option>
                    <option value="gaming">Jeux vidéo</option>
                    <option value="custom">Autre service en ligne</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-700 block mb-1">
                    Description ou notes (optionnel)
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Prélèvement récurrent mensuel"
                    value={newMerchantDesc}
                    onChange={(e) => setNewMerchantDesc(e.target.value)}
                    className="w-full text-sm p-3 rounded-xl border border-zinc-300 focus:border-indigo-600 focus:outline-none"
                  />
                </div>
              </form>
            </div>

            <div className="pt-4 flex gap-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-3 rounded-full border border-zinc-200 text-xs font-bold text-zinc-700 hover:bg-zinc-50"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleAddSubmit}
                className="flex-1 py-3 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md"
              >
                Bloquer ce marchand
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
