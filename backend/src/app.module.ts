import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InventoryService } from './simulation/inventory.service';
import { SimulationController } from './simulation/simulation.controller';
import { LiveDataService } from './simulation/live-data.service';
import { ScenariosService } from './scenarios/scenarios.service';
import { ScenariosController } from './scenarios/scenarios.controller';
import { PresetsController } from './presets/presets.controller';

@Module({
  imports: [],
  controllers: [
    AppController,
    SimulationController,
    ScenariosController,
    PresetsController,
  ],
  providers: [AppService, InventoryService, LiveDataService, ScenariosService],
})
export class AppModule {}
