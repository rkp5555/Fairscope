import React, { useState, useMemo } from 'react';
import { Search, Download, Trash2, ArrowUpRight, AlertOctagon, AlertTriangle, CheckCircle2, Phone, Mail, Hash, Check } from 'lucide-react';
import { AuditResult, Currency, Verdict, Channel } from '../../types';
import { formatCurrency, formatDate, formatHours } from '../../utils/formatters';
import { exportAuditsToCSV } from '../../services/storage';

interface AuditHistoryTableProps {
  audits: AuditResult[];
  currency: Currency;
  onSelectAudit: (audit: AuditResult) => void;
  onDeleteAudit: (id: string) => void;
  onClearAll: () => void;
  onShowToast: (type: 'success' | 'error' | 'info', title: string, desc?: string) => void;
}

export const AuditHistoryTable: React.FC<AuditHistoryTableProps> = ({
  audits,
  currency,
  onSelectAudit,
  onDeleteAudit,
  onClearAll,
  onShowToast,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [verdictFilter, setVerdictFilter] = useState<string>('ALL');
  const [channelFilter, setChannelFilter] = useState<string>('ALL');

  const filteredAudits = useMemo(() => {
    return audits.filter((audit) => {
      if (verdictFilter !== 'ALL' && audit.verdict !== verdictFilter) {
        return false;
      }
      if (channelFilter !== 'ALL' && audit.clientChannel !== channelFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const inProject = audit.projectName?.toLowerCase().includes(query);
        const inSummary = audit.summary?.toLowerCase().includes(query);
        const inAsks = audit.items?.some(i => i.ask.toLowerCase().includes(query));
        if (!inProject && !inSummary && !inAsks) {
          return false;
        }
      }
      return true;
    });
  }, [audits, searchQuery, verdictFilter, channelFilter]);

  const handleExportCSV = () => {
    if (audits.length === 0) {
      onShowToast('info', 'No Audits to Export', 'Run or save an audit first.');
      return;
    }
    exportAuditsToCSV(audits, currency);
    onShowToast('success', 'CSV Exported ✓', 'Audit log spreadsheet downloaded.');
  };

  const getVerdictBadge = (verdict: Verdict) => {
    switch (verdict) {
      case 'OUT_OF_SCOPE':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#FB7185]/15 text-[#FB7185] border border-[#FB7185]/40">
            <AlertOctagon className="w-3.5 h-3.5" />
            OUT-OF-SCOPE
          </span>
        );
      case 'PARTIAL_CREEP':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/40">
            <AlertTriangle className="w-3.5 h-3.5" />
            PARTIAL CREEP
          </span>
        );
      case 'IN_SCOPE':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/40">
            <CheckCircle2 className="w-3.5 h-3.5" />
            IN-SCOPE
          </span>
        );
    }
  };

  const getChannelIcon = (ch: Channel) => {
    switch (ch) {
      case 'whatsapp':
        return (
          <span title="WhatsApp">
            <Phone className="w-3.5 h-3.5 text-[#22C55E]" />
          </span>
        );
      case 'email':
        return (
          <span title="Email">
            <Mail className="w-3.5 h-3.5 text-[#8B5CF6]" />
          </span>
        );
      case 'slack':
        return (
          <span title="Slack">
            <Hash className="w-3.5 h-3.5 text-[#F59E0B]" />
          </span>
        );
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-[#141418] border border-[#27272A] shadow-xl space-y-5">
      {/* Top Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#8B5CF6] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search audits by project, scope ask, or summary..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#09090B] border border-[#27272A] text-sm text-[#FAFAFA] placeholder:text-[#A1A1AA]/50 focus:outline-none focus:ring-1 focus:ring-[#8B5CF6] focus:border-[#8B5CF6]"
          />
        </div>

        {/* Filter Dropdowns and Export Action */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Verdict Filter */}
          <select
            value={verdictFilter}
            onChange={(e) => setVerdictFilter(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl bg-[#09090B] border border-[#27272A] text-xs font-semibold text-[#FAFAFA] focus:outline-none"
          >
            <option value="ALL">All Verdicts</option>
            <option value="OUT_OF_SCOPE">Out-of-Scope Only</option>
            <option value="PARTIAL_CREEP">Partial Creep Only</option>
            <option value="IN_SCOPE">In-Scope Only</option>
          </select>

          {/* Channel Filter */}
          <select
            value={channelFilter}
            onChange={(e) => setChannelFilter(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl bg-[#09090B] border border-[#27272A] text-xs font-semibold text-[#FAFAFA] focus:outline-none"
          >
            <option value="ALL">All Channels</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="email">Email</option>
            <option value="slack">Slack</option>
          </select>

          {/* Export CSV Button */}
          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] hover:from-[#7C3AED] hover:to-[#4F46E5] text-white shadow-md shadow-[#8B5CF6]/30 border border-[#8B5CF6]/50 transition-all"
            title="Download audit records as CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          {audits.length > 0 && (
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Are you sure you want to clear your local audit log?')) {
                  onClearAll();
                  onShowToast('info', 'History Cleared', 'Audit log has been reset.');
                }
              }}
              className="p-2.5 rounded-xl text-[#A1A1AA] hover:text-[#FB7185] hover:bg-[#FB7185]/10 border border-[#27272A] transition-colors"
              title="Clear all saved audit history"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* History Table Container */}
      <div className="rounded-xl border border-[#27272A] bg-[#09090B] overflow-hidden shadow-inner">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#27272A] bg-[#141418] text-xs font-mono text-[#A1A1AA] uppercase tracking-wider">
                <th className="py-4 px-5 font-semibold">Date & Project</th>
                <th className="py-4 px-4 font-semibold">Channel</th>
                <th className="py-4 px-4 font-semibold">Audit Verdict</th>
                <th className="py-4 px-3 font-semibold">Risk Score</th>
                <th className="py-4 px-3 font-semibold">Extra Effort</th>
                <th className="py-4 px-4 font-semibold">Protected Quote</th>
                <th className="py-4 px-3 font-semibold">Webhook</th>
                <th className="py-4 px-5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27272A]">
              {filteredAudits.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#A1A1AA]">
                    <p className="text-sm font-semibold text-[#FAFAFA]">No audits found</p>
                    <p className="text-xs text-[#A1A1AA]/70 mt-1">Try adjusting your search query or verdict filter</p>
                  </td>
                </tr>
              ) : (
                filteredAudits.map((audit) => (
                  <tr
                    key={audit.id}
                    className="hover:bg-[#141418]/80 transition-colors group"
                  >
                    {/* Date & Project */}
                    <td className="py-4 px-5">
                      <div className="font-bold text-sm text-[#FAFAFA] line-clamp-1">
                        {audit.projectName}
                      </div>
                      <div className="text-xs font-mono text-[#A1A1AA] mt-0.5">
                        {formatDate(audit.timestamp)}
                      </div>
                    </td>

                    {/* Channel */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2 capitalize text-[#FAFAFA]">
                        {getChannelIcon(audit.clientChannel)}
                        <span className="text-xs font-medium">{audit.clientChannel}</span>
                      </div>
                    </td>

                    {/* Verdict */}
                    <td className="py-4 px-4">
                      {getVerdictBadge(audit.verdict)}
                    </td>

                    {/* Risk Score */}
                    <td className="py-4 px-3">
                      <div className="font-mono font-bold text-sm text-[#FAFAFA]">
                        {audit.riskScore}%
                      </div>
                    </td>

                    {/* Extra Effort */}
                    <td className="py-4 px-3">
                      <div className="font-mono text-xs text-[#A1A1AA]">
                        {formatHours(audit.extraHours)}
                      </div>
                    </td>

                    {/* Quoted Amount */}
                    <td className="py-4 px-4">
                      <div className="font-mono font-bold text-sm text-[#22C55E]">
                        {formatCurrency(audit.quotedAmount, audit.currency || currency)}
                      </div>
                    </td>

                    {/* Webhook Sync */}
                    <td className="py-4 px-3">
                      {audit.syncedToWebhook ? (
                        <span className="inline-flex items-center gap-1 text-xs font-mono text-[#22C55E]">
                          <Check className="w-3.5 h-3.5 text-[#22C55E]" />
                          Synced
                        </span>
                      ) : (
                        <span className="text-xs font-mono text-[#A1A1AA]/60">
                          Local
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => onSelectAudit(audit)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-[#8B5CF6] hover:text-white bg-[#8B5CF6]/15 hover:bg-[#8B5CF6] border border-[#8B5CF6]/40 transition-colors"
                          title="Open this audit in the Workspace Analyzer"
                        >
                          <span>Open</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteAudit(audit.id)}
                          className="p-1.5 rounded-lg text-[#A1A1AA] hover:text-[#FB7185] hover:bg-[#FB7185]/10 transition-colors"
                          title="Delete from log"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
