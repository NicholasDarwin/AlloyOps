import { Injectable } from '@nestjs/common';

export interface ExternalDemandData {
  week: number;
  demand: number;
}

@Injectable()
export class LiveDataService {
  /**
   * Simulate external demand data (e.g., historical trends)
   * In production, this would fetch from a real API
   */
  generateExternalDemandData(
    source: 'historical_demand' | 'seasonal_trends' | 'volatile_market',
  ): ExternalDemandData[] {
    const WEEKS = 52;
    const data: ExternalDemandData[] = [];

    for (let week = 1; week <= WEEKS; week++) {
      let demand = 0;

      if (source === 'historical_demand') {
        // Slight upward trend with normal variation
        demand = 4500 + week * 8 + (Math.random() - 0.5) * 800;
      } else if (source === 'seasonal_trends') {
        // Strong seasonal pattern (peaks in Q2 and Q4)
        const seasonalFactor = Math.sin(((week - 1) / WEEKS) * Math.PI * 2);
        demand = 5000 + seasonalFactor * 1500 + (Math.random() - 0.5) * 600;
      } else if (source === 'volatile_market') {
        // High volatility with occasional spikes
        const trend = 5000 + (Math.random() - 0.5) * 2000;
        if (Math.random() < 0.1) {
          // 10% chance of spike
          demand = trend * (1 + (Math.random() * 0.5 + 0.3));
        } else {
          demand = trend;
        }
      }

      data.push({
        week,
        demand: Math.max(1000, Math.round(demand)),
      });
    }

    return data;
  }

  /**
   * Run a simulation with external demand data
   */
  runSimulationWithExternalData(
    baseInputs: any,
    externalData: ExternalDemandData[],
  ) {
    // This is a placeholder; actual implementation would modify the simulation
    // to use the external demand data instead of the user's average demand
    return {
      message: 'External data simulation (feature in development)',
    };
  }
}
