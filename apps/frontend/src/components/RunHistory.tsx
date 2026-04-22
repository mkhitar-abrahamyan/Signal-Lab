'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchHistory } from '@/lib/api';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type ScenarioRun = {
  id: string;
  type: string;
  status: string;
  duration: number | null;
  error: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
};

function getStatusVariant(
  type: string,
  status: string,
): 'default' | 'secondary' | 'destructive' | 'outline' {
  if (status === 'failed') return 'destructive';
  if (status === 'rejected') return 'destructive';
  if (type === 'slow_request') return 'secondary';
  if (type === 'system_error') return 'destructive';
  if (type === 'validation_error') return 'secondary';
  return 'default';
}

function getTypeColor(type: string): string {
  switch (type) {
    case 'success':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'slow_request':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    case 'validation_error':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
    case 'system_error':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    case 'teapot':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
    default:
      return '';
  }
}

export function RunHistory() {
  const { data: runs, isLoading, error } = useQuery<ScenarioRun[]>({
    queryKey: ['runs'],
    queryFn: fetchHistory,
    refetchInterval: 5000,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Run History</CardTitle>
        <CardDescription>Last 20 scenario runs</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && <p className="text-sm text-muted-foreground">Loading...</p>}
        {error && (
          <p className="text-sm text-destructive">
            Failed to load history: {(error as Error).message}
          </p>
        )}
        {runs && runs.length === 0 && (
          <p className="text-sm text-muted-foreground">No runs yet. Try running a scenario!</p>
        )}
        <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto">
          {runs?.map((run) => (
            <div
              key={run.id}
              className="flex items-center justify-between rounded-lg border p-3 text-sm"
            >
              <div className="flex items-center gap-2">
                <Badge className={getTypeColor(run.type)} variant="outline">
                  {run.type === 'teapot' ? `\u2615 ${run.type}` : run.type}
                </Badge>
                <Badge variant={getStatusVariant(run.type, run.status)}>
                  {run.status}
                </Badge>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground text-xs">
                {run.duration !== null && <span>{run.duration}ms</span>}
                <span>{new Date(run.createdAt).toLocaleTimeString()}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
