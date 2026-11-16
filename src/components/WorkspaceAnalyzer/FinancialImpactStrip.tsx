import React, { useState } from 'react';
import { Edit3, Check } from 'lucide-react';
import { Currency, CURRENCIES } from '../../types';
import { formatCurrency, formatHours } from '../../utils/formatters';

interface FinancialImpactStripProps {
  extraHours: number;
  unbilledRevenue: number;
  quotedAmount: number;
  currency: Currency;
  onUpdateQuote: (newQuote: number) => void;
}

export const FinancialImpactStrip: React.FC<FinancialImpactStripProps> = ({
  extraHours,
  unbilledRevenue,
  quotedAmount,
  currency,
  onUpdateQuote,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(String(quotedAmount));
  const symbol = CURRENCIES[currency]?.symbol || '₹';

  const handleSaveEdit = () => {
    const parsed = Number(editValue);
    if (!isNaN(parsed) && parsed >= 0) {
      onUpdateQuote(parsed);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSaveEdit();
    if (e.key === 'Escape') {
      setEditValue(String(quotedAmount));
      setIsEditing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* 1. Estimated Extra Effort */}
      <div className="p-6 rounded-2xl bg-[#141418] border border-[#27272A] shadow-md flex flex-col justify-between">
        <span className="text-sm font-semibold tracking-wide text-[#A1A1AA]">
          Estimated Extra Effort
        </span>
        <div className="text-3xl font-mono font-bold text-[#FAFAFA] my-2">
          {formatHours(extraHours)}
        </div>
        <span className="text-xs text-[#8B5CF6] font-medium">
          Uncontracted Hours
        </span>
      </div>

      {/* 2. Unbilled Revenue at Risk */}
      <div className="p-6 rounded-2xl bg-[#141418] border border-[#27272A] shadow-md flex flex-col justify-between">
        <span className="text-sm font-semibold tracking-wide text-[#A1A1AA]">
          Revenue at Risk
        </span>
        <div className="text-3xl font-mono font-bold text-[#FB7185] my-2">
          {formatCurrency(unbilledRevenue, currency)}
        </div>
        <span className="text-xs text-[#A1A1AA] font-medium">
          Unbilled Labor
        </span>
      </div>

      {/* 3. Recommended Change-Order Quote */}
      <div className="p-6 rounded-2xl bg-[#141418] border border-[#22C55E]/40 shadow-md flex flex-col justify-between relative group">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold tracking-wide text-[#FAFAFA]">
            Recommended Quote
          </span>
          {!isEditing && (
            <button
              type="button"
              onClick={() => {
                setEditValue(String(quotedAmount));
                setIsEditing(true);
              }}
              className="text-xs text-[#8B5CF6] hover:text-[#C4B5FD] flex items-center gap-1 font-semibold transition-colors"
              title="Edit quote before sending"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          )}
        </div>

        {isEditing ? (
          <div className="flex items-center gap-2 my-2">
            <div className="relative flex-1">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-sm font-mono text-[#8B5CF6]">
                {symbol}
              </span>
              <input
                type="number"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
                className="w-full pl-7 pr-3 py-1 bg-[#09090B] border border-[#8B5CF6] rounded-lg text-2xl font-mono font-bold text-[#FAFAFA] focus:outline-none"
              />
            </div>
            <button
              type="button"
              onClick={handleSaveEdit}
              className="p-2 rounded-lg bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] text-white hover:from-[#7C3AED] hover:to-[#4F46E5] transition-colors"
              title="Save quote"
            >
              <Check className="w-4 h-4 font-bold" />
            </button>
          </div>
        ) : (
          <div className="text-3xl font-mono font-bold text-[#22C55E] my-2">
            {formatCurrency(quotedAmount, currency)}
          </div>
        )}

        <span className="text-xs text-[#22C55E]/80 font-medium">
          Change Order
        </span>
      </div>
    </div>
  );
};
