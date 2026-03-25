import { ScenarioInputs } from '../simulation/inventory.service';

export const PRESETS: Record<string, ScenarioInputs> = {
  HIGH_DEMAND_SURGE: {
    averageDemand: 8000,
    demandVariability: 40,
    demandTrend: 'Increasing',
    startingInventory: 1500,
    reorderPoint: 1000,
    orderQuantity: 2000,
    supplierLeadTime: 14,
    delayRisk: 5,
    unitCost: 50,
    holdingCost: 5,
    stockoutPenalty: 150,
  },
  SUPPLIER_DELAY: {
    averageDemand: 4000,
    demandVariability: 20,
    demandTrend: 'Stable',
    startingInventory: 3000,
    reorderPoint: 800,
    orderQuantity: 1500,
    supplierLeadTime: 30,
    delayRisk: 40,
    unitCost: 50,
    holdingCost: 5,
    stockoutPenalty: 100,
  },
  OVERSTOCK_RISK: {
    averageDemand: 3000,
    demandVariability: 10,
    demandTrend: 'Stable',
    startingInventory: 4000,
    reorderPoint: 600,
    orderQuantity: 1200,
    supplierLeadTime: 7,
    delayRisk: 2,
    unitCost: 50,
    holdingCost: 8,
    stockoutPenalty: 100,
  },
  COST_INCREASE: {
    averageDemand: 5000,
    demandVariability: 25,
    demandTrend: 'Stable',
    startingInventory: 2000,
    reorderPoint: 700,
    orderQuantity: 1000,
    supplierLeadTime: 14,
    delayRisk: 15,
    unitCost: 65,
    holdingCost: 7,
    stockoutPenalty: 120,
  },
};

export const PRESET_METADATA: Record<
  string,
  { title: string; description: string; icon: string }
> = {
  HIGH_DEMAND_SURGE: {
    title: 'High Demand Surge',
    description: 'Expect 60% higher demand with high volatility',
    icon: '📈',
  },
  SUPPLIER_DELAY: {
    title: 'Supplier Delay',
    description: 'Extended lead times with 40% delay risk',
    icon: '⏱️',
  },
  OVERSTOCK_RISK: {
    title: 'Overstock Risk',
    description: 'Low demand with excess inventory',
    icon: '📦',
  },
  COST_INCREASE: {
    title: 'Cost Increase',
    description: '30% unit cost increase, margin pressure',
    icon: '💰',
  },
};
