const API_BASE = 'http://localhost:3001';

export async function runSimulation(inputs: any) {
  const res = await fetch(`${API_BASE}/simulation/run`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(inputs),
  });
  if (!res.ok) throw new Error('Simulation failed');
  return res.json();
}

export async function getPresets() {
  const res = await fetch(`${API_BASE}/presets`);
  if (!res.ok) throw new Error('Failed to fetch presets');
  return res.json();
}

export async function getExternalData(source: string) {
  const res = await fetch(`${API_BASE}/simulation/external-data?source=${source}`);
  if (!res.ok) throw new Error('Failed to fetch external data');
  return res.json();
}

export async function createScenario(name: string) {
  const res = await fetch(`${API_BASE}/scenarios`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error('Failed to create scenario');
  return res.json();
}

export async function getScenarios() {
  const res = await fetch(`${API_BASE}/scenarios`);
  if (!res.ok) throw new Error('Failed to fetch scenarios');
  return res.json();
}

export async function getScenario(id: number) {
  const res = await fetch(`${API_BASE}/scenarios/${id}`);
  if (!res.ok) throw new Error('Failed to fetch scenario');
  return res.json();
}

export async function updateScenarioInputs(id: number, inputs: any) {
  const res = await fetch(`${API_BASE}/scenarios/${id}/inputs`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(inputs),
  });
  if (!res.ok) throw new Error('Failed to update inputs');
  return res.json();
}

export async function updateScenarioName(id: number, name: string) {
  const res = await fetch(`${API_BASE}/scenarios/${id}/name`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error('Failed to update name');
  return res.json();
}

export async function duplicateScenario(id: number, newName: string) {
  const res = await fetch(`${API_BASE}/scenarios/${id}/duplicate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ newName }),
  });
  if (!res.ok) throw new Error('Failed to duplicate scenario');
  return res.json();
}

export async function deleteScenario(id: number) {
  const res = await fetch(`${API_BASE}/scenarios/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete scenario');
  return res.json();
}

export async function saveScenarioVersion(id: number) {
  const res = await fetch(`${API_BASE}/scenarios/${id}/save-version`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Failed to save version');
  return res.json();
}

export async function getScenarioVersions(id: number) {
  const res = await fetch(`${API_BASE}/scenarios/${id}/versions`);
  if (!res.ok) throw new Error('Failed to fetch versions');
  return res.json();
}

export async function restoreScenarioVersion(id: number, versionId: number) {
  const res = await fetch(`${API_BASE}/scenarios/${id}/restore-version/${versionId}`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Failed to restore version');
  return res.json();
}
