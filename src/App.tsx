/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BalanceCard } from './components/BalanceCard';
import { DjamoCard } from './components/DjamoCard';
import { ActionButtons } from './components/ActionButtons';
import { FeatureList } from './components/FeatureList';
import { TransactionHistory } from './components/TransactionHistory';
import { BlockCardModal } from './components/modals/BlockCardModal';
import { MerchantBlockerModal } from './components/modals/MerchantBlockerModal';
import { SettingsModal } from './components/modals/SettingsModal';
import { CurrencyModal } from './components/modals/CurrencyModal';
import { RechargeModal } from './components/modals/RechargeModal';
import { AutoRechargeModal } from './components/modals/AutoRechargeModal';
import { HelpModal } from './components/modals/HelpModal';
import { Toast, ToastMessage } from './components/Toast';
import {
  initialCard,
  initialSettings,
  initialMerchants,
  initialTransactions,
  initialAutoRecharge,
} from './data/mockData';
import { CardDetails, CardSettings, Merchant, Transaction, AutoRechargeConfig } from './types/card';

export default function App() {
  // Persistence via localStorage
  const [card, setCard] = useState<CardDetails>(() => {
    try {
      const saved = localStorage.getItem('djamo_card');
      return saved ? JSON.parse(saved) : initialCard;
    } catch {
      return initialCard;
    }
  });

  const [settings, setSettings] = useState<CardSettings>(() => {
    try {
      const saved = localStorage.getItem('djamo_settings');
      return saved ? JSON.parse(saved) : initialSettings;
    } catch {
      return initialSettings;
    }
  });

  const [merchants, setMerchants] = useState<Merchant[]>(() => {
    try {
      const saved = localStorage.getItem('djamo_merchants');
      return saved ? JSON.parse(saved) : initialMerchants;
    } catch {
      return initialMerchants;
    }
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem('djamo_transactions');
      return saved ? JSON.parse(saved) : initialTransactions;
    } catch {
      return initialTransactions;
    }
  });

  const [autoRecharge, setAutoRecharge] = useState<AutoRechargeConfig>(() => {
    try {
      const saved = localStorage.getItem('djamo_autorecharge');
      return saved ? JSON.parse(saved) : initialAutoRecharge;
    } catch {
      return initialAutoRecharge;
    }
  });

  // UI state
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Modal open states
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [isMerchantBlockerOpen, setIsMerchantBlockerOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isCurrencyModalOpen, setIsCurrencyModalOpen] = useState(false);
  const [rechargeModalMode, setRechargeModalMode] = useState<'recharge' | 'withdraw' | null>(null);
  const [isAutoRechargeModalOpen, setIsAutoRechargeModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  // Save to localStorage whenever state updates
  useEffect(() => {
    try {
      localStorage.setItem('djamo_card', JSON.stringify(card));
    } catch (e) {
      console.error(e);
    }
  }, [card]);

  useEffect(() => {
    try {
      localStorage.setItem('djamo_settings', JSON.stringify(settings));
    } catch (e) {
      console.error(e);
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem('djamo_merchants', JSON.stringify(merchants));
    } catch (e) {
      console.error(e);
    }
  }, [merchants]);

  useEffect(() => {
    try {
      localStorage.setItem('djamo_transactions', JSON.stringify(transactions));
    } catch (e) {
      console.error(e);
    }
  }, [transactions]);

  useEffect(() => {
    try {
      localStorage.setItem('djamo_autorecharge', JSON.stringify(autoRecharge));
    } catch (e) {
      console.error(e);
    }
  }, [autoRecharge]);

  const showToast = (message: string, type: 'success' | 'warning' | 'info' = 'success') => {
    setToast({ id: Date.now().toString(), type, message });
    setTimeout(() => {
      setToast((curr) => (curr?.message === message ? null : curr));
    }, 3500);
  };

  // Card Block / Unlock Handler
  const handleToggleBlock = (reason?: 'temporary' | 'lost' | 'stolen') => {
    const nextState = !card.isBlocked;
    setCard((prev) => ({
      ...prev,
      isBlocked: nextState,
      blockReason: nextState ? reason || 'temporary' : undefined,
      blockedAt: nextState ? new Date().toISOString() : undefined,
    }));

    if (nextState) {
      showToast(
        reason === 'stolen'
          ? 'Carte mise en opposition définitive.'
          : 'Carte verrouillée avec succès. Vos paiements sont suspendus.',
        'warning'
      );
    } else {
      showToast('Carte débloquée avec succès. Vos paiements sont réactivés.', 'success');
    }
  };

  // Quick toggle without modal
  const handleQuickToggleBlock = () => {
    if (card.isBlocked) {
      handleToggleBlock();
    } else {
      setIsBlockModalOpen(true);
    }
  };

  // Merchant Blocker Handlers
  const handleToggleMerchant = (merchantId: string) => {
    const target = merchants.find((m) => m.id === merchantId);
    if (!target) return;

    const nextBlocked = !target.isBlocked;
    setMerchants((prev) =>
      prev.map((m) => (m.id === merchantId ? { ...m, isBlocked: nextBlocked } : m))
    );

    if (nextBlocked) {
      showToast(`Paiements ${target.name} bloqués. Rejet automatique activé.`, 'warning');
    } else {
      showToast(`Paiements ${target.name} autorisés.`, 'success');
    }
  };

  const handleToggleAllMerchants = (blockAll: boolean) => {
    setMerchants((prev) => prev.map((m) => ({ ...m, isBlocked: blockAll })));
    if (blockAll) {
      showToast('Tous les marchands numériques sont désormais bloqués.', 'warning');
    } else {
      showToast('Tous les marchands sont autorisés.', 'success');
    }
  };

  const handleAddCustomMerchant = (
    name: string,
    category: Merchant['category'],
    description: string
  ) => {
    const newMerchant: Merchant = {
      id: `custom_${Date.now()}`,
      name,
      category,
      categoryLabel: category === 'streaming' ? 'Streaming' : 'Service en ligne',
      iconName: 'custom',
      description,
      isBlocked: true,
    };
    setMerchants((prev) => [newMerchant, ...prev]);
    showToast(`Marchand "${name}" ajouté et bloqué avec succès !`, 'success');
  };

  // Settings Handlers
  const handleUpdateSettings = (newVals: Partial<CardSettings>) => {
    setSettings((prev) => ({ ...prev, ...newVals }));
    showToast('Paramètres mis à jour.', 'success');
  };

  // Recharge / Withdraw Handler
  const handleRechargeOrWithdraw = (amount: number, source: string) => {
    const isRecharge = rechargeModalMode === 'recharge';
    const formattedAmount = new Intl.NumberFormat('de-DE').format(amount);

    if (isRecharge) {
      setCard((prev) => ({ ...prev, balance: prev.balance + amount }));
      const newTx: Transaction = {
        id: `tx_${Date.now()}`,
        title: source === 'compte_principal' ? 'Recharge Compte Principal' : 'Recharge Mobile Money',
        subtitle: `Crédit de carte instantané`,
        amount: amount,
        currency: 'F',
        date: "Aujourd'hui à " + new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        type: 'recharge',
        status: 'completed',
        reference: `DJM-${Math.floor(10000000 + Math.random() * 90000000)}`,
      };
      setTransactions((prev) => [newTx, ...prev]);
      showToast(`Recharge de ${formattedAmount} F effectuée avec succès !`, 'success');
    } else {
      setCard((prev) => ({ ...prev, balance: Math.max(0, prev.balance - amount) }));
      const newTx: Transaction = {
        id: `tx_${Date.now()}`,
        title: 'Vers Principal',
        subtitle: `Virement interne vers compte principal`,
        amount: -amount,
        currency: 'F',
        date: "Aujourd'hui à " + new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        type: 'transfer',
        status: 'completed',
        reference: `DJM-${Math.floor(10000000 + Math.random() * 90000000)}`,
      };
      setTransactions((prev) => [newTx, ...prev]);
      showToast(`Retrait de ${formattedAmount} F vers votre Compte Principal effectué !`, 'success');
    }
  };

  return (
    <div className="min-h-screen bg-[#0C0D11] text-zinc-900 flex justify-center items-start sm:py-6 sm:px-4 font-sans select-none">
      {/* Toast Notification */}
      <Toast toast={toast} onDismiss={() => setToast(null)} />

      {/* Mobile App Container (No phone frame, clean native app container) */}
      <main className="w-full max-w-[430px] min-h-screen sm:min-h-[880px] bg-white sm:rounded-[36px] shadow-2xl flex flex-col overflow-hidden relative border border-white/5">
        {/* Top Dark Curved Header matching screenshot */}
        <div className="relative bg-[#1A1C20] pb-6">
          <Header
            onOpenHelp={() => setIsHelpModalOpen(true)}
            onClose={() => showToast('Session active', 'info')}
          />

          {/* Balance Card overlapping between dark header and body */}
          <div className="mt-1">
            <BalanceCard
              balance={card.balance}
              currency={card.currency}
              isBalanceVisible={isBalanceVisible}
              onToggleBalanceVisibility={() => setIsBalanceVisible(!isBalanceVisible)}
              onRecharge={() => setRechargeModalMode('recharge')}
              onWithdraw={() => setRechargeModalMode('withdraw')}
            />
          </div>
        </div>

        {/* Scrollable Main App Body */}
        <div className="flex-1 overflow-y-auto no-scrollbar bg-white pt-2">
          {/* Card Presentation with Flip & Les Éléphants graphic */}
          <DjamoCard
            card={card}
            onQuickToggleBlock={handleQuickToggleBlock}
            onOpenSettings={() => setIsSettingsModalOpen(true)}
          />

          {/* Action Buttons: Bloquer, Devise, Paramètres */}
          <ActionButtons
            isBlocked={card.isBlocked}
            onBlockClick={() => setIsBlockModalOpen(true)}
            onCurrencyClick={() => setIsCurrencyModalOpen(true)}
            onSettingsClick={() => setIsSettingsModalOpen(true)}
          />

          {/* Quick Features: Bloquer paiements marchand & Rechargement auto */}
          <FeatureList
            merchants={merchants}
            autoRecharge={autoRecharge}
            onOpenMerchantBlocker={() => setIsMerchantBlockerOpen(true)}
            onOpenAutoRecharge={() => setIsAutoRechargeModalOpen(true)}
          />

          {/* Recent Transaction History matching screenshot */}
          <TransactionHistory transactions={transactions} />
        </div>

        {/* Home Indicator Bar at the bottom (Mobile native feel) */}
        <div className="w-full bg-white py-2 flex items-center justify-center shrink-0 border-t border-zinc-100/60">
          <div className="w-32 h-1 bg-zinc-900 rounded-full" />
        </div>
      </main>

      {/* Modals for requested features */}
      <BlockCardModal
        card={card}
        isOpen={isBlockModalOpen}
        onClose={() => setIsBlockModalOpen(false)}
        onToggleBlock={handleToggleBlock}
      />

      <MerchantBlockerModal
        merchants={merchants}
        isOpen={isMerchantBlockerOpen}
        onClose={() => setIsMerchantBlockerOpen(false)}
        onToggleMerchant={handleToggleMerchant}
        onToggleAllMerchants={handleToggleAllMerchants}
        onAddCustomMerchant={handleAddCustomMerchant}
      />

      <SettingsModal
        card={card}
        settings={settings}
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        onUpdateSettings={handleUpdateSettings}
      />

      <CurrencyModal
        isOpen={isCurrencyModalOpen}
        onClose={() => setIsCurrencyModalOpen(false)}
        currentBalance={card.balance}
      />

      <RechargeModal
        mode={rechargeModalMode || 'recharge'}
        isOpen={rechargeModalMode !== null}
        onClose={() => setRechargeModalMode(null)}
        currentBalance={card.balance}
        onConfirm={handleRechargeOrWithdraw}
      />

      <AutoRechargeModal
        config={autoRecharge}
        isOpen={isAutoRechargeModalOpen}
        onClose={() => setIsAutoRechargeModalOpen(false)}
        onSave={(cfg) => {
          setAutoRecharge(cfg);
          showToast('Configuration du rechargement automatique enregistrée !', 'success');
        }}
      />

      <HelpModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
        onEmergencyBlock={() => {
          setIsHelpModalOpen(false);
          setIsBlockModalOpen(true);
        }}
      />
    </div>
  );
}
