import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { InventoryService, ScenarioInputs } from '../simulation/inventory.service';

@Injectable()
export class ScenariosService {
  private prisma = new PrismaClient();

  constructor(private inventoryService: InventoryService) {}

  async createScenario(userId: number, name: string) {
    const defaultInputs: ScenarioInputs = {
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

    const scenario = await this.prisma.scenario.create({
      data: {
        userId,
        name,
        inputs: {
          create: defaultInputs,
        },
      },
      include: {
        inputs: true,
      },
    });

    // Run initial simulation
    const outputs = this.inventoryService.runSimulation(
      defaultInputs,
      scenario.id,
    );
    await this.prisma.simulationOutputs.create({
      data: {
        scenarioId: scenario.id,
        ...outputs,
        weeklyMetrics: undefined, // Don't store metrics for now
      },
    });

    return scenario;
  }

  async getScenarios(userId: number) {
    return this.prisma.scenario.findMany({
      where: { userId },
      include: {
        inputs: true,
        outputs: true,
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async getScenarioById(scenarioId: number, userId: number) {
    return this.prisma.scenario.findFirst({
      where: { id: scenarioId, userId },
      include: {
        inputs: true,
        outputs: true,
        versions: {
          orderBy: { versionNumber: 'desc' },
        },
      },
    });
  }

  async updateScenarioInputs(
    scenarioId: number,
    userId: number,
    inputs: Partial<ScenarioInputs>,
  ) {
    // Verify ownership
    const scenario = await this.prisma.scenario.findFirst({
      where: { id: scenarioId, userId },
    });

    if (!scenario) throw new Error('Scenario not found');

    // Update inputs
    const updatedInputs = await this.prisma.scenarioInputs.update({
      where: { scenarioId },
      data: inputs,
    });

    // Re-run simulation
    const fullInputs = await this.prisma.scenarioInputs.findUnique({
      where: { scenarioId },
    });

    const outputs = this.inventoryService.runSimulation(
      fullInputs as ScenarioInputs,
      scenarioId,
    );
    await this.prisma.simulationOutputs.update({
      where: { scenarioId },
      data: {
        ...outputs,
        updatedAt: new Date(),
      },
    });

    // Update scenario's updatedAt
    await this.prisma.scenario.update({
      where: { id: scenarioId },
      data: { updatedAt: new Date() },
    });

    return this.getScenarioById(scenarioId, userId);
  }

  async updateScenarioName(scenarioId: number, userId: number, name: string) {
    const scenario = await this.prisma.scenario.findFirst({
      where: { id: scenarioId, userId },
    });

    if (!scenario) throw new Error('Scenario not found');

    return this.prisma.scenario.update({
      where: { id: scenarioId },
      data: { name, updatedAt: new Date() },
    });
  }

  async duplicateScenario(scenarioId: number, userId: number, newName: string) {
    const original = await this.getScenarioById(scenarioId, userId);
    if (!original) throw new Error('Scenario not found');

    return this.createScenario(userId, newName);
  }

  async deleteScenario(scenarioId: number, userId: number) {
    const scenario = await this.prisma.scenario.findFirst({
      where: { id: scenarioId, userId },
    });

    if (!scenario) throw new Error('Scenario not found');

    return this.prisma.scenario.delete({
      where: { id: scenarioId },
    });
  }

  async saveVersion(scenarioId: number, userId: number) {
    const scenario = await this.getScenarioById(scenarioId, userId);
    if (!scenario) throw new Error('Scenario not found');

    const versionCount = await this.prisma.scenarioVersion.count({
      where: { scenarioId },
    });

    return this.prisma.scenarioVersion.create({
      data: {
        scenarioId,
        versionNumber: versionCount + 1,
        snapshotInputs: scenario.inputs as any,
        snapshotOutputs: scenario.outputs as any,
      },
    });
  }

  async getScenarioVersions(scenarioId: number, userId: number) {
    const scenario = await this.prisma.scenario.findFirst({
      where: { id: scenarioId, userId },
    });

    if (!scenario) throw new Error('Scenario not found');

    return this.prisma.scenarioVersion.findMany({
      where: { scenarioId },
      orderBy: { versionNumber: 'desc' },
    });
  }

  async restoreVersion(scenarioId: number, userId: number, versionId: number) {
    const scenario = await this.prisma.scenario.findFirst({
      where: { id: scenarioId, userId },
    });

    if (!scenario) throw new Error('Scenario not found');

    const version = await this.prisma.scenarioVersion.findFirst({
      where: { id: versionId, scenarioId },
    });

    if (!version) throw new Error('Version not found');

    const snapshotInputs = version.snapshotInputs as ScenarioInputs;

    // Restore inputs
    await this.prisma.scenarioInputs.update({
      where: { scenarioId },
      data: snapshotInputs,
    });

    // Restore outputs
    const snapshotOutputs = version.snapshotOutputs as any;
    await this.prisma.simulationOutputs.update({
      where: { scenarioId },
      data: {
        ...snapshotOutputs,
        updatedAt: new Date(),
      },
    });

    return this.getScenarioById(scenarioId, userId);
  }
}
