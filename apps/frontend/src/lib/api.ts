const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function runScenario(data: { type: string; name?: string }) {
  const res = await fetch(`${API_URL}/api/scenarios/run`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const body = await res.json();

  if (!res.ok && res.status !== 418) {
    throw new Error(body.message || 'Request failed');
  }

  return { ...body, statusCode: res.status };
}

export async function fetchHistory() {
  const res = await fetch(`${API_URL}/api/scenarios/history`);
  if (!res.ok) throw new Error('Failed to fetch history');
  return res.json();
}

export async function fetchHealth() {
  const res = await fetch(`${API_URL}/api/health`);
  if (!res.ok) throw new Error('Health check failed');
  return res.json();
}
