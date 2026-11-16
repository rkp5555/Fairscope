import React, { useState } from 'react';
import { Printer, Copy, Check, Save, Webhook, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { AuditResult, Currency } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { sendAuditWebhook } from '../../services/webhook';

interface AddendumAndSyncTabProps {
  audit: AuditResult;
  currency: Currency;
  webhookUrl?: string;
  onSaveToLog: (audit: AuditResult) => void;
  onShowToast: (type: 'success' | 'error' | 'info', title: string, desc?: string) => void;
}

export const AddendumAndSyncTab: React.FC<AddendumAndSyncTabProps> = ({
  audit,
  currency,
  webhookUrl,
  onSaveToLog,
  onShowToast,
}) => {
  const [copied, setCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(
    audit.syncedToWebhook ? 'Synced to Google Sheets ✓' : null
  );

  const addendum = audit.addendum;

  const handlePrint = () => {
    window.print();
  };

  const getPlainText = () => {
    return `=====================================================
FORMAL CHANGE-ORDER SCOPE ADDENDUM
[FairScope] Enterprise Protection
=====================================================

Project Reference: ${addendum.projectReference}
Client Organization: ${addendum.clientName}
Date of Issue: ${addendum.date}
Revised Delivery Target: ${addendum.revisedDeliveryDate}

ADDITIONAL SCOPE DELIVERABLES:
${addendum.addedDeliverables.map((d, i) => `${i + 1}. ${d}`).join('\n')}

COMMERCIAL ADJUSTMENT:
Additional Investment Required: ${formatCurrency(addendum.additionalCost, currency)}

TERMS & CONDITIONS:
${addendum.termsNote}

Sign-Off Authorization:
Client Signature: __________________________   Date: ____________
Freelance Provider: _______________________   Date: ____________
=====================================================`;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getPlainText());
      setCopied(true);
      onShowToast('success', 'Addendum Copied ✓', 'Plain text legal addendum ready for DocuSign or Google Docs.');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      onShowToast('error', 'Copy Failed', 'Unable to copy text.');
    }
  };

  const handleSaveAndSync = async () => {
    setIsSaving(true);
    let synced = false;

    if (webhookUrl && webhookUrl.trim()) {
      try {
        const webhookRes = await sendAuditWebhook(webhookUrl, audit);
        if (webhookRes.success) {
          synced = true;
          setSyncStatus('Synced to Google Sheets ✓');
          onShowToast('success', 'Automated Cloud Sync ✓', 'Dispatched payload to your Make.com Google Sheets scenario.');
        } else {
          setSyncStatus('Saved Locally (Webhook issue)');
          onShowToast('info', 'Saved Locally', webhookRes.message);
        }
      } catch {
        setSyncStatus('Saved Locally');
        onShowToast('info', 'Saved Locally', 'Webhook dispatch encountered network issue.');
      }
    } else {
      setSyncStatus('Saved Locally');
      onShowToast('success', 'Saved to Revenue Log', 'Record logged in Protected Revenue Log tab.');
    }

    const updatedAudit: AuditResult = {
      ...audit,
      syncedToWebhook: synced,
    };

    onSaveToLog(updatedAudit);
    setIsSaving(false);

    if (audit.quotedAmount > 0) {
      try {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#8B5CF6', '#6366F1', '#22C55E', '#F59E0B', '#FB7185', '#FAFAFA'],
        });
      } catch {
        // silent
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Formal Addendum Document Sheet */}
      <div className="p-6 rounded-xl bg-[#09090B] border border-[#27272A] shadow-inner font-mono text-xs space-y-4">
        {/* Document Header */}
        <div className="border-b border-[#27272A] pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs uppercase font-bold text-[#8B5CF6]">
              Exhibit B • Change-Order Addendum
            </span>
            <h4 className="text-base font-bold text-[#FAFAFA] mt-1">
              {addendum.projectReference}
            </h4>
            <p className="text-xs text-[#A1A1AA] mt-0.5">
              Client: <strong className="text-[#FAFAFA]">{addendum.clientName}</strong>
            </p>
          </div>
          <div className="text-left sm:text-right text-xs text-[#A1A1AA]">
            <div>Date: <strong className="text-[#FAFAFA]">{addendum.date}</strong></div>
            <div className="mt-0.5">Target: <strong className="text-[#8B5CF6]">{addendum.revisedDeliveryDate}</strong></div>
          </div>
        </div>

        {/* Added Deliverables */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-[#8B5CF6] uppercase tracking-wider block">
            Authorized Scope Additions
          </span>
          <ul className="space-y-2 pl-2">
            {addendum.addedDeliverables.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[#FAFAFA]">
                <span className="text-[#8B5CF6] font-bold">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Financial Consideration Banner */}
        <div className="p-4 rounded-xl bg-[#141418] border border-[#8B5CF6]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs text-[#C4B5FD] font-semibold uppercase">
              Adjusted Commercial Consideration
            </span>
            <div className="text-2xl font-black text-[#22C55E] mt-0.5">
              {formatCurrency(addendum.additionalCost, currency)}
            </div>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-xs text-[#C4B5FD] font-semibold uppercase">
              Revised Delivery Date
            </span>
            <div className="text-sm font-bold text-[#FAFAFA] mt-0.5">
              {addendum.revisedDeliveryDate}
            </div>
          </div>
        </div>

        {/* Terms Note */}
        <div className="text-xs text-[#A1A1AA] leading-relaxed border-t border-[#27272A] pt-3">
          <strong className="text-[#8B5CF6]">Governing Agreement: </strong>
          {addendum.termsNote}
        </div>

        {/* Actions for Document */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#141418] hover:bg-[#1C1C22] text-[#A1A1AA] hover:text-[#FAFAFA] border border-[#27272A] transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-[#22C55E]" /> : <Copy className="w-4 h-4 text-[#8B5CF6]" />}
            <span>{copied ? 'Copied' : 'Copy Plain Text'}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#141418] hover:bg-[#1C1C22] text-[#A1A1AA] hover:text-[#FAFAFA] border border-[#27272A] transition-colors"
          >
            <Printer className="w-4 h-4 text-[#8B5CF6]" />
            <span>Download PDF / Print</span>
          </button>
        </div>
      </div>

      {/* Sync to Revenue Log & Automation Action Bar */}
      <div className="p-5 rounded-2xl bg-[#09090B] border border-[#27272A] shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {syncStatus ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-xs bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/40">
              <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
              {syncStatus}
            </span>
          ) : webhookUrl ? (
            <span className="inline-flex items-center gap-1.5 text-[#A1A1AA] text-xs font-mono">
              <Webhook className="w-4 h-4 text-[#8B5CF6] animate-pulse" />
              Make.com Webhook Sync Armed
            </span>
          ) : (
            <span className="text-[#A1A1AA] text-xs">
              Log this record into Protected Revenue Analytics
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleSaveAndSync}
          disabled={isSaving}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] hover:from-[#7C3AED] hover:to-[#4F46E5] shadow-lg shadow-[#8B5CF6]/30 border border-[#8B5CF6]/50 disabled:opacity-50 transition-all transform active:scale-95"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Syncing...' : 'Save & Sync to Revenue Log'}</span>
        </button>
      </div>
    </div>
  );
};
