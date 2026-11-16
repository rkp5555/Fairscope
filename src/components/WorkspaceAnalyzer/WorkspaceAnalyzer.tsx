import React, { useState, useEffect } from 'react';
import { ScenarioQuickLoad } from './ScenarioQuickLoad';
import { ContractCard } from './ContractCard';
import { CommercialParams } from './CommercialParams';
import { ClientMessageCard } from './ClientMessageCard';
import { AuditCTA } from './AuditCTA';
import { AuditEmptyState } from './AuditEmptyState';
import { VerdictBanner } from './VerdictBanner';
import { FinancialImpactStrip } from './FinancialImpactStrip';
import { ItemizedBreakdown } from './ItemizedBreakdown';
import { ResponseStudio } from './ResponseStudio';
import { AddendumAndSyncTab } from './AddendumAndSyncTab';
import { AppSettings, AuditResult, Channel, ClientSensitivity, Currency, PresetScenario } from '../../types';
import { PRESET_SCENARIOS } from '../../data/presets';
import { runDeterministicDemoAudit } from '../../services/demoEngine';
import { runGeminiScopeAudit } from '../../services/gemini';
import { FileText, MessageSquare, FileCheck } from 'lucide-react';

interface WorkspaceAnalyzerProps {
  settings: AppSettings;
  currentAudit: AuditResult | null;
  setCurrentAudit: (audit: AuditResult | null) => void;
  onSaveToLog: (audit: AuditResult) => void;
  onShowToast: (type: 'success' | 'error' | 'info', title: string, desc?: string) => void;
}

export const WorkspaceAnalyzer: React.FC<WorkspaceAnalyzerProps> = ({
  settings,
  currentAudit,
  setCurrentAudit,
  onSaveToLog,
  onShowToast,
}) => {
  // Left Panel Inputs State
  const [selectedPresetId, setSelectedPresetId] = useState<string>('preset-ecommerce');
  const [contract, setContract] = useState<string>(PRESET_SCENARIOS[0].contract);
  const [clientMessage, setClientMessage] = useState<string>(PRESET_SCENARIOS[0].clientMessage);
  const [hourlyRate, setHourlyRate] = useState<number>(settings.hourlyRate || 1500);
  const [currency, setCurrency] = useState<Currency>(settings.currency || 'INR');
  const [sensitivity, setSensitivity] = useState<ClientSensitivity>('repeat_creeper');
  const [channel, setChannel] = useState<Channel>('whatsapp');
  const [projectName, setProjectName] = useState<string>(PRESET_SCENARIOS[0].projectName);

  // Right Panel Tabs State: 'breakdown' | 'replies' | 'addendum'
  const [activeResultTab, setActiveResultTab] = useState<'breakdown' | 'replies' | 'addendum'>('breakdown');

  // Audit Loading State
  const [isLoading, setIsLoading] = useState(false);

  // Sync settings when modified from header
  useEffect(() => {
    if (settings.hourlyRate && hourlyRate === 1500) {
      setHourlyRate(settings.hourlyRate);
    }
    if (settings.currency) {
      setCurrency(settings.currency);
    }
  }, [settings.hourlyRate, settings.currency]);

  // Ensure default state strictly matches E-Commerce Website preset on initial load
  useEffect(() => {
    if (!currentAudit || currentAudit.projectName?.includes('FinTech') || currentAudit.projectName?.includes('iOS & Android')) {
      const initial = PRESET_SCENARIOS[0];
      runDeterministicDemoAudit({
        contract: initial.contract,
        clientMessage: initial.clientMessage,
        hourlyRate: initial.hourlyRate,
        currency: initial.currency,
        sensitivity: initial.sensitivity,
        channel: initial.channel,
        projectName: initial.projectName,
      }).then((result) => {
        setCurrentAudit(result);
      });
    }
  }, []);

  // Handle Preset Select - strictly synchronizes Left Panel inputs and Right Panel results
  const handleSelectPreset = async (preset: PresetScenario) => {
    setSelectedPresetId(preset.id);
    setContract(preset.contract);
    setClientMessage(preset.clientMessage);
    setHourlyRate(preset.hourlyRate);
    setCurrency(preset.currency);
    setSensitivity(preset.sensitivity);
    setChannel(preset.channel);
    setProjectName(preset.projectName);

    setIsLoading(true);
    try {
      const result = await runDeterministicDemoAudit({
        contract: preset.contract,
        clientMessage: preset.clientMessage,
        hourlyRate: preset.hourlyRate,
        currency: preset.currency,
        sensitivity: preset.sensitivity,
        channel: preset.channel,
        projectName: preset.projectName,
      });
      setCurrentAudit(result);
      setActiveResultTab('breakdown');
      onShowToast('info', 'Preset Loaded & Synchronized ✓', `Loaded "${preset.title}". Audit results updated.`);
    } catch {
      onShowToast('info', 'Preset Loaded', `Populated "${preset.title}".`);
    } finally {
      setIsLoading(false);
    }
  };

  // Run Scope Audit Execution
  const handleRunAudit = async () => {
    if (!contract.trim()) {
      onShowToast('error', 'Missing Contract', 'Please enter or upload a contract/SOW first.');
      return;
    }
    if (!clientMessage.trim()) {
      onShowToast('error', 'Missing Message', "Please paste the client's incoming message.");
      return;
    }

    setIsLoading(true);
    try {
      let result: AuditResult;

      if (settings.demoMode || !settings.apiKey?.trim()) {
        result = await runDeterministicDemoAudit({
          contract,
          clientMessage,
          hourlyRate,
          currency,
          sensitivity,
          channel,
          projectName,
        });
      } else {
        result = await runGeminiScopeAudit({
          apiKey: settings.apiKey,
          model: settings.selectedModel,
          contract,
          clientMessage,
          hourlyRate,
          currency,
          sensitivity,
          channel,
          projectName,
        });
      }

      setCurrentAudit(result);
      setActiveResultTab('breakdown');
      onShowToast(
        result.verdict === 'IN_SCOPE' ? 'success' : 'info',
        result.verdict === 'IN_SCOPE' ? 'In-Scope Confirmed ✓' : 'Scope Audit Complete',
        `Risk: ${result.riskScore}% • ${result.extraHours.toFixed(1)} unbilled hours calculated.`
      );
    } catch (err: any) {
      console.error('Audit failed:', err);
      onShowToast('error', 'Audit Failed', err?.message || 'Unexpected analysis error.');
    } finally {
      setIsLoading(false);
    }
  };

  // Keyboard shortcut: Ctrl + Enter
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (!isLoading) {
          handleRunAudit();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [contract, clientMessage, hourlyRate, currency, sensitivity, channel, isLoading, settings]);

  // Load sample trap & run 1-click
  const handleLoadSampleAndRun = async () => {
    const sample = PRESET_SCENARIOS[0];
    handleSelectPreset(sample);
    setIsLoading(true);
    try {
      const result = await runDeterministicDemoAudit({
        contract: sample.contract,
        clientMessage: sample.clientMessage,
        hourlyRate: sample.hourlyRate,
        currency: sample.currency,
        sensitivity: sample.sensitivity,
        channel: sample.channel,
        projectName: sample.projectName,
      });
      setCurrentAudit(result);
      setActiveResultTab('breakdown');
      onShowToast('success', 'Live Sample Audit Run ✓', 'Razorpay & B2B portal trap intercepted!');
    } catch {
      onShowToast('error', 'Execution Error', 'Unable to complete sample audit.');
    } finally {
      setIsLoading(false);
    }
  };

  // Update change-order quote inline
  const handleUpdateQuote = (newQuote: number) => {
    if (!currentAudit) return;
    const updated: AuditResult = {
      ...currentAudit,
      quotedAmount: newQuote,
      addendum: {
        ...currentAudit.addendum,
        additionalCost: newQuote,
      },
    };
    setCurrentAudit(updated);
    onShowToast('info', 'Quote Updated', `Adjusted quotation to ${newQuote}.`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* LEFT PANEL: 3 Simple Decluttered Steps */}
      <div className="lg:col-span-5 space-y-6">
        {/* Horizontal Scenario Bar */}
        <ScenarioQuickLoad
          onSelectPreset={handleSelectPreset}
          selectedPresetId={selectedPresetId}
        />

        {/* Step 1: Signed Contract */}
        <ContractCard
          contract={contract}
          setContract={setContract}
          onShowToast={onShowToast}
        />

        {/* Step 2: Client's Message */}
        <ClientMessageCard
          message={clientMessage}
          setMessage={setClientMessage}
          channel={channel}
          setChannel={setChannel}
        />

        {/* Step 3: Combined Rate & Tone Row */}
        <CommercialParams
          hourlyRate={hourlyRate}
          setHourlyRate={setHourlyRate}
          currency={currency}
          sensitivity={sensitivity}
          setSensitivity={setSensitivity}
        />

        {/* Primary CTA Button */}
        <AuditCTA
          onRunAudit={handleRunAudit}
          isLoading={isLoading}
          disabled={!contract.trim() || !clientMessage.trim()}
        />
      </div>

      {/* RIGHT PANEL: Results Dashboard with Progressive Disclosure Tabs */}
      <div className="lg:col-span-7 rounded-2xl bg-[#141418] border border-[#27272A] p-6 shadow-xl min-h-[640px]">
        {currentAudit ? (
          <div className="space-y-6 animate-fade-in">
            {/* 1. Executive Verdict Card */}
            <VerdictBanner
              verdict={currentAudit.verdict}
              riskScore={currentAudit.riskScore}
              summary={currentAudit.summary}
              projectName={currentAudit.projectName}
            />

            {/* 2. 3 Clean KPI Metric Cards */}
            <FinancialImpactStrip
              extraHours={currentAudit.extraHours}
              unbilledRevenue={currentAudit.unbilledRevenue}
              quotedAmount={currentAudit.quotedAmount}
              currency={currentAudit.currency || currency}
              onUpdateQuote={handleUpdateQuote}
            />

            {/* 3 Detailed Results Organized into 3 Clean Tabs */}
            <div className="space-y-4 pt-2">
              {/* Tab Navigation Switcher */}
              <div className="flex items-center p-1 rounded-xl bg-[#09090B] border border-[#27272A]">
                <button
                  type="button"
                  onClick={() => setActiveResultTab('breakdown')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-semibold transition-all ${
                    activeResultTab === 'breakdown'
                      ? 'bg-[#141418] text-[#FAFAFA] shadow-sm border border-[#8B5CF6]/50'
                      : 'text-[#A1A1AA] hover:text-[#FAFAFA]'
                  }`}
                >
                  <FileText className="w-4 h-4 text-[#8B5CF6]" />
                  <span>Clause Breakdown ({currentAudit.items.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveResultTab('replies')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-semibold transition-all ${
                    activeResultTab === 'replies'
                      ? 'bg-[#141418] text-[#FAFAFA] shadow-sm border border-[#8B5CF6]/50'
                      : 'text-[#A1A1AA] hover:text-[#FAFAFA]'
                  }`}
                >
                  <MessageSquare className="w-4 h-4 text-[#F59E0B]" />
                  <span>Diplomatic Replies</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveResultTab('addendum')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-semibold transition-all ${
                    activeResultTab === 'addendum'
                      ? 'bg-[#141418] text-[#FAFAFA] shadow-sm border border-[#8B5CF6]/50'
                      : 'text-[#A1A1AA] hover:text-[#FAFAFA]'
                  }`}
                >
                  <FileCheck className="w-4 h-4 text-[#22C55E]" />
                  <span>Addendum & Sync</span>
                </button>
              </div>

              {/* Tab Content Display */}
              <div className="pt-1">
                {activeResultTab === 'breakdown' && (
                  <ItemizedBreakdown
                    items={currentAudit.items}
                    currency={currentAudit.currency || currency}
                  />
                )}

                {activeResultTab === 'replies' && (
                  <ResponseStudio
                    responses={currentAudit.responses}
                    onShowToast={onShowToast}
                  />
                )}

                {activeResultTab === 'addendum' && (
                  <AddendumAndSyncTab
                    audit={currentAudit}
                    currency={currentAudit.currency || currency}
                    webhookUrl={settings.webhookUrl}
                    onSaveToLog={onSaveToLog}
                    onShowToast={onShowToast}
                  />
                )}
              </div>
            </div>
          </div>
        ) : (
          <AuditEmptyState onLoadSampleAndRun={handleLoadSampleAndRun} />
        )}
      </div>
    </div>
  );
};
