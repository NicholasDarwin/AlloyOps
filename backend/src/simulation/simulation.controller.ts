import { Controller, Post, Get, Query, Body } from '@nestjs/common';
import { InventoryService, ScenarioInputs } from './inventory.service';
import { LiveDataService } from './live-data.service';

@Controller('simulation')
export class SimulationController {
  constructor(
    private inventoryService: InventoryService,
    private liveDataService: LiveDataService,
  ) {}

  @Post('run')
  async runSimulation(@Body() inputs: ScenarioInputs) {
    return this.inventoryService.runSimulation(inputs);
  }

  @Get('external-data')
  async getExternalData(
    @Query('source')
    source: 'historical_demand' | 'seasonal_trends' | 'volatile_market' = 'historical_demand',
  ) {
    return this.liveDataService.generateExternalDemandData(source);
  }
}
