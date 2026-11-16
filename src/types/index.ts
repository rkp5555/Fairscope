export type Currency = 'INR' | 'USD' | 'EUR';

export interface CurrencyConfig {
  code: Currency;
  symbol: string;
  label: string;
  rateToInr: number;
}

export const CURRENCIES: Record<Currency, CurrencyConfig> = {
  INR: { code: 'INR', symbol: '₹', label: 'INR (₹)', rateToInr: 1 },
  USD: { code: 'USD', symbol: '$', label: 'USD ($)', rateToInr: 85 },
  EUR: { code: 'EUR', symbol: '€', label: 'EUR (€)', rateToInr: 92 },
};

export type ClientSensitivity = 'new' | 'partner' | 'repeat_creeper';

export type Channel = 'whatsapp' | 'email' | 'slack';

export type Verdict = 'OUT_OF_SCOPE' | 'PARTIAL_CREEP' | 'IN_SCOPE';

export type ItemStatus = 'covered' | 'exceeds_limit' | 'excluded_new';

export interface RequestItem {
  id: string;
  ask: string;
  status: ItemStatus;
  citation: string;
  effortHours: number;
  estimatedCost: number;
}

export interface ClientResponses {
  warmCollaborative: string;
  firmBoundary: string;
  paidUpsell: string;
}

export interface ScopeAddendum {
  projectReference: string;
  clientName: string;
  date: string;
  addedDeliverables: string[];
  additionalCost: number;
  revisedDeliveryDate: string;
  termsNote: string;
}

export interface AuditResult {
  id: string;
  timestamp: string;
  projectName: string;
  clientChannel: Channel;
  verdict: Verdict;
  riskScore: number; // 0 - 100
  summary: string;
  extraHours: number;
  unbilledRevenue: number;
  quotedAmount: number;
  items: RequestItem[];
  responses: ClientResponses;
  addendum: ScopeAddendum;
  contractSnippet?: string;
  clientMessage?: string;
  hourlyRate: number;
  currency: Currency;
  syncedToWebhook?: boolean;
}

export interface AppSettings {
  apiKey: string;
  selectedModel: string;
  currency: Currency;
  hourlyRate: number;
  webhookUrl: string;
  demoMode: boolean;
  theme: 'dark' | 'light';
}

export interface PresetScenario {
  id: string;
  title: string;
  subtitle: string;
  riskTag: 'High Scope Creep' | 'Partial Creep' | 'In-Scope';
  projectName: string;
  contract: string;
  hourlyRate: number;
  currency: Currency;
  sensitivity: ClientSensitivity;
  channel: Channel;
  clientMessage: string;
}
