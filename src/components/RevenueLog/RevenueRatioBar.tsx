import React from 'react';
import { AuditResult, Currency } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface RevenueRatioBarProps {
  audits: AuditResult[];
  currency: Currency;
}

export const RevenueRatioBar: React.FC<RevenueRatioBarProps> = ({ audits, currency }) => {
  const inScopeCount = audits.filter(a => a.verdict === 'IN_SCOPE').length;
  const outOfScopeCount = audits.filter(a => a.verdict === 'OUT_OF_SCOPE' || a.verdict === 'PARTIAL_CREEP').length;
  const total = audits.length || 1;

  const inScopePct = Math.round((inScopeCount / total) * 100);
  const outOfScopePct = 100 - inScopePct;

  const totalProtectedAmount = audits.reduce((acc, curr) => acc + (curr.quotedAmount || 0), 0);

  return (
    <div className="p-6 rounded-2xl bg-[#141418] border border-[#27272A] shadow-md space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold tracking-wide text-[#FAFAFA]">
            Scope Distribution & Boundary Integrity
          </h3>
          <p className="text-xs text-[#A1A1AA] mt-0.5">
            Ratio of compliant requests vs. unbilled scope creep attempts intercepted
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono font-medium">
          <span className="flex items-center gap-1.5 text-[#22C55E]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E]" />
            In-Scope ({inScopePct}%)
          </span>
          <span className="flex items-center gap-1.5 text-[#8B5CF6]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6]" />
            Protected Upsell ({outOfScopePct}%)
          </span>
        </div>
      </div>

      {/* Visual Stacked Bar with Obsidian & Electric Violet Palette */}
      <div className="w-full h-4 rounded-full bg-[#09090B] overflow-hidden flex p-0.5 border border-[#27272A]">
        <div
          style={{ width: `${inScopePct}%` }}
          className="h-full bg-gradient-to-r from-[#22C55E] to-[#16A34A] rounded-l-full transition-all duration-700"
          title={`In-Scope: ${inScopeCount} requests (${inScopePct}%)`}
        />
        <div
          style={{ width: `${outOfScopePct}%` }}
          className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] rounded-r-full transition-all duration-700"
          title={`Intercepted Creep: ${outOfScopeCount} requests (${outOfScopePct}%) • ${formatCurrency(totalProtectedAmount, currency)} protected`}
        />
      </div>

      <div className="flex items-center justify-between text-xs text-[#A1A1AA] font-mono">
        <span>{inScopeCount} Compliant Milestone Asks</span>
        <span>{outOfScopeCount} Traps Re-routed to Formal Change-Orders</span>
      </div>
    </div>
  );
};
