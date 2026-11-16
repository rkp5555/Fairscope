import React, { useState } from 'react';
import { HeartHandshake, ShieldAlert, DollarSign, Copy, Check, Mail, Phone } from 'lucide-react';
import { ClientResponses } from '../../types';

interface ResponseStudioProps {
  responses: ClientResponses;
  onShowToast: (type: 'success' | 'error' | 'info', title: string, desc?: string) => void;
}

export const ResponseStudio: React.FC<ResponseStudioProps> = ({ responses, onShowToast }) => {
  const [activeTab, setActiveTab] = useState<'warm' | 'firm' | 'upsell'>('warm');
  const [copied, setCopied] = useState(false);
  const [editableTexts, setEditableTexts] = useState({
    warm: responses.warmCollaborative,
    firm: responses.firmBoundary,
    upsell: responses.paidUpsell,
  });

  React.useEffect(() => {
    setEditableTexts({
      warm: responses.warmCollaborative,
      firm: responses.firmBoundary,
      upsell: responses.paidUpsell,
    });
  }, [responses]);

  const currentText =
    activeTab === 'warm'
      ? editableTexts.warm
      : activeTab === 'firm'
      ? editableTexts.firm
      : editableTexts.upsell;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentText);
      setCopied(true);
      onShowToast('success', 'Copied to Clipboard ✓', 'Response message ready to paste.');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      onShowToast('error', 'Copy Failed', 'Unable to access clipboard.');
    }
  };

  const openWhatsApp = () => {
    const encoded = encodeURIComponent(currentText);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  const openEmail = () => {
    const subject = encodeURIComponent('Project Scope Update & Addendum');
    const body = encodeURIComponent(currentText);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const updateCurrentText = (val: string) => {
    setEditableTexts((prev) => ({
      ...prev,
      [activeTab]: val,
    }));
  };

  const tabs: {
    id: 'warm' | 'firm' | 'upsell';
    label: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: 'warm',
      label: 'Warm & Collaborative',
      icon: <HeartHandshake className="w-4 h-4" />,
    },
    {
      id: 'firm',
      label: 'Firm Boundary',
      icon: <ShieldAlert className="w-4 h-4" />,
    },
    {
      id: 'upsell',
      label: 'Paid Change-Order Upsell',
      icon: <DollarSign className="w-4 h-4" />,
    },
  ];

  return (
    <div className="space-y-4">
      {/* 3 Tone Option Tabs */}
      <div className="flex items-center p-1 rounded-xl bg-[#09090B] border border-[#27272A]">
        {tabs.map((tab) => {
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-semibold transition-all ${
                isSelected
                  ? 'bg-[#141418] text-[#FAFAFA] shadow-sm border border-[#8B5CF6]/50'
                  : 'text-[#A1A1AA] hover:text-[#FAFAFA]'
              }`}
            >
              <span className={isSelected ? 'text-[#8B5CF6]' : 'text-[#A1A1AA]'}>
                {tab.icon}
              </span>
              <span className="truncate">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Editable Big Readable Textarea */}
      <div className="relative rounded-xl bg-[#09090B] border border-[#27272A] shadow-inner overflow-hidden focus-within:border-[#8B5CF6]">
        <textarea
          rows={7}
          value={currentText}
          onChange={(e) => updateCurrentText(e.target.value)}
          className="w-full p-5 bg-transparent text-base text-[#FAFAFA] leading-relaxed focus:outline-none resize-y font-sans placeholder:text-[#A1A1AA]/40"
          placeholder="AI-generated diplomatic response message..."
        />

        {/* Action Triggers Bar */}
        <div className="px-5 py-3 bg-[#141418] border-t border-[#27272A] flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs text-[#A1A1AA] font-mono">
            Click to edit message before sending
          </span>

          <div className="flex items-center gap-2.5">
            {/* Copy Button */}
            <button
              type="button"
              onClick={handleCopy}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md ${
                copied
                  ? 'bg-[#22C55E] text-white border border-[#22C55E]'
                  : 'bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] hover:from-[#7C3AED] hover:to-[#4F46E5] text-white shadow-[#8B5CF6]/30 border border-[#8B5CF6]/50'
              }`}
            >
              {copied ? <Check className="w-4 h-4 font-bold" /> : <Copy className="w-4 h-4 font-bold" />}
              <span>{copied ? 'Copied!' : 'Copy Message'}</span>
            </button>

            {/* WhatsApp Trigger */}
            <button
              type="button"
              onClick={openWhatsApp}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#22C55E]/15 hover:bg-[#22C55E]/25 text-[#22C55E] border border-[#22C55E]/40 transition-colors"
              title="Open WhatsApp Web with this draft message pre-filled"
            >
              <Phone className="w-4 h-4 text-[#22C55E]" />
              <span>WhatsApp</span>
            </button>

            {/* Email Trigger */}
            <button
              type="button"
              onClick={openEmail}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#09090B] hover:bg-[#1C1C22] text-[#A1A1AA] hover:text-[#FAFAFA] border border-[#27272A] transition-colors"
              title="Open Default Mail App"
            >
              <Mail className="w-4 h-4 text-[#8B5CF6]" />
              <span>Email</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
