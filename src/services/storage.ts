import { AppSettings, AuditResult, Currency } from '../types';

const SETTINGS_KEY = 'fairscope_settings_v2';
const LEGACY_SETTINGS_KEY = 'scopeguard_settings_v2';
const AUDITS_KEY = 'fairscope_audits_v2';
const LEGACY_AUDITS_KEY = 'scopeguard_audits_v2';

export const DEFAULT_SETTINGS: AppSettings = {
  apiKey: '',
  selectedModel: 'gemini-4-hydrogen',
  currency: 'INR',
  hourlyRate: 1500,
  webhookUrl: '',
  demoMode: true,
  theme: 'dark',
};

const SEED_AUDITS: AuditResult[] = [
  {
    id: 'seed-audit-ecommerce',
    timestamp: new Date().toISOString(),
    projectName: 'Aura Luxe Retail Storefront',
    clientChannel: 'whatsapp',
    verdict: 'OUT_OF_SCOPE',
    riskScore: 88,
    summary: 'Client requested an uncontracted payment gateway (Razorpay UPI Checkout) and a dedicated Wholesale B2B Inquiry Page, both explicitly excluded under Clause 4.2.',
    extraHours: 11.0,
    unbilledRevenue: 16500,
    quotedAmount: 16500,
    hourlyRate: 1500,
    currency: 'INR',
    syncedToWebhook: false,
    items: [
      {
        id: 'seed-item-1',
        ask: 'Razorpay UPI Checkout integration & webhook handling',
        status: 'excluded_new',
        citation: 'Clause 4.2 Explicit Exclusions: Domestic alternative payment gateways (Razorpay, Cashfree, UPI QR) strictly excluded. Standard agreement includes Stripe only.',
        effortHours: 6.5,
        estimatedCost: 9750,
      },
      {
        id: 'seed-item-2',
        ask: 'Wholesale B2B Inquiry Page with bulk CSV file uploads & tiered pricing',
        status: 'excluded_new',
        citation: 'Clause 2.1 Scope: Strictly bounded to 5 core storefront templates (Home, Catalog, Product, Cart, Standard Checkout). Extra custom pages require Change Order.',
        effortHours: 4.5,
        estimatedCost: 6750,
      }
    ],
    responses: {
      warmCollaborative: `Hey team! The Razorpay UPI checkout and dedicated B2B wholesale inquiry page sound like fantastic additions for your angel investor demo. Since our signed contract (Clause 4.2) is scoped strictly to Stripe and 5 core retail pages, I've prepared a quick change order for 11.0 hours (₹16,500) so we can build both features properly without delay. Let me know if you'd like to proceed!`,
      firmBoundary: `Hi, per our signed Statement of Work (Clause 4.2), domestic payment gateways (Razorpay UPI) and dedicated wholesale B2B pages are explicitly excluded from the current 5-page MVP. Delivering these features requires a formal Change Order of ₹16,500 (11.0 hours) and an agreed delivery adjustment prior to development.`,
      paidUpsell: `Hi team! We can certainly build the Razorpay UPI checkout and the Wholesale B2B inquiry page. The additional scope entails 11.0 engineering hours at ₹16,500 total. I have prepared Exhibit B Change Order #CO-01 ready for sign-off.`
    },
    addendum: {
      projectReference: 'Aura Luxe Retail Storefront (Change Order #01)',
      clientName: 'Apex Global Retail Ltd.',
      date: new Date().toISOString().split('T')[0],
      addedDeliverables: [
        'Razorpay UPI Checkout integration & webhook handling',
        'Wholesale B2B Inquiry Page with bulk CSV file uploads & tiered pricing'
      ],
      additionalCost: 16500,
      revisedDeliveryDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      termsNote: 'Standard development terms apply. 50% mobilization upon sign-off, balance on staging deployment.'
    }
  },
  {
    id: 'seed-audit-branding',
    timestamp: new Date(Date.now() - 3600000 * 48).toISOString(),
    projectName: 'Kinetics AI Brand System',
    clientChannel: 'email',
    verdict: 'PARTIAL_CREEP',
    riskScore: 64,
    summary: 'Client requested 6 photorealistic 3D bottle renders and a high-priority 9-hour turnaround, exceeding agreed flat mockup assets and violating the 48-hour rush delivery policy.',
    extraHours: 5.5,
    unbilledRevenue: 8250,
    quotedAmount: 8250,
    hourlyRate: 1500,
    currency: 'INR',
    syncedToWebhook: false,
    items: [
      {
        id: 'seed-item-3',
        ask: '6 photorealistic 3D matte glass bottle packaging renders with embossed foil stamps',
        status: 'excluded_new',
        citation: 'Section 3 Explicit Exclusions: 3D photorealistic packaging renders and CAD bottle simulations excluded. Scope includes 3 standard flat mockup assets only.',
        effortHours: 4.0,
        estimatedCost: 6000,
      },
      {
        id: 'seed-item-4',
        ask: 'Urgent same-day delivery by 9 PM tonight for upcoming tech expo',
        status: 'exceeds_limit',
        citation: 'Clause 2.2 Timeline: Rush turnaround under 48 hours requires a 35% priority scheduling surcharge.',
        effortHours: 1.5,
        estimatedCost: 2250,
      }
    ],
    responses: {
      warmCollaborative: `Hi there! We are completely thrilled that you love the Round 2 logo direction. For the 6 photorealistic 3D glass packaging renders and same-day 9 PM turnaround, this goes beyond our 3 standard flat mockups (Section 3). I can fast-track these renders under Change Order #02 for ₹8,250 so you're fully equipped for Thursday's expo!`,
      firmBoundary: `Hi, per our signed Visual Identity SOW, deliverables are bounded to 3 flat mockups; 3D packaging renders and sub-48-hour sprints carry a priority surcharge. Additional investment for these 2 requests is ₹8,250.`,
      paidUpsell: `Hi team, we can render the 6 photorealistic 3D matte glass bottles and rush the final assets by 9 PM. The investment is ₹8,250 for 5.5 hours. Ready to initiate upon sign-off.`
    },
    addendum: {
      projectReference: 'Kinetics AI Visual Identity (Addendum #02)',
      clientName: 'Kinetics Robotics Inc.',
      date: new Date(Date.now() - 3600000 * 48).toISOString().split('T')[0],
      addedDeliverables: [
        '6 photorealistic 3D matte glass bottle packaging renders',
        'Expedited same-day delivery by 9 PM'
      ],
      additionalCost: 8250,
      revisedDeliveryDate: new Date().toISOString().split('T')[0],
      termsNote: 'Rush delivery sprint authorization.'
    }
  },
  {
    id: 'seed-audit-retainer',
    timestamp: new Date(Date.now() - 3600000 * 96).toISOString(),
    projectName: 'Solace Wellness Digital Retainer',
    clientChannel: 'slack',
    verdict: 'IN_SCOPE',
    riskScore: 8,
    summary: 'Request involves swapping one slide image and updating a bullet point with a promo code, which are 100% permitted under the monthly retainer revision guidelines.',
    extraHours: 0,
    unbilledRevenue: 0,
    quotedAmount: 0,
    hourlyRate: 1500,
    currency: 'INR',
    syncedToWebhook: true,
    items: [
      {
        id: 'seed-item-5',
        ask: "Swap slide 3 stock image for founder's new portrait headshot",
        status: 'covered',
        citation: 'Clause 2.1 Included Support: Up to 2 minor text updates or replacement image swaps per asset permitted if requested at least 24 hours prior to publishing.',
        effortHours: 0,
        estimatedCost: 0,
      },
      {
        id: 'seed-item-6',
        ask: "Add early-bird promo code 'SOLACE20' to second bullet point in caption copy",
        status: 'covered',
        citation: 'Clause 2.1 Included Support: Caption copy tweaks and hashtag optimization included within active billing cycle.',
        effortHours: 0,
        estimatedCost: 0,
      }
    ],
    responses: {
      warmCollaborative: `Hey team! That's completely covered within your active Growth Retainer allowance. I'll update slide 3 with the founder's portrait and insert promo code 'SOLACE20' right away!`,
      firmBoundary: `Confirmed: These adjustments fall 100% within your monthly retainer scope. No extra charges apply.`,
      paidUpsell: `All requested tweaks are fully covered under your monthly retainer tier at ₹0 extra cost.`
    },
    addendum: {
      projectReference: 'Solace Wellness Growth Retainer #04',
      clientName: 'Solace Wellness Studio',
      date: new Date(Date.now() - 3600000 * 96).toISOString().split('T')[0],
      addedDeliverables: [
        'Slide 3 headshot replacement & promo code copy revision (Covered)'
      ],
      additionalCost: 0,
      revisedDeliveryDate: new Date().toISOString().split('T')[0],
      termsNote: 'Standard monthly retainer terms apply.'
    }
  }
];

export function getSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY) || localStorage.getItem(LEGACY_SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: Partial<AppSettings>): AppSettings {
  const current = getSettings();
  const updated: AppSettings = { ...current, ...settings };
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save settings to localStorage:', err);
  }
  return updated;
}

export function getAudits(): AuditResult[] {
  try {
    const raw = localStorage.getItem(AUDITS_KEY) || localStorage.getItem(LEGACY_AUDITS_KEY);
    if (!raw) {
      localStorage.setItem(AUDITS_KEY, JSON.stringify(SEED_AUDITS));
      return SEED_AUDITS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(AUDITS_KEY, JSON.stringify(SEED_AUDITS));
      return SEED_AUDITS;
    }
    // If the top audit is still the legacy FinTech audit, replace it with the E-commerce seed audit
    if (parsed[0]?.projectName?.includes('FinTech')) {
      const updated = [SEED_AUDITS[0], ...parsed.filter((a: AuditResult) => !a.projectName?.includes('FinTech'))];
      localStorage.setItem(AUDITS_KEY, JSON.stringify(updated));
      return updated;
    }
    return parsed;
  } catch {
    return SEED_AUDITS;
  }
}

export function saveAudit(audit: AuditResult): AuditResult[] {
  const current = getAudits();
  const existingIdx = current.findIndex(a => a.id === audit.id);
  let updated: AuditResult[];
  if (existingIdx >= 0) {
    updated = [...current];
    updated[existingIdx] = audit;
  } else {
    updated = [audit, ...current];
  }
  try {
    localStorage.setItem(AUDITS_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save audit to localStorage:', err);
  }
  return updated;
}

export function deleteAudit(id: string): AuditResult[] {
  const current = getAudits();
  const updated = current.filter(a => a.id !== id);
  try {
    localStorage.setItem(AUDITS_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to delete audit from localStorage:', err);
  }
  return updated;
}

export function clearAllAudits(): AuditResult[] {
  try {
    localStorage.removeItem(AUDITS_KEY);
    localStorage.removeItem(LEGACY_AUDITS_KEY);
  } catch (err) {
    console.error('Failed to clear audits:', err);
  }
  return [];
}

export function exportAuditsToCSV(audits: AuditResult[], currency: Currency = 'INR') {
  if (!audits.length) return;

  const headers = [
    'Audit ID',
    'Date',
    'Project Name',
    'Client Channel',
    'Verdict',
    'Risk Score (%)',
    'Extra Hours',
    'Hourly Rate',
    'Unbilled Revenue',
    'Quoted Amount',
    'Currency',
    'Synced to Webhook',
    'Executive Summary'
  ];

  const rows = audits.map((a) => [
    `"${a.id}"`,
    `"${new Date(a.timestamp).toISOString()}"`,
    `"${(a.projectName || '').replace(/"/g, '""')}"`,
    `"${a.clientChannel}"`,
    `"${a.verdict}"`,
    a.riskScore,
    a.extraHours.toFixed(1),
    a.hourlyRate,
    a.unbilledRevenue,
    a.quotedAmount,
    `"${a.currency || currency}"`,
    a.syncedToWebhook ? 'TRUE' : 'FALSE',
    `"${(a.summary || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `FairScope_Revenue_Log_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
