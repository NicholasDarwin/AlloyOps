'use client';

import { create } from 'zustand';

export interface ScenarioInputs {
  averageDemand: number;
  demandVariability: number;
  demandTrend: 'Stable' | 'Increasing' | 'Seasonal';
  startingInventory: number;
  reorderPoint: number;
  orderQuantity: number;
  supplierLeadTime: number;
  delayRisk: number;
  unitCost: number;
  holdingCost: number;
  stockoutPenalty: number;
}

export interface SimulationOutput {
  profit: number;
  totalStockouts: number;
  overstockRisk: number;
  holdingCostTotal: number;
  stockoutCostTotal: number;
  orderingCostTotal: number;
}

export interface ScenarioState {
  // Current scenario
  scenarioId: string | null;
  scenarioName: string;
  inputs: Partial<ScenarioInputs>;
  outputs: Partial<SimulationOutput> | null;
  isLoading: boolean;

  // Live data mode
  useLiveData: boolean;
  liveDataSource: 'historical_demand' | 'seasonal_trends' | 'volatile_market';

  // Presets
  presets: any[];

  // Actions
  setInput: (key: keyof ScenarioInputs, value: any) => void;
  setInputs: (inputs: Partial<ScenarioInputs>) => void;
  setScenarioId: (id: string | null) => void;
  setScenarioName: (name: string) => void;
  setOutputs: (outputs: SimulationOutput) => void;
  setIsLoading: (loading: boolean) => void;
  setUseLiveData: (use: boolean) => void;
  setLiveDataSource: (source: 'historical_demand' | 'seasonal_trends' | 'volatile_market') => void;
  setPresets: (presets: any[]) => void;
  resetInputs: () => void;
}

const DEFAULT_INPUTS: ScenarioInputs = {
  averageDemand: 5000,
  demandVariability: 20,
  demandTrend: 'Stable',
  startingInventory: 2000,
  reorderPoint: 500,
  orderQuantity: 1000,
  supplierLeadTime: 14,
  delayRisk: 10,
  unitCost: 50,
  holdingCost: 5,
  stockoutPenalty: 100,
};

export const useScenarioStore = create<ScenarioState>((set) => ({
  scenarioId: null,
  scenarioName: 'Untitled Scenario',
  inputs: DEFAULT_INPUTS,
  outputs: null,
  isLoading: false,
  useLiveData: false,
  liveDataSource: 'historical_demand',
  presets: [],

  setInput: (key, value) =>
    set((state) => ({
      inputs: { ...state.inputs, [key]: value },
    })),

  setInputs: (inputs) =>
    set((state) => ({
      inputs: { ...state.inputs, ...inputs },
    })),

  setScenarioId: (id) => set({ scenarioId: id }),

  setScenarioName: (name) => set({ scenarioName: name }),

  setOutputs: (outputs) => set({ outputs }),

  setIsLoading: (loading) => set({ isLoading: loading }),

  setUseLiveData: (use) => set({ useLiveData: use }),

  setLiveDataSource: (source) => set({ liveDataSource: source }),

  setPresets: (presets) => set({ presets }),

  resetInputs: () => set({ inputs: DEFAULT_INPUTS, outputs: null }),
}));
