import {
  Injectable,
  Logger,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MetricsService } from '../metrics/metrics.service';
import { RunScenarioDto, ScenarioType } from './dto/run-scenario.dto';
import * as Sentry from '@sentry/node';

@Injectable()
export class ScenariosService {
  private readonly logger = new Logger(ScenariosService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly metrics: MetricsService,
  ) {}

  async run(dto: RunScenarioDto) {
    const start = Date.now();

    switch (dto.type) {
      case ScenarioType.SUCCESS: {
        const duration = Date.now() - start;
        const run = await this.prisma.scenarioRun.create({
          data: { type: dto.type, status: 'completed', duration },
        });
        this.metrics.incrementRuns(dto.type, 'completed');
        this.metrics.recordDuration(dto.type, duration / 1000);
        this.logger.log(
          JSON.stringify({
            message: 'scenario completed',
            scenarioType: dto.type,
            scenarioId: run.id,
            duration,
            level: 'info',
          }),
        );
        return { id: run.id, status: 'completed', duration };
      }

      case ScenarioType.VALIDATION_ERROR: {
        this.metrics.incrementRuns(dto.type, 'rejected');
        this.logger.warn(
          JSON.stringify({
            message: 'scenario validation error',
            scenarioType: dto.type,
            level: 'warn',
          }),
        );
        Sentry.addBreadcrumb({
          message: 'validation_error scenario triggered',
        });
        await this.prisma.scenarioRun.create({
          data: {
            type: dto.type,
            status: 'rejected',
            error: 'Validation failed: invalid scenario input',
          },
        });
        throw new BadRequestException(
          'Validation failed: invalid scenario input',
        );
      }

      case ScenarioType.SYSTEM_ERROR: {
        await this.prisma.scenarioRun.create({
          data: {
            type: dto.type,
            status: 'failed',
            error: 'Unhandled system error',
          },
        });
        this.metrics.incrementRuns(dto.type, 'failed');
        this.logger.error(
          JSON.stringify({
            message: 'system error scenario triggered',
            scenarioType: dto.type,
            level: 'error',
          }),
        );
        Sentry.captureException(
          new Error('Signal Lab: system_error scenario triggered'),
        );
        throw new InternalServerErrorException('System error occurred');
      }

      case ScenarioType.SLOW_REQUEST: {
        const delay = Math.floor(Math.random() * 3000) + 2000;
        await new Promise((resolve) => setTimeout(resolve, delay));
        const duration = Date.now() - start;
        const run = await this.prisma.scenarioRun.create({
          data: { type: dto.type, status: 'completed', duration },
        });
        this.metrics.incrementRuns(dto.type, 'completed');
        this.metrics.recordDuration(dto.type, duration / 1000);
        this.logger.warn(
          JSON.stringify({
            message: 'slow request scenario completed',
            scenarioType: dto.type,
            scenarioId: run.id,
            duration,
            level: 'warn',
          }),
        );
        return { id: run.id, status: 'completed', duration };
      }

      case ScenarioType.TEAPOT: {
        const run = await this.prisma.scenarioRun.create({
          data: {
            type: dto.type,
            status: 'completed',
            metadata: { easter: true },
          },
        });
        this.metrics.incrementRuns(dto.type, 'completed');
        this.logger.log(
          JSON.stringify({
            message: 'teapot scenario triggered',
            scenarioType: dto.type,
            scenarioId: run.id,
            level: 'info',
          }),
        );
        return { signal: 42, message: "I'm a teapot", easter: true };
      }
    }
  }

  async getHistory(limit: number = 20) {
    return this.prisma.scenarioRun.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }
}
