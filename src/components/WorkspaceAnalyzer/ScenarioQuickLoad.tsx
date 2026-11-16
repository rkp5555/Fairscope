import React from 'react';
import { PRESET_SCENARIOS } from '../../data/presets';
import { PresetScenario } from '../../types';

interface ScenarioQuickLoadProps {
  onSelectPreset: (preset: PresetScenario) => void;
  selectedPresetId?: string;
}

export const ScenarioQuickLoad: React.FC<ScenarioQuickLoadProps> = ({
  onSelectPreset,
  selectedPresetId,
}) => {
  const presetShortNames: Record<string, string> = {
    'preset-ecommerce': '1. E-Commerce Trap',
    'preset-branding': '2. Brand Identity',
    'preset-retainer': '3. Safe Retainer',
  };

  return (
    <div className="flex flex-wrap items-center gap-3 py-1">
      <span className="text-sm font-semibold text-[#A1A1AA] flex-shrink-0">
        Load Demo Scenario:
      </span>

      <div className="flex flex-wrap items-center gap-2">
        {PRESET_SCENARIOS.map((scenario) => {
          const isSelected = selectedPresetId === scenario.id;
          const label = presetShortNames[scenario.id] || scenario.title;
          return (
            <button
              key={scenario.id}
              type="button"
              onClick={() => onSelectPreset(scenario)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] text-white font-bold shadow-md shadow-[#8B5CF6]/30 border border-[#8B5CF6]'
                  : 'bg-[#141418] text-[#A1A1AA] border border-[#27272A] hover:border-[#8B5CF6]/60 hover:text-[#FAFAFA] hover:bg-[#1C1C22]'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
