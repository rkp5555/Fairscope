import React from 'react';
import { X, Printer, Copy, Check, FileCheck, Calendar } from 'lucide-react';
import { Currency, ScopeAddendum } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface AddendumModalProps {
  isOpen: boolean;
  onClose: () => void;
  addendum: ScopeAddendum;
  currency: Currency;
  onShowToast: (type: 'success' | 'error' | 'info', title: string, desc?: string) => void;
}

export const AddendumModal: React.FC<AddendumModalProps> = ({
  isOpen,
  onClose,
  addendum,
  currency,
  onShowToast,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in no-print">
      <div
        className="w-full max-w-2xl rounded-2xl bg-[#141418] border border-[#27272A] shadow-2xl overflow-hidden transition-all text-[#FAFAFA]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#27272A] flex items-center justify-between bg-[#09090B]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#8B5CF6]/15 border border-[#8B5CF6]/35 text-[#8B5CF6]">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#FAFAFA]">
                Formal Change-Order Scope Addendum
              </h2>
              <p className="text-xs text-[#A1A1AA]">
                Defensible contract add-on document with signature blocks
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-[#141418] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Printable Document Sheet Preview */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          <div className="print-area p-6 sm:p-8 rounded-xl bg-[#09090B] border border-[#27272A] shadow-inner font-mono text-xs space-y-5">
            {/* Document Header */}
            <div className="border-b border-[#27272A] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-[10px] tracking-widest uppercase font-bold text-[#8B5CF6]">
                  Exhibit B • Change-Order Addendum
                </span>
                <h3 className="text-base font-bold text-[#FAFAFA] mt-0.5">
                  {addendum.projectReference}
                </h3>
                <p className="text-[11px] text-[#A1A1AA]">
                  Client: <strong className="text-[#FAFAFA]">{addendum.clientName}</strong>
                </p>
              </div>
              <div className="text-left sm:text-right text-[11px] text-[#A1A1AA]">
                <div>Date: <strong className="text-[#FAFAFA]">{addendum.date}</strong></div>
                <div>Status: <span className="text-[#8B5CF6] font-bold">Pending Execution</span></div>
              </div>
            </div>

            {/* Added Deliverables */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-[#8B5CF6] uppercase tracking-wider block">
                1. Authorized Scope Additions & Technical Specifications
              </span>
              <ul className="space-y-2 pl-2">
                {addendum.addedDeliverables.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-[#FAFAFA]">
                    <span className="text-[#8B5CF6] font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Commercial Terms Box */}
            <div className="p-3.5 rounded-lg bg-[#141418] border border-[#8B5CF6]/35 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] text-[#C4B5FD] font-semibold uppercase">
                  Adjusted Commercial Consideration
                </span>
                <div className="text-lg font-black text-[#22C55E] mt-0.5">
                  {formatCurrency(addendum.additionalCost, currency)}
                </div>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-[10px] text-[#C4B5FD] font-semibold uppercase">
                  Revised Delivery Commitment
                </span>
                <div className="text-xs font-bold text-[#FAFAFA] mt-0.5 flex items-center gap-1 sm:justify-end">
                  <Calendar className="w-3.5 h-3.5 text-[#8B5CF6]" />
                  <span>{addendum.revisedDeliveryDate}</span>
                </div>
              </div>
            </div>

            {/* Terms text */}
            <div className="text-[11px] text-[#A1A1AA] leading-relaxed border-t border-[#27272A] pt-3">
              <strong className="text-[#8B5CF6]">Governing Agreement: </strong>
              {addendum.termsNote}
            </div>

            {/* Signature Blocks */}
            <div className="pt-4 border-t border-[#27272A] grid grid-cols-1 sm:grid-cols-2 gap-6 text-[10px] text-[#A1A1AA]">
              <div className="space-y-2">
                <p className="font-bold text-[#FAFAFA]">Client Authorized Signatory</p>
                <div className="h-10 border-b border-dashed border-[#27272A]" />
                <div className="flex justify-between">
                  <span>Sign & Date</span>
                  <span>Name & Title</span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="font-bold text-[#FAFAFA]">Freelance Provider Signatory</p>
                <div className="h-10 border-b border-dashed border-[#27272A]" />
                <div className="flex justify-between">
                  <span>Sign & Date</span>
                  <span className="text-[#8B5CF6] font-semibold">[FairScope] Verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-[#27272A] bg-[#09090B] flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[#A1A1AA] hover:text-[#FAFAFA] transition-colors"
          >
            Close
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#141418] hover:bg-[#1C1C22] text-[#FAFAFA] transition-colors border border-[#27272A]"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#22C55E]" /> : <Copy className="w-3.5 h-3.5 text-[#8B5CF6]" />}
              <span>{copied ? 'Copied' : 'Copy Plain Text'}</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] hover:from-[#7C3AED] hover:to-[#4F46E5] text-white shadow-md shadow-[#8B5CF6]/30 border border-[#8B5CF6]/50 transition-all hover:brightness-105"
            >
              <Printer className="w-3.5 h-3.5 text-white" />
              <span>Download PDF / Print</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
