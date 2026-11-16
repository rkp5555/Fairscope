import React from 'react';
import { ShieldAlert, Clock, DollarSign, Activity } from 'lucide-react';
import { AuditResult, Currency } from '../../types';
import { formatCurrency, formatHours } from '../../utils/formatters';

interface RevenueSummaryCardsProps {
  audits: AuditResult[];
  currency: Currency;
}

export const RevenueSummaryCards: React.FC<RevenueSummaryCardsProps> = ({ audits, currency }) => {
  const totalAudits = audits.length;
  const trapsCaught = audits.filter(a => a.verdict === 'OUT_OF_SCOPE' || a.verdict === 'PARTIAL_CREEP').length;
  const totalHoursSaved = audits.reduce((acc, curr) => acc + (curr.extraHours || 0), 0);
  const totalRevenueProtected = audits.reduce((acc, curr) => acc + (curr.quotedAmount || 0), 0);

  const cards = [
    {
      title: 'Total Audits Run',
      value: totalAudits.toString(),
      subtext: 'Contracts & asks analyzed',
      icon: <Activity className="w-5 h-5 text-[#8B5CF6]" />,
      colorClass: 'border-[#27272A] bg-[#141418]',
      valueClass: 'text-[#FAFAFA]',
    },
    {
      title: 'Scope Traps Caught',
      value: trapsCaught.toString(),
      subtext: `${totalAudits > 0 ? Math.round((trapsCaught / totalAudits) * 100) : 0}% of asks exceeded SOW`,
      icon: <ShieldAlert className="w-5 h-5 text-[#FB7185]" />,
      colorClass: 'border-[#27272A] bg-[#141418]',
      valueClass: 'text-[#FB7185]',
    },
    {
      title: 'Unbilled Hours Saved',
      value: formatHours(totalHoursSaved),
      subtext: 'Free labor intercepted',
      icon: <Clock className="w-5 h-5 text-[#F59E0B]" />,
      colorClass: 'border-[#27272A] bg-[#141418]',
      valueClass: 'text-[#F59E0B]',
    },
    {
      title: 'Protected Revenue',
      value: formatCurrency(totalRevenueProtected, currency),
      subtext: 'Recovered via change-orders',
      icon: <DollarSign className="w-5 h-5 text-[#22C55E]" />,
      colorClass: 'border-[#22C55E]/40 bg-[#141418]',
      valueClass: 'text-[#22C55E]',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className={`p-6 rounded-2xl border shadow-md transition-all ${card.colorClass}`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-[#A1A1AA]">
              {card.title}
            </span>
            <div className="p-2 rounded-xl bg-[#09090B] border border-[#27272A]">
              {card.icon}
            </div>
          </div>
          <div className={`text-3xl font-mono font-bold tracking-tight ${card.valueClass}`}>
            {card.value}
          </div>
          <div className="text-xs text-[#A1A1AA]/80 mt-1.5 font-medium">
            {card.subtext}
          </div>
        </div>
      ))}
    </div>
  );
};
