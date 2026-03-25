'use client';

import { useState, useEffect } from 'react';
import { useScenarioStore, ScenarioInputs } from '@/store/scenarios';
import { InputPanel } from '@/components/InputPanel';
import { SimulationCharts } from '@/components/SimulationCharts';
import { InsightPanel } from '@/components/InsightPanel';
import { PresetSelector } from '@/components/PresetSelector';
import { runSimulation, createScenario, updateScenarioInputs } from '@/lib/api';

export default function Dashboard() {
  const {
    inputs,
    outputs,
    setOutputs,
    setIsLoading,
    isLoading,
    setScenarioId,
    setInputs,
  } = useScenarioStore();

  const [scenarioName, setScenarioName] = useState('Untitled Scenario');
  const [isEditingName, setIsEditingName] = useState(false);

  // Initialize with new scenario on mount
  useEffect(() => {
    const initializeScenario = async () => {
      try {
        const scenario = await createScenario('Untitled Scenario');
        setScenarioId(scenario.id);
        setScenarioName(scenario.name);
      } catch (err) {
        console.error('Failed to create scenario', err);
      }
    };
    initializeScenario();
  }, [setScenarioId]);

  const handleRunSimulation = async () => {
    setIsLoading(true);
    try {
      const results = await runSimulation(inputs as ScenarioInputs);
      setOutputs(results);
    } catch (err) {
      console.error('Simulation failed', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyPreset = (presetInputs: Partial<ScenarioInputs>) => {
    setInputs(presetInputs);
  };

  const handleSaveScenario = async () => {
    try {
      await updateScenarioInputs(1, inputs as ScenarioInputs); // TODO: use actual scenarioId
      alert('Scenario saved!');
    } catch (err) {
      console.error('Failed to save scenario', err);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Top Navigation */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900">AlloyOps</h1>
          {isEditingName ? (
            <input
              type="text"
              value={scenarioName}
              onChange={(e) => setScenarioName(e.target.value)}
              onBlur={() => setIsEditingName(false)}
              onKeyDown={(e) => e.key === 'Enter' && setIsEditingName(false)}
              autoFocus
              className="border border-gray-300 rounded px-2 py-1"
            />
          ) : (
            <button
              onClick={() => setIsEditingName(true)}
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              {scenarioName}
            </button>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleSaveScenario}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition"
          >
            ✓ Save Scenario
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition">
            ↗ Duplicate
          </button>
          <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded transition">
            ⚖ Compare
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel: Inputs */}
        <div className="w-80">
          <div className="h-full flex flex-col bg-white border-r border-gray-200">
            <div className="flex-1 overflow-y-auto p-4">
              <PresetSelector onPresetSelect={handleApplyPreset} />
              <InputPanel onRunSimulation={handleRunSimulation} isLoading={isLoading} />
            </div>
          </div>
        </div>

        {/* Center: Charts */}
        <SimulationCharts isLoading={isLoading} />

        {/* Right Panel: Insights */}
        <InsightPanel />
      </div>
    </div>
  );
}
