'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';

const LINKS = [
  {
    title: 'Grafana Dashboard',
    url: 'http://localhost:3100',
    description: 'Metrics & logs visualization (admin/admin)',
  },
  {
    title: 'Prometheus',
    url: 'http://localhost:9090',
    description: 'Raw metrics endpoint',
  },
  {
    title: 'Backend Metrics',
    url: 'http://localhost:3001/metrics',
    description: 'Prometheus text format metrics',
  },
  {
    title: 'Swagger API Docs',
    url: 'http://localhost:3001/api/docs',
    description: 'Interactive API documentation',
  },
];

export function ObsLinks() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Observability Links</CardTitle>
        <CardDescription>Quick access to monitoring tools</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {LINKS.map((link) => (
          <a
            key={link.url}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-muted"
          >
            <ExternalLink className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">{link.title}</p>
              <p className="text-xs text-muted-foreground">{link.description}</p>
            </div>
          </a>
        ))}

        <div className="rounded-lg border p-3">
          <p className="text-sm font-medium mb-1">Loki Query</p>
          <code className="block rounded bg-muted px-2 py-1 text-xs">
            {'{app="backend"}'}
          </code>
          <p className="text-xs text-muted-foreground mt-1">
            Use in Grafana &rarr; Explore &rarr; Loki
          </p>
        </div>

        <div className="rounded-lg border p-3">
          <p className="text-sm font-medium mb-1">Sentry</p>
          <p className="text-xs text-muted-foreground">
            Check your Sentry project dashboard for captured exceptions from
            system_error scenarios.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
