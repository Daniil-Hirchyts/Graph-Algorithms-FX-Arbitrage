import { fetchJson } from './client';
import {
  GenerationResponseSchema,
  type GenerationResponse,
  type GenerationRequest,
} from '@/lib/schemas';
import { z } from 'zod';

export async function generateSnapshot(
  apiBaseUrl: string,
  payload?: Partial<GenerationRequest>
): Promise<GenerationResponse> {
  const data = await fetchJson<GenerationResponse>(`${apiBaseUrl}/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(
      payload || { mode: 'scenario', scenario_id: 'dense_graph' }
    ),
  });

  const parsed = GenerationResponseSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error('Invalid generate response schema');
  }

  return parsed.data;
}

export async function runAlgorithm<T>(
  apiBaseUrl: string,
  endpoint: string,
  payload: unknown,
  schema: z.ZodSchema<T>
): Promise<T> {
  const data = await fetchJson<T>(`${apiBaseUrl}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    throw new Error('Invalid algorithm response schema');
  }

  return parsed.data;
}
