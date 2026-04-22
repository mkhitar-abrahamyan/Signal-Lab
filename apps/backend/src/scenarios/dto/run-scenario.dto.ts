import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum ScenarioType {
  SUCCESS = 'success',
  VALIDATION_ERROR = 'validation_error',
  SYSTEM_ERROR = 'system_error',
  SLOW_REQUEST = 'slow_request',
  TEAPOT = 'teapot',
}

export class RunScenarioDto {
  @ApiProperty({ enum: ScenarioType, description: 'Scenario type to run' })
  @IsEnum(ScenarioType)
  type!: ScenarioType;

  @ApiProperty({ required: false, description: 'Optional scenario name' })
  @IsOptional()
  @IsString()
  name?: string;
}
