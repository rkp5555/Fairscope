import { Currency, CURRENCIES } from '../types';

export function formatCurrency(amount: number, currency: Currency = 'INR'): string {
  const config = CURRENCIES[currency] || CURRENCIES.INR;
  const num = Math.round(amount);
  
  if (currency === 'INR') {
    return `${config.symbol}${num.toLocaleString('en-IN')}`;
  }
  return `${config.symbol}${num.toLocaleString('en-US')}`;
}

export function formatHours(hours: number): string {
  return `${hours >= 0 ? '+' : ''}${hours.toFixed(1)} hrs`;
}

export function formatPercent(val: number): string {
  return `${Math.min(100, Math.max(0, Math.round(val)))}%`;
}

export function formatDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return isoString;
  }
}

export function generateId(): string {
  return 'sg_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36);
}
