'use client';

import { useScenarioStore } from '@/store/scenarios';

interface InsightPanelProps {}

export function InsightPanel({}: InsightPanelProps) {
  const { outputs, inputs, setInput } = useScenarioStore();

  if (!outputs) {
    return (
      <div className="w-80 border-l border-gray-200 bg-white overflow-y-auto p-4">
        <h2 className="text-lg font-semibold mb-4">Key Insights</h2>
        <p className="text-sm text-gray-500">Run a simulation to see insights</p>
      </div>
    );
  }

  // Determine stockout risk color and level
  const stockoutRiskColor = outputs.totalStockouts > 5 ? 'red' : outputs.totalStockouts > 0 ? 'yellow' : 'green';
  const stockoutRiskLabel = outputs.totalStockouts > 5 ? 'High' : outputs.totalStockouts > 0 ? 'Medium' : 'Low';

  // Determine recommendations
  const recommendations: string[] = [];
  if (outputs.totalStockouts && outputs.totalStockouts > 5) {
    recommendations.push('Increase reorder point to reduce stockouts');
  }
  if (outputs.holdingCostTotal && outputs.holdingCostTotal > (outputs.orderingCostTotal || 0) * 2) {
    recommendations.push('Reduce order quantity to cut holding costs');
  }
  if (outputs.overstockRisk && outputs.overstockRisk > 30) {
    recommendations.push('Review demand forecast accuracy');
  }

  const colorClasses = {
    red: 'bg-red-50 border-red-200 text-red-900',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-900',
    green: 'bg-green-50 border-green-200 text-green-900',
  };

  return (
    <div className="w-80 border-l border-gray-200 bg-white overflow-y-auto p-4">
      <h2 className="text-lg font-semibold mb-4">Key Insights</h2>

      {/* Insight Card 1: Stockout Risk */}
      <div
        className={`p-4 border rounded-lg mb-4 ${colorClasses[stockoutRiskColor as keyof typeof colorClasses]}`}
      >
        <p className="text-xs font-semibold uppercase opacity-75 mb-1">Stockout Risk</p>
        <p className="text-2xl font-bold">
          {outputs.totalStockouts?.toFixed(0)} {stockoutRiskLabel}
        </p>
        <p className="text-xs mt-2 opacity-75">units</p>
      </div>

      {/* Insight Card 2: Profit */}
      <div className="p-4 border border-green-200 rounded-lg bg-green-50 text-green-900 mb-4">
        <p className="text-xs font-semibold uppercase opacity-75 mb-1">Estimated Profit</p>
        <p className="text-2xl font-bold">${(outputs.profit || 0).toFixed(0)}</p>
        <p className="text-xs mt-2 opacity-75">for 52 weeks</p>
      </div>

      {/* Insight Card 3: Overstock Risk */}
      <div className="p-4 border border-blue-200 rounded-lg bg-blue-50 text-blue-900 mb-4">
        <p className="text-xs font-semibold uppercase opacity-75 mb-1">Overstock Risk</p>
        <p className="text-2xl font-bold">{(outputs.overstockRisk || 0).toFixed(0)}%</p>
        <p className="text-xs mt-2 opacity-75">of weeks</p>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <h3 className="text-sm font-semibold text-amber-900 mb-3">Recommendations</h3>
          <ul className="space-y-2">
            {recommendations.map((rec, idx) => (
              <li key={idx} className="text-xs text-amber-900">
                <span className="inline-block w-4 h-4 mr-2">•</span>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
