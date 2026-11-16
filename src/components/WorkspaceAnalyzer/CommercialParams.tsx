import React from 'react';
import { ClientSensitivity, Currency, CURRENCIES } from '../../types';

interface CommercialParamsProps {
  hourlyRate: number;
  setHourlyRate: (val: number) => void;
  currency: Currency;
  sensitivity: ClientSensitivity;
  setSensitivity: (val: ClientSensitivity) => void;
}

export const CommercialParams: React.FC<CommercialParamsProps> = ({
  hourlyRate,
  setHourlyRate,
  currency,
  sensitivity,
  setSensitivity,
}) => {
  const symbol = CURRENCIES[currency]?.symbol || '₹';

  const sensitivityOptions: {
    id: ClientSensitivity;
    label: string;
    desc: string;
  }[] = [
    {
      id: 'new',
      label: 'New Client',
      desc: 'Sets firm early boundaries with warm professionalism',
    },
    {
      id: 'partner',
      label: 'Long-Term Partner',
      desc: 'High rapport; gentle consultative scope-fence',
    },
    {
      id: 'repeat_creeper',
      label: 'Repeat Creeper',
      desc: 'Zero tolerance; strict contractual change-order gate',
    },
  ];

  return (
    <div className="p-6 rounded-2xl bg-[#141418] border border-[#27272A] shadow-md space-y-4">
      {/* Header bar with Step Badge */}
      <div className="flex items-center gap-2.5">
        <span className="px-2.5 py-1 rounded-md text-xs font-bold font-mono bg-[#8B5CF6]/15 text-[#C4B5FD] border border-[#8B5CF6]/30">
          Step 3
        </span>
        <h2 className="text-sm font-semibold tracking-wide text-[#FAFAFA]">
          Hourly Rate & Client Tone
        </h2>
      </div>

      {/* Combined Single Row: Hourly Rate + Client Tone */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Hourly Rate (4 cols) with h-11 */}
        <div className="md:col-span-4">
          <div className="relative h-11 rounded-xl bg-[#09090B] border border-[#27272A] focus-within:border-[#8B5CF6] focus-within:ring-1 focus-within:ring-[#8B5CF6] transition-all flex items-center">
            <span className="pl-3.5 text-sm font-mono font-bold text-[#8B5CF6] select-none">
              {symbol}
            </span>
            <input
              type="number"
              min="0"
              step="50"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(Number(e.target.value) || 0)}
              className="w-full h-full pl-2 pr-12 bg-transparent text-sm font-mono font-bold text-[#FAFAFA] focus:outline-none"
              placeholder="1500"
            />
            <span className="pr-3 text-xs font-mono text-[#A1A1AA] select-none">
              / hr
            </span>
          </div>
        </div>

        {/* Client Tone Segmented Selector (8 cols) with h-11 */}
        <div className="md:col-span-8">
          <div className="h-11 grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-[#09090B] border border-[#27272A]">
            {sensitivityOptions.map((opt) => {
              const isSelected = sensitivity === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSensitivity(opt.id)}
                  className={`h-full flex items-center justify-center px-2 rounded-lg text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] text-white font-bold shadow-md shadow-[#8B5CF6]/25 border border-[#8B5CF6]'
                      : 'text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-[#141418]'
                  }`}
                  title={opt.desc}
                >
                  <span className="truncate">{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
