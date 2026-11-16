import React from 'react';
import { Sparkles, Settings as SettingsIcon, BarChart3, ScanSearch } from 'lucide-react';
import { AppSettings } from '../types';

interface HeaderProps {
  activeView: 'analyzer' | 'revenue-log';
  setActiveView: (view: 'analyzer' | 'revenue-log') => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onOpenSettings: () => void;
  auditCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  setActiveView,
  settings,
  onUpdateSettings,
  onOpenSettings,
  auditCount = 0,
}) => {
  const toggleDemoMode = () => {
    onUpdateSettings({ demoMode: !settings.demoMode });
  };

  return (
    <header className="sticky top-0 z-40 h-16 w-full border-b border-[#27272A] bg-[#09090B]/95 backdrop-blur-md transition-colors">
      <div className="max-w-[1440px] mx-auto h-full px-8 flex items-center justify-between gap-6">
        {/* Left: Logo with Minimalist [FairScope] Wordmark */}
        <div className="flex items-center gap-3 select-none flex-shrink-0">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#6366F1] shadow-md shadow-[#8B5CF6]/30 border border-[#8B5CF6]/50">
            <svg
              className="w-5 h-5 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#22C55E] ring-2 ring-[#09090B]" />
          </div>

          <div className="flex items-center gap-2">
            <span className="font-extrabold text-lg tracking-tight text-[#FAFAFA] flex items-center">
              <span className="text-[#8B5CF6] font-mono mr-0.5 font-bold">[</span>
              <span>Fair</span>
              <span className="text-[#8B5CF6]">Scope</span>
              <span className="text-[#8B5CF6] font-mono ml-0.5 font-bold">]</span>
            </span>
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-[#8B5CF6]/15 text-[#C4B5FD] border border-[#8B5CF6]/30">
              v2.6
            </span>
          </div>
        </div>

        {/* Center: 2 Main View Switcher Tabs */}
        <div className="flex items-center p-1 rounded-xl bg-[#141418] border border-[#27272A] shadow-inner">
          <button
            onClick={() => setActiveView('analyzer')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              activeView === 'analyzer'
                ? 'bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] text-white shadow-md shadow-[#8B5CF6]/25 font-bold border border-[#8B5CF6]/50'
                : 'text-[#A1A1AA] hover:text-[#FAFAFA]'
            }`}
          >
            <ScanSearch className={`w-4 h-4 ${activeView === 'analyzer' ? 'text-white' : 'text-[#A1A1AA]'}`} />
            <span>Audit Workspace</span>
          </button>

          <button
            onClick={() => setActiveView('revenue-log')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              activeView === 'revenue-log'
                ? 'bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] text-white shadow-md shadow-[#8B5CF6]/25 font-bold border border-[#8B5CF6]/50'
                : 'text-[#A1A1AA] hover:text-[#FAFAFA]'
            }`}
          >
            <BarChart3 className={`w-4 h-4 ${activeView === 'revenue-log' ? 'text-white' : 'text-[#A1A1AA]'}`} />
            <span>Revenue Log</span>
            {auditCount > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-xs font-mono font-medium ${
                activeView === 'revenue-log' ? 'bg-[#09090B]/40 text-white font-bold' : 'bg-[#09090B] text-[#A1A1AA] border border-[#27272A]'
              }`}>
                {auditCount}
              </span>
            )}
          </button>
        </div>

        {/* Right: Mode Status Pill + Settings Button */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Mode Status Pill */}
          <button
            onClick={toggleDemoMode}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              settings.demoMode
                ? 'bg-[#8B5CF6]/15 text-[#C4B5FD] border-[#8B5CF6]/40 hover:bg-[#8B5CF6]/25'
                : 'bg-[#22C55E]/15 text-[#22C55E] border-[#22C55E]/40 hover:bg-[#22C55E]/25'
            }`}
            title={settings.demoMode ? 'Demo Mode active' : 'Live Mode active'}
          >
            <Sparkles className={`w-3.5 h-3.5 ${settings.demoMode ? 'text-[#C4B5FD]' : 'text-[#22C55E]'}`} />
            <span className="font-mono text-xs">
              {settings.demoMode ? 'Demo Mode' : 'Live Gemini'}
            </span>
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-[#A1A1AA] hover:text-[#FAFAFA] bg-[#141418] hover:bg-[#1C1C22] border border-[#27272A] hover:border-[#8B5CF6]/50 transition-all shadow-sm"
            title="Open Settings"
          >
            <SettingsIcon className="w-4 h-4 text-[#8B5CF6]" />
            <span>Settings</span>
          </button>
        </div>
      </div>
    </header>
  );
};
