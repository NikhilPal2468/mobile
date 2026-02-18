/**
 * Run a quick network test: general internet + backend reachability.
 * Use from a "Test network" button to verify emulator/device connectivity.
 */
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001';

export type NetworkTestResult = {
  internet: 'ok' | 'fail';
  internetError?: string;
  backend: 'ok' | 'fail';
  backendError?: string;
  backendUrl: string;
};

export async function runNetworkTest(): Promise<NetworkTestResult> {
  const result: NetworkTestResult = {
    internet: 'fail',
    backend: 'fail',
    backendUrl: API_URL,
  };

  // 1) Test general internet (public URL)
  try {
    const res = await fetch('https://www.google.com/generate_204', { method: 'GET' });
    result.internet = res.status === 204 ? 'ok' : 'fail';
    if (result.internet === 'fail') result.internetError = `HTTP ${res.status}`;
  } catch (e: any) {
    result.internetError = e?.message || String(e);
  }

  // 2) Test backend (your API health endpoint)
  try {
    const res = await fetch(`${API_URL}/health`, {
      method: 'GET',
    });
    const ok = res.ok;
    result.backend = ok ? 'ok' : 'fail';
    if (!ok) result.backendError = `HTTP ${res.status}`;
  } catch (e: any) {
    result.backendError = e?.message || String(e);
  }

  return result;
}

export function formatNetworkTestResult(r: NetworkTestResult): string {
  const lines: string[] = [
    `Backend: ${API_URL}`,
    '',
    `Internet: ${r.internet}${r.internetError ? ` (${r.internetError})` : ''}`,
    `Backend:  ${r.backend}${r.backendError ? ` (${r.backendError})` : ''}`,
  ];
  return lines.join('\n');
}
