import React from 'react';
import { CheckCircle2, AlertTriangle, ShieldX, Clock, FileText } from 'lucide-react';
import { Currency, RequestItem } from '../../types';
import { formatCurrency, formatHours } from '../../utils/formatters';

interface ItemizedBreakdownProps {
  items: RequestItem[];
  currency: Currency;
}

export const ItemizedBreakdown: React.FC<ItemizedBreakdownProps> = ({ items, currency }) => {
  const getStatusBadge = (status: RequestItem['status']) => {
    switch (status) {
      case 'covered':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/40">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" />
            Covered in SOW
          </span>
        );
      case 'exceeds_limit':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/40">
            <AlertTriangle className="w-3.5 h-3.5 text-[#F59E0B]" />
            Exceeds Revision Limit
          </span>
        );
      case 'excluded_new':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#FB7185]/15 text-[#FB7185] border border-[#FB7185]/40">
            <ShieldX className="w-3.5 h-3.5 text-[#FB7185]" />
            Excluded / New Scope
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold tracking-wide text-[#FAFAFA]">
          Itemized Request Breakdown & Violations
        </h3>
        <span className="text-xs font-mono text-[#A1A1AA]">
          {items.length} Distinct Ask{items.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="space-y-3.5">
        {items.map((item, idx) => (
          <div
            key={item.id || idx}
            className={`p-5 rounded-xl border transition-all ${
              item.status === 'covered'
                ? 'bg-[#09090B] border-[#22C55E]/40'
                : item.status === 'exceeds_limit'
                ? 'bg-[#09090B] border-[#F59E0B]/40'
                : 'bg-[#09090B] border-[#FB7185]/40 shadow-sm'
            }`}
          >
            {/* Top row: Client ask + status tag */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#141418] text-[#A1A1AA] border border-[#27272A] flex items-center justify-center text-xs font-mono font-bold flex-shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="text-base font-semibold text-[#FAFAFA] leading-snug">
                  {item.ask}
                </span>
              </div>
              <div className="self-start sm:self-auto flex-shrink-0">
                {getStatusBadge(item.status)}
              </div>
            </div>

            {/* Middle: Contract Citation Violated */}
            <div className="p-3.5 rounded-xl bg-[#141418] border border-[#27272A] mb-3 flex items-start gap-2.5">
              <FileText className="w-4 h-4 text-[#8B5CF6] flex-shrink-0 mt-0.5" />
              <div className="text-sm font-mono text-[#FAFAFA] leading-relaxed">
                <strong className="text-[#8B5CF6] font-semibold">Contract Clause: </strong>
                {item.citation}
              </div>
            </div>

            {/* Bottom: Effort & Cost Impact */}
            <div className="flex items-center justify-between text-xs font-mono pt-1 text-[#A1A1AA]">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#8B5CF6]" />
                <span>Effort Required:</span> <strong className="text-[#FAFAFA]">{formatHours(item.effortHours)}</strong>
              </span>

              <span className="flex items-center gap-1 font-bold">
                <span className="text-[#A1A1AA]">Cost Impact:</span>
                <span className={item.estimatedCost > 0 ? 'text-[#22C55E]' : 'text-[#A1A1AA]'}>
                  {formatCurrency(item.estimatedCost, currency)}
                </span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
