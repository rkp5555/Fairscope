import React, { useState } from 'react';
import { Save, FileCheck, Webhook, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { AuditResult } from '../../types';
import { sendAuditWebhook } from '../../services/webhook';

interface ActionBarProps {
  audit: AuditResult;
  webhookUrl?: string;
  onSaveToLog: (audit: AuditResult) => void;
  onOpenAddendum: () => void;
  onRerun?: () => void;
  onShowToast: (type: 'success' | 'error' | 'info', title: string, desc?: string) => void;
}

export const ActionBar: React.FC<ActionBarProps> = ({
  audit,
  webhookUrl,
  onSaveToLog,
  onOpenAddendum,
  onShowToast,
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(
    audit.syncedToWebhook ? 'Synced to Google Sheets ✓' : null
  );

  const handleSaveAndSync = async () => {
    setIsSaving(true);
    let synced = false;

    // 1. Dispatch Webhook if configured
    if (webhookUrl && webhookUrl.trim()) {
      try {
        const webhookRes = await sendAuditWebhook(webhookUrl, audit);
        if (webhookRes.success) {
          synced = true;
          setSyncStatus('Synced to Google Sheets ✓');
          onShowToast('success', 'Automated Cloud Sync ✓', 'Payload dispatched to your Make.com Google Sheets scenario.');
        } else {
          setSyncStatus('Saved Locally (Webhook issue)');
          onShowToast('info', 'Saved to Local Log', webhookRes.message);
        }
      } catch (err: any) {
        setSyncStatus('Saved Locally');
        onShowToast('info', 'Saved Locally', 'Webhook dispatch encountered network issue.');
      }
    } else {
      setSyncStatus('Saved Locally');
      onShowToast('success', 'Saved to Revenue Log', 'View updated in Protected Revenue Log tab.');
    }

    const updatedAudit: AuditResult = {
      ...audit,
      syncedToWebhook: synced,
    };

    onSaveToLog(updatedAudit);
    setIsSaving(false);

    // Confetti celebration if positive revenue was protected!
    if (audit.quotedAmount > 0) {
      try {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#8B5CF6', '#6366F1', '#22C55E', '#F59E0B', '#FB7185', '#FAFAFA'],
        });
      } catch {
        // silent fallback
      }
    }
  };

  return (
    <div className="p-4 rounded-2xl bg-[#141418] border border-[#27272A] shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3">
      {/* Left: Status or Sync Indicator */}
      <div className="flex items-center gap-2 text-xs">
        {syncStatus ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-[11px] bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/40">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" />
            {syncStatus}
          </span>
        ) : webhookUrl ? (
          <span className="inline-flex items-center gap-1.5 text-[#A1A1AA] text-[11px] font-mono">
            <Webhook className="w-3.5 h-3.5 text-[#8B5CF6] animate-pulse" />
            Auto-Sync to Google Sheets Ready
          </span>
        ) : (
          <span className="text-[#A1A1AA] text-[11px]">
            Ready to log in Revenue Analytics
          </span>
        )}
      </div>

      {/* Right: Action Buttons */}
      <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
        {/* Open Formal Addendum Modal */}
        <button
          type="button"
          onClick={onOpenAddendum}
          className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#09090B] hover:bg-[#1C1C22] text-[#FAFAFA] border border-[#27272A] transition-colors"
          title="Open printable Mini Scope Addendum"
        >
          <FileCheck className="w-3.5 h-3.5 text-[#8B5CF6]" />
          <span>Scope Addendum</span>
        </button>

        {/* Primary Save & Sync Button */}
        <button
          type="button"
          onClick={handleSaveAndSync}
          disabled={isSaving}
          className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] hover:from-[#7C3AED] hover:to-[#4F46E5] shadow-lg shadow-[#8B5CF6]/30 border border-[#8B5CF6]/50 disabled:opacity-50 transition-all transform active:scale-95"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Syncing...' : 'Save & Sync to Revenue Log'}</span>
        </button>
      </div>
    </div>
  );
};
