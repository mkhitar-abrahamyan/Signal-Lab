import { ScenarioForm } from '@/components/ScenarioForm';
import { RunHistory } from '@/components/RunHistory';
import { ObsLinks } from '@/components/ObsLinks';

export default function Home() {
  return (
    <div className="flex flex-col flex-1 bg-background">
      <header className="border-b px-6 py-4">
        <h1 className="text-2xl font-bold tracking-tight">Signal Lab</h1>
        <p className="text-sm text-muted-foreground">
          Observability playground &mdash; run scenarios, watch metrics, logs &amp; errors
        </p>
      </header>
      <main className="flex-1 p-6">
        <div className="grid gap-6 md:grid-cols-3">
          <ScenarioForm />
          <RunHistory />
          <ObsLinks />
        </div>
      </main>
    </div>
  );
}
