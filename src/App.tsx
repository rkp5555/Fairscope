import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SettingsModal } from './components/SettingsModal';
import { ToastContainer, ToastMessage } from './components/Toast';
import { WorkspaceAnalyzer } from './components/WorkspaceAnalyzer/WorkspaceAnalyzer';
import { RevenueSummaryCards } from './components/RevenueLog/RevenueSummaryCards';
import { RevenueRatioBar } from './components/RevenueLog/RevenueRatioBar';
import { AuditHistoryTable } from './components/RevenueLog/AuditHistoryTable';
import { AppSettings, AuditResult } from './types';
import { getSettings, saveSettings, getAudits, saveAudit, deleteAudit, clearAllAudits } from './services/storage';
import { ShieldCheck, Lock } from 'lucide-react';

export const App: React.FC = () => {
  // Navigation View State
  const [activeView, setActiveView] = useState<'analyzer' | 'revenue-log'>('analyzer');

  // App Settings
  const [settings, setSettings] = useState<AppSettings>(getSettings());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Audits History & Active Audit
  const [audits, setAudits] = useState<AuditResult[]>([]);
  const [currentAudit, setCurrentAudit] = useState<AuditResult | null>(null);

  // Floating Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Initialize audits from storage
  useEffect(() => {
    const loaded = getAudits();
    setAudits(loaded);
    // If we have past audits, load the most recent one into currentAudit or null
    if (loaded.length > 0 && !currentAudit) {
      setCurrentAudit(loaded[0]);
    }
  }, []);

  // Sync theme class to <html>
  useEffect(() => {
    if (settings.theme === 'light') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    }
  }, [settings.theme]);

  // Toast Helper
  const showToast = (type: 'success' | 'error' | 'info', title: string, description?: string) => {
    const id = 'toast_' + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, title, description }]);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Update Settings
  const handleUpdateSettings = (newSettings: Partial<AppSettings>) => {
    const updated = saveSettings(newSettings);
    setSettings(updated);
  };

  // Save audit to log
  const handleSaveToLog = (audit: AuditResult) => {
    const updated = saveAudit(audit);
    setAudits(updated);
    setCurrentAudit(audit);
  };

  // Delete single audit
  const handleDeleteAudit = (id: string) => {
    const updated = deleteAudit(id);
    setAudits(updated);
    if (currentAudit?.id === id) {
      setCurrentAudit(updated.length > 0 ? updated[0] : null);
    }
    showToast('info', 'Audit Removed', 'Record deleted from your local revenue log.');
  };

  // Clear all audits
  const handleClearAll = () => {
    const updated = clearAllAudits();
    setAudits(updated);
    setCurrentAudit(null);
  };

  // Select audit from history table into analyzer
  const handleSelectAuditFromHistory = (audit: AuditResult) => {
    setCurrentAudit(audit);
    setActiveView('analyzer');
    showToast('info', 'Loaded Audit', `Navigated to "${audit.projectName}" in Workspace Analyzer.`);
  };

  return (
    <div className="min-h-screen bg-[#09090B] text-[#FAFAFA] transition-colors flex flex-col font-sans">
      {/* 64px Top Sticky Header */}
      <Header
        activeView={activeView}
        setActiveView={setActiveView}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onOpenSettings={() => setIsSettingsOpen(true)}
        auditCount={audits.length}
      />

      {/* Main Container - 1440px max width with px-8 py-6 */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-8 py-6">
        {activeView === 'analyzer' ? (
          <WorkspaceAnalyzer
            settings={settings}
            currentAudit={currentAudit}
            setCurrentAudit={setCurrentAudit}
            onSaveToLog={handleSaveToLog}
            onShowToast={showToast}
          />
        ) : (
          <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
            {/* Top Summary Metrics */}
            <RevenueSummaryCards audits={audits} currency={settings.currency} />

            {/* Visual Ratio Bar */}
            <RevenueRatioBar audits={audits} currency={settings.currency} />

            {/* Audit History & Search Table */}
            <AuditHistoryTable
              audits={audits}
              currency={settings.currency}
              onSelectAudit={handleSelectAuditFromHistory}
              onDeleteAudit={handleDeleteAudit}
              onClearAll={handleClearAll}
              onShowToast={showToast}
            />
          </div>
        )}
      </main>

      {/* Footer / Privacy & Integrity Bar */}
      <footer className="w-full border-t border-[#27272A] py-4 px-8 text-xs text-[#A1A1AA] bg-[#09090B]/95 flex flex-col sm:flex-row items-center justify-between gap-2 select-none no-print">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#8B5CF6]" />
          <span className="font-semibold text-[#FAFAFA] font-mono">[FairScope]</span>
          <span className="text-[#A1A1AA]">• Defending freelance boundaries & protected billings</span>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <span className="flex items-center gap-1.5 text-[#A1A1AA]">
            <Lock className="w-3.5 h-3.5 text-[#22C55E]" />
            100% Client-Side Privacy (Local Vault)
          </span>
          <span className="hidden md:inline text-[#A1A1AA]/40">•</span>
          <span className="text-[#A1A1AA]">Engineered for Freelancers, Agencies & Consultants</span>
        </div>
      </footer>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSave={handleUpdateSettings}
        onShowToast={showToast}
      />

      {/* Floating Toast System */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
};
