import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString =
  process.env.DATABASE_URL ??
  'postgresql://signal:signal@localhost:5432/signal_lab';

const adapter = new PrismaPg(connectionString);

const prisma = new PrismaClient({ adapter });

async function main() {
  const count = await prisma.scenarioRun.count();
  if (count > 0) {
    console.log(`Database already has ${count} runs — skipping seed`);
    return;
  }

  const runs = [
    { type: 'success', status: 'completed', duration: 12 },
    { type: 'success', status: 'completed', duration: 45 },
    { type: 'success', status: 'completed', duration: 8 },
    { type: 'validation_error', status: 'rejected', error: 'Validation failed: invalid scenario input' },
    { type: 'system_error', status: 'failed', error: 'Unhandled system error' },
    { type: 'slow_request', status: 'completed', duration: 3200 },
    { type: 'slow_request', status: 'completed', duration: 4100 },
    { type: 'teapot', status: 'completed', metadata: { easter: true } },
  ];

  for (const run of runs) {
    await prisma.scenarioRun.create({ data: run });
  }

  console.log(`Seeded ${runs.length} scenario runs`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
