import React, { useRef } from 'react';
import { Upload, Trash2 } from 'lucide-react';

interface ContractCardProps {
  contract: string;
  setContract: (val: string) => void;
  onShowToast: (type: 'success' | 'error' | 'info', title: string, desc?: string) => void;
}

export const ContractCard: React.FC<ContractCardProps> = ({
  contract,
  setContract,
  onShowToast,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.txt') && !file.name.endsWith('.md')) {
      onShowToast('error', 'Unsupported File', 'Please upload a .txt or .md contract document.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setContract(content);
        onShowToast('success', 'Contract Loaded', `Imported "${file.name}" (${content.length} characters).`);
      }
    };
    reader.onerror = () => {
      onShowToast('error', 'Read Error', 'Failed to read file from disk.');
    };
    reader.readAsText(file);

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleClear = () => {
    setContract('');
    onShowToast('info', 'Contract Cleared', 'Scope text has been emptied.');
  };

  return (
    <div className="p-6 rounded-2xl bg-[#141418] border border-[#27272A] shadow-md space-y-4">
      {/* Header bar with Step Badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="px-2.5 py-1 rounded-md text-xs font-bold font-mono bg-[#8B5CF6]/15 text-[#C4B5FD] border border-[#8B5CF6]/30">
            Step 1
          </span>
          <h2 className="text-sm font-semibold tracking-wide text-[#FAFAFA]">
            Signed Contract / SOW
          </h2>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.md"
            onChange={handleFileUpload}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#A1A1AA] hover:text-[#FAFAFA] bg-[#09090B] hover:bg-[#1C1C22] border border-[#27272A] hover:border-[#8B5CF6]/50 transition-all"
            title="Upload .TXT or .MD contract document"
          >
            <Upload className="w-3.5 h-3.5 text-[#8B5CF6]" />
            <span>Upload Document</span>
          </button>

          {contract && (
            <button
              type="button"
              onClick={handleClear}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#A1A1AA] hover:text-[#FB7185] hover:bg-[#FB7185]/10 transition-colors"
              title="Clear contract text"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}

          <span className="text-xs font-mono text-[#A1A1AA]/70 pl-1">
            {contract.length} chars
          </span>
        </div>
      </div>

      {/* Structured Textarea */}
      <textarea
        value={contract}
        onChange={(e) => setContract(e.target.value)}
        rows={6}
        placeholder="Paste your signed contract deliverables, revision limits, and explicit exclusions..."
        className="w-full p-4 rounded-xl bg-[#09090B] border border-[#27272A] text-base font-mono text-[#FAFAFA] placeholder:text-[#A1A1AA]/40 focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6] transition-all resize-y leading-relaxed"
      />
    </div>
  );
};
