import type { paths } from '@/api/types'

const API_BASE = '/api'

export async function fetchApi<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`)
  if (!response.ok) {
    throw new Error(`API ${path} failed: ${response.status}`)
  }
  return response.json() as Promise<T>
}

export type HealthResponse =
  paths['/api/health']['get']['responses']['200']['content']['application/json']
