'use client';

import { useScenarioStore, ScenarioInputs } from '@/store/scenarios';

interface InputPanelProps {
  onRunSimulation: () => void;
  isLoading?: boolean;
}

export function InputPanel({ onRunSimulation, isLoading = false }: InputPanelProps) {
  const { inputs, setInput, resetInputs } = useScenarioStore();

  const handleSliderChange = (key: keyof ScenarioInputs, value: string) => {
    setInput(key, parseFloat(value));
  };

  const handleInputChange = (key: keyof ScenarioInputs, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setInput(key, numValue);
    }
  };

  return (
    <div className="w-80 border-r border-gray-200 bg-white overflow-y-auto p-4">
      <h2 className="text-lg font-semibold mb-4">Scenario Inputs</h2>

      {/* Demand Section */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Demand</h3>

        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-600 mb-2">
            Average Demand: {inputs.averageDemand?.toLocaleString()} units
          </label>
          <input
            type="range"
            min="500"
            max="10000"
            step="100"
            value={inputs.averageDemand || 5000}
            onChange={(e) => handleSliderChange('averageDemand', e.target.value)}
            className="w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-600 mb-2">
            Demand Variability: {inputs.demandVariability?.toFixed(0)}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={inputs.demandVariability || 20}
            onChange={(e) => handleSliderChange('demandVariability', e.target.value)}
            className="w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-600 mb-2">
            Demand Trend
          </label>
          <select
            value={inputs.demandTrend || 'Stable'}
            onChange={(e) => setInput('demandTrend', e.target.value as any)}
            className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
          >
            <option>Stable</option>
            <option>Increasing</option>
            <option>Seasonal</option>
          </select>
        </div>
      </div>

      {/* Inventory Section */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Inventory</h3>

        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-600 mb-2">
            Starting Inventory: {inputs.startingInventory?.toLocaleString()} units
          </label>
          <input
            type="range"
            min="500"
            max="5000"
            step="100"
            value={inputs.startingInventory || 2000}
            onChange={(e) => handleSliderChange('startingInventory', e.target.value)}
            className="w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-600 mb-2">
            Reorder Point: {inputs.reorderPoint?.toLocaleString()} units
          </label>
          <input
            type="range"
            min="100"
            max="2000"
            step="50"
            value={inputs.reorderPoint || 500}
            onChange={(e) => handleSliderChange('reorderPoint', e.target.value)}
            className="w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-600 mb-2">
            Order Quantity: {inputs.orderQuantity?.toLocaleString()} units
          </label>
          <input
            type="range"
            min="100"
            max="5000"
            step="100"
            value={inputs.orderQuantity || 1000}
            onChange={(e) => handleSliderChange('orderQuantity', e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      {/* Supply Section */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Supply</h3>

        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-600 mb-2">
            Supplier Lead Time: {inputs.supplierLeadTime?.toFixed(0)} days
          </label>
          <input
            type="range"
            min="1"
            max="60"
            step="1"
            value={inputs.supplierLeadTime || 14}
            onChange={(e) => handleSliderChange('supplierLeadTime', e.target.value)}
            className="w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-600 mb-2">
            Delay Risk: {inputs.delayRisk?.toFixed(0)}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={inputs.delayRisk || 10}
            onChange={(e) => handleSliderChange('delayRisk', e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      {/* Costs Section */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Costs</h3>

        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-600 mb-2">
            Unit Cost: ${inputs.unitCost?.toFixed(2) || '0.00'}
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={inputs.unitCost || 50}
            onChange={(e) => handleInputChange('unitCost', e.target.value)}
            className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
          />
        </div>

        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-600 mb-2">
            Holding Cost: ${inputs.holdingCost?.toFixed(2) || '0.00'}/unit/period
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={inputs.holdingCost || 5}
            onChange={(e) => handleInputChange('holdingCost', e.target.value)}
            className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
          />
        </div>

        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-600 mb-2">
            Stockout Penalty: ${inputs.stockoutPenalty?.toFixed(2) || '0.00'}/unit
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={inputs.stockoutPenalty || 100}
            onChange={(e) => handleInputChange('stockoutPenalty', e.target.value)}
            className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="space-y-2 sticky bottom-0 bg-white pt-4">
        <button
          onClick={onRunSimulation}
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 rounded transition"
        >
          {isLoading ? 'Running...' : 'Run Simulation'}
        </button>
        <button
          onClick={resetInputs}
          disabled={isLoading}
          className="w-full bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 text-gray-800 font-semibold py-2 rounded transition"
        >
          Reset Inputs
        </button>
      </div>
    </div>
  );
}
