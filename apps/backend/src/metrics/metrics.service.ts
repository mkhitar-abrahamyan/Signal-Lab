import { Injectable, OnModuleInit } from '@nestjs/common';
import * as client from 'prom-client';

@Injectable()
export class MetricsService implements OnModuleInit {
  private registry = new client.Registry();
  private runsTotal!: client.Counter;
  private runDuration!: client.Histogram;
  private httpRequestsTotal!: client.Counter;

  onModuleInit() {
    client.collectDefaultMetrics({ register: this.registry });

    this.runsTotal = new client.Counter({
      name: 'scenario_runs_total',
      help: 'Total number of scenario runs',
      labelNames: ['type', 'status'],
      registers: [this.registry],
    });

    this.runDuration = new client.Histogram({
      name: 'scenario_run_duration_seconds',
      help: 'Duration of scenario runs in seconds',
      labelNames: ['type'],
      buckets: [0.1, 0.5, 1, 2, 5, 10],
      registers: [this.registry],
    });

    this.httpRequestsTotal = new client.Counter({
      name: 'http_requests_total',
      help: 'Total HTTP requests',
      labelNames: ['method', 'path', 'status_code'],
      registers: [this.registry],
    });
  }

  incrementRuns(type: string, status: string) {
    this.runsTotal.inc({ type, status });
  }

  recordDuration(type: string, seconds: number) {
    this.runDuration.observe({ type }, seconds);
  }

  incrementHttpRequests(method: string, path: string, statusCode: string) {
    this.httpRequestsTotal.inc({ method, path, status_code: statusCode });
  }

  async getMetrics(): Promise<string> {
    return this.registry.metrics();
  }

  getContentType(): string {
    return this.registry.contentType;
  }
}
