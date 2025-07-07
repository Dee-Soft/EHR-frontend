import api from '../api';

export async function fetchBackendPublicKey(): Promise<string> {
  const response = await api.get('/key-exchange/backend');
  return response.data.publicKey;
}

export async function sendFrontendPublicKey(frontendPublicKey: string): Promise<void> {
  await api.post('/key-exchange/frontend', { publicKey: frontendPublicKey });
}