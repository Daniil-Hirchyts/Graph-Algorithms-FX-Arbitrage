import useSWR from 'swr';
import { fetchJson } from './client';
import { HealthResponseSchema, type HealthResponse } from '@/lib/schemas';

const fetcher = async (url: string): Promise<any> => fetchJson(url);

export function useHealth(apiBaseUrl: string) {
  const { data, error, isLoading, mutate } = useSWR<HealthResponse>(
    `${apiBaseUrl}/health`,
    fetcher,
    { refreshInterval: 10000 }
  );

  const parsed = data ? HealthResponseSchema.safeParse(data) : null;

  return {
    data: parsed?.success ? parsed.data : null,
    error: error || (parsed && !parsed.success ? parsed.error : null),
    isLoading,
    mutate,
  };
}
