import { Controller, Get, Param } from '@nestjs/common';
import { PRESETS, PRESET_METADATA } from './presets.constant';

@Controller('presets')
export class PresetsController {
  @Get()
  async getAllPresets() {
    return Object.entries(PRESETS).map(([key, inputs]) => ({
      id: key,
      ...PRESET_METADATA[key],
      inputs,
    }));
  }

  @Get(':id')
  async getPreset(@Param('id') id: string) {
    const inputs = PRESETS[id];
    const metadata = PRESET_METADATA[id];

    if (!inputs) {
      throw new Error('Preset not found');
    }

    return {
      id,
      ...metadata,
      inputs,
    };
  }
}
