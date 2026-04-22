import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './health/health.module';
import { ScenariosModule } from './scenarios/scenarios.module';
import { MetricsModule } from './metrics/metrics.module';

@Module({
  imports: [
    CommonModule,
    PrismaModule,
    MetricsModule,
    HealthModule,
    ScenariosModule,
  ],
})
export class AppModule {}
