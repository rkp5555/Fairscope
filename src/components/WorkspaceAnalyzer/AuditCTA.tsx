import React, { useEffect, useState } from 'react';
import { ShieldCheck, Loader2, ArrowRight } from 'lucide-react';

interface AuditCTAProps {
  onRunAudit: () => void;
  isLoading: boolean;
  disabled?: boolean;
}

export const AuditCTA: React.FC<AuditCTAProps> = ({
  onRunAudit,
  isLoading,
  disabled = false,
}) => {
  const [stepIndex, setStepIndex] = useState(0);

  const steps = [
    'Parsing contract clauses & exclusions...',
    'Cross-referencing deliverables with client ask...',
    'Calculating unbilled hours & change-order quote...',
    'Finalizing diplomatic client boundary responses...',
  ];

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isLoading) {
      setStepIndex(0);
      interval = setInterval(() => {
        setStepIndex((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
      }, 350);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  return (
    <button
      type="button"
      onClick={onRunAudit}
      disabled={disabled || isLoading}
      className={`w-full relative group overflow-hidden py-4 px-6 rounded-2xl text-base font-bold tracking-wide transition-all duration-300 shadow-xl ${
        isLoading
          ? 'bg-[#141418] text-[#C4B5FD] border border-[#8B5CF6]/40 cursor-wait'
          : disabled
          ? 'bg-[#141418]/60 text-[#A1A1AA]/50 border border-[#27272A] cursor-not-allowed'
          : 'bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] hover:from-[#7C3AED] hover:to-[#4F46E5] text-white shadow-lg shadow-[#8B5CF6]/30 hover:shadow-[#8B5CF6]/50 border border-[#8B5CF6]/50 active:scale-[0.99]'
      }`}
    >
      <div className="relative flex items-center justify-center gap-3">
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin text-[#8B5CF6] flex-shrink-0" />
            <span className="font-mono text-sm animate-pulse text-[#C4B5FD]">
              {steps[stepIndex]}
            </span>
          </>
        ) : (
          <>
            <ShieldCheck className="w-5 h-5 text-white transition-transform group-hover:scale-110" />
            <span>Run Scope & Revenue Audit</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono bg-black/30 text-white border border-white/20 ml-1 font-semibold">
              Ctrl + Enter
            </span>
            <ArrowRight className="w-5 h-5 text-white transition-transform group-hover:translate-x-1" />
          </>
        )}
      </div>
    </button>
  );
};
