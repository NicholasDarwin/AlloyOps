import { Injectable } from '@nestjs/common';

export interface ScenarioInputs {
  averageDemand: number;
  demandVariability: number; // 0-100 %
  demandTrend: 'Stable' | 'Increasing' | 'Seasonal';
  startingInventory: number;
  reorderPoint: number;
  orderQuantity: number;
  supplierLeadTime: number; // days
  delayRisk: number; // 0-100 %
  unitCost: number;
  holdingCost: number;
  stockoutPenalty: number;
}

export interface WeeklyMetric {
  week: number;
  demand: number;
  inventoryStart: number;
  orderedQuantity: number;
  orderedDay: number;
  inventoryEnd: number;
  stockout: number;
  holdingCost: number;
  stockoutCost: number;
}

export interface SimulationOutput {
  profit: number;
  totalStockouts: number;
  overstockRisk: number;
  holdingCostTotal: number;
  stockoutCostTotal: number;
  orderingCostTotal: number;
  weeklyMetrics: WeeklyMetric[];
}

@Injectable()
export class InventoryService {
  /**
   * Run a complete 52-week inventory simulation
   */
  runSimulation(inputs: ScenarioInputs, seed = 0): SimulationOutput {
    const WEEKS = 52;
    const ORDER_COST = 25; // Fixed cost per order
    const LEAD_TIME_HOURS = inputs.supplierLeadTime * 24;

    // Initialize state
    let currentInventory = inputs.startingInventory;
    let pendingOrders: { arrival: number; quantity: number }[] = [];
    let totalHoldingCost = 0;
    let totalStockoutCost = 0;
    let orderCount = 0;
    let totalStockouts = 0;
    let overstockCount = 0;
    const weeklyMetrics: WeeklyMetric[] = [];

    // Seeded random number generator
    let randomSeed = seed || 12345;
    const random = () => {
      randomSeed = (randomSeed * 9301 + 49297) % 233280;
      return randomSeed / 233280;
    };

    // Simulation loop
    for (let week = 1; week <= WEEKS; week++) {
      const metricsForWeek: WeeklyMetric = {
        week,
        demand: 0,
        inventoryStart: currentInventory,
        orderedQuantity: 0,
        orderedDay: 0,
        inventoryEnd: 0,
        stockout: 0,
        holdingCost: 0,
        stockoutCost: 0,
      };

      // 1. Generate demand
      const demand = this.generateDemand(
        inputs.averageDemand,
        inputs.demandVariability,
        inputs.demandTrend,
        week,
        WEEKS,
        random,
      );
      metricsForWeek.demand = demand;

      // 2. Process pending orders (check if they arrive this week)
      const arrivingOrders = pendingOrders.filter((o) => o.arrival <= week);
      const remainingOrders = pendingOrders.filter((o) => o.arrival > week);

      arrivingOrders.forEach((order) => {
        currentInventory += order.quantity;
      });
      pendingOrders = remainingOrders;

      // 3. Meet demand from inventory
      let unmetDemand = 0;
      if (currentInventory >= demand) {
        currentInventory -= demand;
      } else {
        unmetDemand = demand - currentInventory;
        totalStockouts += unmetDemand;
        metricsForWeek.stockout = unmetDemand;
        currentInventory = 0;
      }

      // 4. Reorder logic: if inventory <= reorder point, place order
      if (currentInventory <= inputs.reorderPoint) {
        let willArrive = week + Math.ceil(inputs.supplierLeadTime / 7);

        // Apply delay risk
        if (random() < inputs.delayRisk / 100) {
          willArrive += Math.ceil(random() * 2); // delay 0-2 weeks
        }

        pendingOrders.push({
          arrival: willArrive,
          quantity: inputs.orderQuantity,
        });
        orderCount++;
        metricsForWeek.orderedQuantity = inputs.orderQuantity;
        metricsForWeek.orderedDay = week;
      }

      // 5. Calculate costs
      const weekHoldingCost = currentInventory * inputs.holdingCost;
      const weekStockoutCost = unmetDemand * inputs.stockoutPenalty;

      totalHoldingCost += weekHoldingCost;
      totalStockoutCost += weekStockoutCost;

      metricsForWeek.holdingCost = weekHoldingCost;
      metricsForWeek.stockoutCost = weekStockoutCost;
      metricsForWeek.inventoryEnd = currentInventory;

      // Track overstock risk (inventory > reorder point * 1.5)
      if (currentInventory > inputs.reorderPoint * 1.5) {
        overstockCount++;
      }

      weeklyMetrics.push(metricsForWeek);
    }

    // Calculate profit
    const orderingCostTotal = orderCount * ORDER_COST;
    const totalRevenue = weeklyMetrics.reduce((sum, m) => {
      const satisfiedDemand = m.demand - m.stockout;
      return sum + satisfiedDemand * inputs.unitCost * 1.3; // 30% markup
    }, 0);

    const profit =
      totalRevenue - totalHoldingCost - totalStockoutCost - orderingCostTotal;

    const overstockRisk = (overstockCount / WEEKS) * 100;

    return {
      profit,
      totalStockouts,
      overstockRisk,
      holdingCostTotal: totalHoldingCost,
      stockoutCostTotal: totalStockoutCost,
      orderingCostTotal,
      weeklyMetrics,
    };
  }

  /**
   * Generate weekly demand based on trend and variability
   */
  private generateDemand(
    average: number,
    variability: number,
    trend: string,
    week: number,
    totalWeeks: number,
    random: () => number,
  ): number {
    // Base variability
    const variation = (random() - 0.5) * 2 * (variability / 100) * average;

    // Apply trend
    let trendMultiplier = 1.0;
    if (trend === 'Increasing') {
      trendMultiplier = 1.0 + (week / totalWeeks) * 0.3; // +30% over year
    } else if (trend === 'Seasonal') {
      // Seasonal: peaks at weeks 13, 39 (Q2, Q4)
      const seasonalFactor = Math.sin(((week - 1) / totalWeeks) * Math.PI * 2);
      trendMultiplier = 1.0 + seasonalFactor * 0.25;
    }

    const demand = average * trendMultiplier + variation;
    return Math.max(0, Math.round(demand));
  }
}
