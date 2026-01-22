import type { ApiResponse, MaskConfig, MaskResult, CallResult } from '../types'

const API_BASE = '/api'

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {},
  apiKey?: string
): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }

  if (apiKey) {
    headers['Authorization'] = `Bearer ${apiKey}`
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}

export async function healthCheck(): Promise<{ status: string }> {
  return fetchApi('/health')
}

export async function configMask(
  maskConfig: MaskConfig,
  apiKey?: string
): Promise<ApiResponse<{ status: string }>> {
  return fetchApi(
    '/config',
    {
      method: 'POST',
      body: JSON.stringify({ maskConfig }),
    },
    apiKey
  )
}

export async function maskText(
  text: string,
  language?: string,
  apiKey?: string
): Promise<ApiResponse<MaskResult>> {
  return fetchApi(
    '/mask_text',
    {
      method: 'POST',
      body: JSON.stringify({ text, language }),
    },
    apiKey
  )
}

export async function restoreText(
  text: string,
  maskMeta: string,
  apiKey?: string
): Promise<ApiResponse<{ text: string }>> {
  return fetchApi(
    '/restore_text',
    {
      method: 'POST',
      body: JSON.stringify({ text, maskMeta }),
    },
    apiKey
  )
}

export async function callLLM(
  text: string,
  apiKeyFile?: string,
  model?: string,
  temperature?: number,
  apiKey?: string
): Promise<ApiResponse<CallResult>> {
  return fetchApi(
    '/call',
    {
      method: 'POST',
      body: JSON.stringify({
        text,
        apiKeyFile,
        model,
        temperature,
      }),
    },
    apiKey
  )
}
