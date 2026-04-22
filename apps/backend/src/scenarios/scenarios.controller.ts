import { Controller, Post, Get, Body, Res, HttpCode } from '@nestjs/common';
import * as express from 'express';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ScenariosService } from './scenarios.service';
import { RunScenarioDto, ScenarioType } from './dto/run-scenario.dto';

@ApiTags('scenarios')
@Controller('scenarios')
export class ScenariosController {
  constructor(private readonly scenariosService: ScenariosService) {}

  @Post('run')
  @HttpCode(200)
  @ApiOperation({ summary: 'Run a scenario' })
  @ApiResponse({ status: 200, description: 'Scenario executed successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 418, description: "I'm a teapot" })
  @ApiResponse({ status: 500, description: 'System error' })
  async run(@Body() dto: RunScenarioDto, @Res() res: express.Response) {
    if (dto.type === ScenarioType.TEAPOT) {
      const result = await this.scenariosService.run(dto);
      return res
        .status(418)
        .json({ signal: 42, message: "I'm a teapot" });
    }
    const result = await this.scenariosService.run(dto);
    return res.status(200).json(result);
  }

  @Get('history')
  @ApiOperation({ summary: 'Get scenario run history' })
  @ApiResponse({ status: 200, description: 'List of recent scenario runs' })
  async history() {
    return this.scenariosService.getHistory(20);
  }
}
