export interface CardDetails {
  id: string;
  cardNumber: string; // e.g., "4152 7489 1234 4637"
  last4: string; // "4637"
  cardholderName: string; // "Aboudacar Whilfried DIOMANDE"
  expiryDate: string; // "08/28"
  cvv: string; // "842"
  balance: number; // 20000
  currency: string; // "F"
  isBlocked: boolean;
  blockedAt?: string;
  blockReason?: 'temporary' | 'lost' | 'stolen';
}

export interface CardSettings {
  monthlyLimit: number; // e.g. 500000
  monthlySpent: number; // e.g. 142000
  weeklyAtmLimit: number; // e.g. 200000
  weeklyAtmSpent: number; // e.g. 40000
  onlinePaymentsEnabled: boolean;
  contactlessEnabled: boolean;
  atmWithdrawalsEnabled: boolean;
  internationalPaymentsEnabled: boolean;
  pinCode: string; // "1234"
}

export interface Merchant {
  id: string;
  name: string;
  category: 'streaming' | 'tech' | 'ecommerce' | 'ads' | 'gaming' | 'custom';
  categoryLabel: string;
  iconName: string;
  description: string;
  isBlocked: boolean;
  lastAttemptAmount?: number;
  lastAttemptDate?: string;
  blockedCount?: number;
}

export interface Transaction {
  id: string;
  title: string;
  subtitle?: string;
  amount: number; // positive or negative
  currency: string;
  date: string;
  type: 'transfer' | 'payment' | 'recharge' | 'merchant_blocked';
  status: 'completed' | 'blocked' | 'pending';
  merchantName?: string;
  reference?: string;
}

export interface AutoRechargeConfig {
  enabled: boolean;
  minimumBalance: number; // e.g. 10000
  topUpAmount: number; // e.g. 25000
  source: 'compte_principal' | 'wave' | 'orange_money' | 'mtn_momo';
}
