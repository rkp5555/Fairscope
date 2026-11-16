import React from 'react';
import { ShieldCheck, ArrowRight, Zap, Scale, Sparkles, DollarSign } from 'lucide-react';

interface AuditEmptyStateProps {
  onLoadSampleAndRun: () => void;
}

export const AuditEmptyState: React.FC<AuditEmptyStateProps> = ({ onLoadSampleAndRun }) => {
  return (
    <div className="h-full flex flex-col justify-center items-center p-8 md:p-12 text-center animate-fade-in">
      {/* Decorative Shield Icon with Electric Violet Gradient */}
      <div className="relative mb-6">
        <div className="absolute -inset-4 rounded-full bg-[#8B5CF6]/20 blur-xl animate-pulse-subtle" />
        <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#8B5CF6] to-[#6366F1] shadow-xl shadow-[#8B5CF6]/30 text-white border border-[#8B5CF6]/40">
          <ShieldCheck className="w-8 h-8 text-white" />
        </div>
      </div>

      <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-mono font-semibold bg-[#8B5CF6]/15 text-[#C4B5FD] border border-[#8B5CF6]/30 mb-3">
        <Sparkles className="w-3.5 h-3.5 text-[#8B5CF6]" />
        [FairScope] Protection Engine Ready
      </span>

      <h2 className="text-2xl font-bold tracking-tight text-[#FAFAFA] mb-2 max-w-lg">
        Defend Your Boundaries. Stop Doing Free Work.
      </h2>
      <p className="text-sm text-[#A1A1AA] max-w-md leading-relaxed mb-8">
        FairScope cross-references client requests against signed contracts, flags hidden scope creep, and drafts diplomatic change-order quotes in seconds.
      </p>

      {/* 3 Step Workflow Preview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-xl text-left mb-8">
        <div className="p-4 rounded-xl bg-[#09090B] border border-[#27272A]">
          <div className="flex items-center gap-2 mb-1.5 text-[#8B5CF6]">
            <Scale className="w-4 h-4" />
            <span className="text-sm font-semibold text-[#FAFAFA]">1. Ingest SOW</span>
          </div>
          <p className="text-xs text-[#A1A1AA] leading-relaxed">
            Upload contract clauses, revision caps, and explicit exclusions.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#09090B] border border-[#27272A]">
          <div className="flex items-center gap-2 mb-1.5 text-[#F59E0B]">
            <Zap className="w-4 h-4" />
            <span className="text-sm font-semibold text-[#FAFAFA]">2. Cross-Audit</span>
          </div>
          <p className="text-xs text-[#A1A1AA] leading-relaxed">
            AI detects sneaked extra pages, unbilled APIs, and rush sprints.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#09090B] border border-[#27272A]">
          <div className="flex items-center gap-2 mb-1.5 text-[#22C55E]">
            <DollarSign className="w-4 h-4" />
            <span className="text-sm font-semibold text-[#FAFAFA]">3. Protect Revenue</span>
          </div>
          <p className="text-xs text-[#A1A1AA] leading-relaxed">
            Generate defensible change orders and 3 tone-calibrated client replies.
          </p>
        </div>
      </div>

      {/* Prominent One-Click Sample Trigger */}
      <button
        type="button"
        onClick={onLoadSampleAndRun}
        className="group flex items-center gap-3 px-6 py-3.5 rounded-xl font-bold text-sm tracking-wide bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] hover:from-[#7C3AED] hover:to-[#4F46E5] text-white shadow-lg shadow-[#8B5CF6]/30 hover:shadow-[#8B5CF6]/50 border border-[#8B5CF6]/50 transition-all transform hover:-translate-y-0.5"
      >
        <Sparkles className="w-4 h-4 text-white" />
        <span>Load Sample Trap & Run Live Audit</span>
        <ArrowRight className="w-4 h-4 text-white transition-transform group-hover:translate-x-1" />
      </button>

      <span className="mt-3 text-xs text-[#A1A1AA] font-mono">
        1-Click Test • Realistic E-commerce trap with uncontracted Razorpay & B2B portal
      </span>
    </div>
  );
};
