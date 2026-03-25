'use client';

import { useScenarioStore } from '@/store/scenarios';
import { useState } from 'react';
import { runSimulation, getPresets } from '@/lib/api';

interface PresetSelectorProps {
  onPresetSelect: (inputs: any) => void;
}

export function PresetSelector({ onPresetSelect }: PresetSelectorProps) {
  const [presets, setPresets] = useState<any[]>([]);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [showPresets, setShowPresets] = useState(false);

  const loadPresets = async () => {
    try {
      const data = await getPresets();
      setPresets(data);
      setShowPresets(!showPresets);
    } catch (err) {
      console.error('Failed to load presets', err);
    }
  };

  if (!showPresets) {
    return (
      <button
        onClick={loadPresets}
        className="w-full bg-indigo-100 hover:bg-indigo-200 text-indigo-900 font-semibold py-2 rounded transition mb-4"
      >
        📋 Load Preset Scenario
      </button>
    );
  }

  return (
    <div className="mb-4 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
      <h3 className="text-sm font-semibold text-indigo-900 mb-3">Quick Presets</h3>
      <div className="grid gap-2">
        {presets.map((preset) => (
          <button
            key={preset.id}
            onClick={() => {
              setSelectedPreset(preset.id);
              onPresetSelect(preset.inputs);
            }}
            className={`p-2 text-left rounded transition text-sm ${
              selectedPreset === preset.id
                ? 'bg-indigo-600 text-white'
                : 'bg-white border border-indigo-200 text-indigo-900 hover:bg-indigo-100'
            }`}
          >
            <span className="mr-2">{preset.icon}</span>
            {preset.title}
            <p className="text-xs opacity-75 mt-1">{preset.description}</p>
          </button>
        ))}
      </div>
      <button
        onClick={() => setShowPresets(false)}
        className="w-full mt-3 text-sm text-indigo-600 hover:text-indigo-700"
      >
        ← Hide Presets
      </button>
    </div>
  );
}
