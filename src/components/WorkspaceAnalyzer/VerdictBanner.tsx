import React from 'react';
import { AlertOctagon, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Verdict } from '../../types';
import { RiskGauge } from './RiskGauge';

interface VerdictBannerProps {
  verdict: Verdict;
  riskScore: number;
  summary: string;
  projectName: string;
}

export const VerdictBanner: React.FC<VerdictBannerProps> = ({
  verdict,
  riskScore,
  summary,
  projectName,
}) => {
  const getVerdictConfig = () => {
    switch (verdict) {
      case 'OUT_OF_SCOPE':
        return {
          title: 'OUT-OF-SCOPE ALERT',
          badgeClass: 'bg-[#FB7185]/15 text-[#FB7185] border-[#FB7185]/40 font-bold',
          borderClass: 'border-[#FB7185]/40',
          icon: <AlertOctagon className="w-5 h-5 text-[#FB7185]" />,
        };
      case 'PARTIAL_CREEP':
        return {
          title: 'PARTIAL SCOPE CREEP',
          badgeClass: 'bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/40 font-bold',
          borderClass: 'border-[#F59E0B]/40',
          icon: <AlertTriangle className="w-5 h-5 text-[#F59E0B]" />,
        };
      case 'IN_SCOPE':
      default:
        return {
          title: 'IN-SCOPE — SAFE TO PROCEED',
          badgeClass: 'bg-[#22C55E]/15 text-[#22C55E] border-[#22C55E]/40 font-bold',
          borderClass: 'border-[#22C55E]/40',
          icon: <CheckCircle2 className="w-5 h-5 text-[#22C55E]" />,
        };
    }
  };

  const config = getVerdictConfig();

  return (
    <div
      className={`p-6 rounded-2xl bg-[#141418] border ${config.borderClass} shadow-lg transition-all`}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        {/* Left: Status badge + Project + Clear 1-Sentence Summary */}
        <div className="space-y-3 max-w-xl">
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono tracking-wider border shadow-sm ${config.badgeClass}`}
            >
              {config.icon}
              {config.title}
            </span>
            <span className="text-xs font-mono text-[#A1A1AA]">
              {projectName}
            </span>
          </div>

          <p className="text-base font-medium text-[#FAFAFA] leading-relaxed font-sans">
            {summary}
          </p>
        </div>

        {/* Right: Risk Score ring with generous breathing room */}
        <div className="flex-shrink-0 self-center sm:self-auto pl-2">
          <RiskGauge score={riskScore} size={115} />
        </div>
      </div>
    </div>
  );
};
