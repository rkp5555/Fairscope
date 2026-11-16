import React, { useState } from 'react';
import { X, Key, DollarSign, Clock, Webhook, ExternalLink, Sparkles, ShieldCheck } from 'lucide-react';
import { AppSettings, Currency, CURRENCIES } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSave: (newSettings: Partial<AppSettings>) => void;
  onShowToast: (type: 'success' | 'error' | 'info', title: string, desc?: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSave,
  onShowToast,
}) => {
  const [apiKey, setApiKey] = useState(settings.apiKey);
  const [selectedModel, setSelectedModel] = useState(settings.selectedModel || 'gemini-4-hydrogen');
  const [currency, setCurrency] = useState<Currency>(settings.currency || 'INR');
  const [hourlyRate, setHourlyRate] = useState<number>(settings.hourlyRate || 1500);
  const [webhookUrl, setWebhookUrl] = useState(settings.webhookUrl || '');
  const [demoMode, setDemoMode] = useState(settings.demoMode);
  const [testingWebhook, setTestingWebhook] = useState(false);
  const [showKey, setShowKey] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    let updatedDemo = demoMode;
    if (apiKey.trim() && apiKey.trim() !== settings.apiKey && demoMode) {
      updatedDemo = false;
      onShowToast('info', 'Live Gemini API Enabled', 'Demo Mode automatically switched to live mode.');
    }

    onSave({
      apiKey: apiKey.trim(),
      selectedModel,
      currency,
      hourlyRate: Number(hourlyRate) > 0 ? Number(hourlyRate) : 1500,
      webhookUrl: webhookUrl.trim(),
      demoMode: updatedDemo,
    });

    onShowToast('success', 'Settings Saved', 'Your workspace preferences have been updated.');
    onClose();
  };

  const handleTestWebhook = async () => {
    if (!webhookUrl.trim()) {
      onShowToast('error', 'Missing URL', 'Please enter a valid Make.com or Zapier webhook endpoint first.');
      return;
    }

    setTestingWebhook(true);
    try {
      const res = await fetch(webhookUrl.trim(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          test: true,
          event: 'FAIRSCOPE_PING_TEST',
          timestamp: new Date().toISOString(),
          app: '[FairScope] Enterprise',
          message: 'Webhook ping successful! Google Sheets integration channel is operational.',
        }),
      });

      if (res.ok) {
        onShowToast('success', 'Webhook Test Passed ✓', `Endpoint responded with HTTP ${res.status}. Ready for auto-sync.`);
      } else {
        onShowToast('error', 'Webhook Response Error', `Endpoint responded with HTTP ${res.status}. Verify webhook route.`);
      }
    } catch (err: any) {
      onShowToast('error', 'Webhook Dispatch Failed', err?.message || 'Check endpoint CORS or URL validity.');
    } finally {
      setTestingWebhook(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-xl rounded-2xl bg-[#141418] border border-[#27272A] shadow-2xl overflow-hidden transition-all text-[#FAFAFA]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#27272A] flex items-center justify-between bg-[#09090B]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#8B5CF6]/15 border border-[#8B5CF6]/35 text-[#8B5CF6]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#FAFAFA]">Workspace Settings & Integrations</h2>
              <p className="text-xs text-[#A1A1AA]">Configure AI model engine, billing rates, and automation webhooks</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-[#141418] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Gemini API Key */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[#FAFAFA] flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-[#8B5CF6]" />
                Google Gemini API Key
              </label>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-medium text-[#8B5CF6] hover:text-[#C4B5FD] flex items-center gap-1 transition-colors"
              >
                <span>Get Free Key</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#09090B] border border-[#27272A] text-xs font-mono text-[#FAFAFA] focus:outline-none focus:ring-1 focus:ring-[#8B5CF6] focus:border-[#8B5CF6] transition-all placeholder:text-[#A1A1AA]/40"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-[#A1A1AA] hover:text-[#FAFAFA] font-mono"
              >
                {showKey ? 'Hide' : 'Show'}
              </button>
            </div>
            <p className="text-[11px] text-[#A1A1AA]/80">
              Keys are stored securely in local browser storage and never transmitted to external intermediary servers.
            </p>
          </div>

          {/* AI Model Selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#FAFAFA] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#8B5CF6]" />
              Primary AI Audit Engine
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  selectedModel === 'gemini-4-hydrogen'
                    ? 'bg-[#8B5CF6]/15 border-[#8B5CF6]/60 text-white'
                    : 'bg-[#09090B] border-[#27272A] text-[#A1A1AA] hover:border-[#8B5CF6]/40'
                }`}
              >
                <input
                  type="radio"
                  name="model"
                  value="gemini-4-hydrogen"
                  checked={selectedModel === 'gemini-4-hydrogen'}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="mt-1 accent-[#8B5CF6]"
                />
                <div>
                  <div className="text-xs font-semibold text-[#FAFAFA]">
                    gemini-4-hydrogen
                  </div>
                  <div className="text-[10px] text-[#A1A1AA] mt-0.5">
                    Flagship reasoning with contract clause precision (Default)
                  </div>
                </div>
              </label>

              <label
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  selectedModel === 'gemini-3.8-flash'
                    ? 'bg-[#8B5CF6]/15 border-[#8B5CF6]/60 text-white'
                    : 'bg-[#09090B] border-[#27272A] text-[#A1A1AA] hover:border-[#8B5CF6]/40'
                }`}
              >
                <input
                  type="radio"
                  name="model"
                  value="gemini-3.8-flash"
                  checked={selectedModel === 'gemini-3.8-flash'}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="mt-1 accent-[#8B5CF6]"
                />
                <div>
                  <div className="text-xs font-semibold text-[#FAFAFA]">
                    gemini-3.8-flash
                  </div>
                  <div className="text-[10px] text-[#A1A1AA] mt-0.5">
                    Ultra-fast inference (Auto-fallback engine)
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Currency and Hourly Rate Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Currency Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#FAFAFA] flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-[#8B5CF6]" />
                Default Currency
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['INR', 'USD', 'EUR'] as Currency[]).map((cur) => (
                  <button
                    key={cur}
                    type="button"
                    onClick={() => setCurrency(cur)}
                    className={`py-2 px-3 rounded-xl text-xs font-mono font-semibold border transition-all ${
                      currency === cur
                        ? 'bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] border-[#8B5CF6] text-white font-bold shadow-sm'
                        : 'bg-[#09090B] border-[#27272A] text-[#A1A1AA] hover:text-[#FAFAFA]'
                    }`}
                  >
                    {CURRENCIES[cur].symbol} {cur}
                  </button>
                ))}
              </div>
            </div>

            {/* Default Hourly Rate */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#FAFAFA] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#8B5CF6]" />
                Default Hourly Rate
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-[#8B5CF6] font-bold">
                  {CURRENCIES[currency].symbol}
                </span>
                <input
                  type="number"
                  min="100"
                  step="50"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(Number(e.target.value))}
                  className="w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-[#09090B] border border-[#27272A] text-xs font-mono text-[#FAFAFA] focus:outline-none focus:ring-1 focus:ring-[#8B5CF6] transition-all"
                />
              </div>
            </div>
          </div>

          {/* Make.com / Zapier Webhook URL */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[#FAFAFA] flex items-center gap-1.5">
                <Webhook className="w-3.5 h-3.5 text-[#8B5CF6]" />
                Make.com / Google Sheets Webhook URL (Optional)
              </label>
              <button
                type="button"
                onClick={handleTestWebhook}
                disabled={testingWebhook || !webhookUrl.trim()}
                className="text-[11px] font-medium text-[#8B5CF6] hover:text-[#C4B5FD] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {testingWebhook ? 'Sending Ping...' : 'Send Test Ping'}
              </button>
            </div>
            <input
              type="url"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://hook.eu1.make.com/your-custom-webhook-id"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#09090B] border border-[#27272A] text-xs font-mono text-[#FAFAFA] focus:outline-none focus:ring-1 focus:ring-[#8B5CF6] transition-all placeholder:text-[#A1A1AA]/40"
            />
            <p className="text-[11px] text-[#A1A1AA]/80">
              When configured, every "Save & Sync" automatically posts audit data straight to your Google Sheet or CRM.
            </p>
          </div>

          {/* Demo Mode Toggle Setting */}
          <div className="p-3.5 rounded-xl bg-[#09090B] border border-[#27272A] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-[#8B5CF6]/15 text-[#8B5CF6]">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-[#FAFAFA]">Deterministic Demo Engine</div>
                <div className="text-[11px] text-[#A1A1AA]">Run ultra-fast realistic audits even without an API key</div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={demoMode}
                onChange={(e) => setDemoMode(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-[#141418] border border-[#27272A] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-[#09090B] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#FAFAFA] after:border-[#27272A] after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#8B5CF6]"></div>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#27272A] bg-[#09090B] flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[#A1A1AA] hover:text-[#FAFAFA] transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] hover:from-[#7C3AED] hover:to-[#4F46E5] shadow-md shadow-[#8B5CF6]/30 border border-[#8B5CF6]/50 transition-all"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};
