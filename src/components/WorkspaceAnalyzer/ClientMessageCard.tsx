import React from 'react';
import { Mail, Hash, Phone } from 'lucide-react';
import { Channel } from '../../types';

interface ClientMessageCardProps {
  message: string;
  setMessage: (val: string) => void;
  channel: Channel;
  setChannel: (val: Channel) => void;
}

export const ClientMessageCard: React.FC<ClientMessageCardProps> = ({
  message,
  setMessage,
  channel,
  setChannel,
}) => {
  const channels: { id: Channel; label: string; icon: React.ReactNode; activeClass: string }[] = [
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      icon: <Phone className="w-3.5 h-3.5" />,
      activeClass: 'bg-[#22C55E]/15 border-[#22C55E]/50 text-[#22C55E] ring-1 ring-[#22C55E]/30 font-semibold',
    },
    {
      id: 'email',
      label: 'Email',
      icon: <Mail className="w-3.5 h-3.5" />,
      activeClass: 'bg-[#8B5CF6]/15 border-[#8B5CF6]/50 text-[#C4B5FD] ring-1 ring-[#8B5CF6]/30 font-semibold',
    },
    {
      id: 'slack',
      label: 'Slack',
      icon: <Hash className="w-3.5 h-3.5" />,
      activeClass: 'bg-[#F59E0B]/15 border-[#F59E0B]/50 text-[#F59E0B] ring-1 ring-[#F59E0B]/30 font-semibold',
    },
  ];

  return (
    <div className="p-6 rounded-2xl bg-[#141418] border border-[#27272A] shadow-md space-y-4">
      {/* Header bar with Step Badge & Channel Pills */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="px-2.5 py-1 rounded-md text-xs font-bold font-mono bg-[#8B5CF6]/15 text-[#C4B5FD] border border-[#8B5CF6]/30">
            Step 2
          </span>
          <h2 className="text-sm font-semibold tracking-wide text-[#FAFAFA]">
            Client's Incoming Ask
          </h2>
        </div>

        {/* Channel Selector Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#09090B] border border-[#27272A]">
          {channels.map((ch) => {
            const isSelected = channel === ch.id;
            return (
              <button
                key={ch.id}
                type="button"
                onClick={() => setChannel(ch.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isSelected
                    ? ch.activeClass
                    : 'text-[#A1A1AA] hover:text-[#FAFAFA]'
                }`}
              >
                {ch.icon}
                <span>{ch.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Styled Chat Message Composer */}
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={4}
        placeholder="Paste client message, WhatsApp audio summary, or email thread here..."
        className="w-full p-4 rounded-xl bg-[#09090B] border border-[#27272A] text-base text-[#FAFAFA] placeholder:text-[#A1A1AA]/40 focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6] transition-all resize-y leading-relaxed font-sans"
      />
    </div>
  );
};
