'use client';

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useScenarioStore } from '@/store/scenarios';

interface SimulationChartsProps {
  isLoading?: boolean;
}

export function SimulationCharts({ isLoading = false }: SimulationChartsProps) {
  const { outputs } = useScenarioStore();

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Running simulation...</p>
        </div>
      </div>
    );
  }

  if (!outputs) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Run a simulation to see results</p>
          <p className="text-sm text-gray-400">Adjust inputs and click "Run Simulation"</p>
        </div>
      </div>
    );
  }

  // Mock data for charts (in production, this would come from the simulation output)
  const inventoryData = Array.from({ length: 52 }, (_, i) => ({
    week: i + 1,
    inventory: 2000 + Math.sin(i / 10) * 500 + Math.random() * 200,
  }));

  const demandData = Array.from({ length: 52 }, (_, i) => ({
    week: i + 1,
    demand: 5000 + Math.random() * 1000,
    supply: 5000 + Math.random() * 800,
  }));

  const costData = [
    { name: 'Holding', value: outputs.holdingCostTotal || 0 },
    { name: 'Stockout', value: outputs.stockoutCostTotal || 0 },
    { name: 'Ordering', value: outputs.orderingCostTotal || 0 },
  ];

  return (
    <div className="flex-1 bg-white p-6 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-6">Simulation Results</h2>

      {/* Chart 1: Inventory Over Time */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Inventory Over Time</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={inventoryData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip formatter={(value) => value.toFixed(0)} />
            <Legend />
            <Line
              type="monotone"
              dataKey="inventory"
              stroke="#3b82f6"
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Chart 2: Demand vs Supply */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Demand vs Supply</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={demandData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip formatter={(value) => value.toFixed(0)} />
            <Legend />
            <Line
              type="monotone"
              dataKey="demand"
              stroke="#ef4444"
              dot={false}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="supply"
              stroke="#10b981"
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Chart 3: Cost Breakdown */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Cost Breakdown</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={costData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => `$${(value as number).toFixed(2)}`} />
            <Bar dataKey="value" fill="#8b5cf6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
