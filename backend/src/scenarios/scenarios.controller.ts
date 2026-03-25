import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ScenariosService } from './scenarios.service';
import { ScenarioInputs } from '../simulation/inventory.service';

const HARDCODED_USER_ID = 1; // MVP: single user

@Controller('scenarios')
export class ScenariosController {
  constructor(private scenariosService: ScenariosService) {}

  @Post()
  async createScenario(@Body() body: { name: string }) {
    return this.scenariosService.createScenario(HARDCODED_USER_ID, body.name);
  }

  @Get()
  async getScenarios() {
    return this.scenariosService.getScenarios(HARDCODED_USER_ID);
  }

  @Get(':id')
  async getScenario(@Param('id', ParseIntPipe) id: number) {
    return this.scenariosService.getScenarioById(id, HARDCODED_USER_ID);
  }

  @Put(':id/inputs')
  async updateInputs(
    @Param('id', ParseIntPipe) id: number,
    @Body() inputs: Partial<ScenarioInputs>,
  ) {
    return this.scenariosService.updateScenarioInputs(
      id,
      HARDCODED_USER_ID,
      inputs,
    );
  }

  @Put(':id/name')
  async updateName(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { name: string },
  ) {
    return this.scenariosService.updateScenarioName(
      id,
      HARDCODED_USER_ID,
      body.name,
    );
  }

  @Post(':id/duplicate')
  async duplicateScenario(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { newName: string },
  ) {
    return this.scenariosService.duplicateScenario(
      id,
      HARDCODED_USER_ID,
      body.newName,
    );
  }

  @Delete(':id')
  async deleteScenario(@Param('id', ParseIntPipe) id: number) {
    return this.scenariosService.deleteScenario(id, HARDCODED_USER_ID);
  }

  @Post(':id/save-version')
  async saveVersion(@Param('id', ParseIntPipe) id: number) {
    return this.scenariosService.saveVersion(id, HARDCODED_USER_ID);
  }

  @Get(':id/versions')
  async getVersions(@Param('id', ParseIntPipe) id: number) {
    return this.scenariosService.getScenarioVersions(id, HARDCODED_USER_ID);
  }

  @Post(':id/restore-version/:versionId')
  async restoreVersion(
    @Param('id', ParseIntPipe) id: number,
    @Param('versionId', ParseIntPipe) versionId: number,
  ) {
    return this.scenariosService.restoreVersion(
      id,
      HARDCODED_USER_ID,
      versionId,
    );
  }
}
